import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { defineConfig } from "vite";
import { parseHTML } from "linkedom";

// Workshop folders are named by date (YYYY-MM-DD, optionally with a suffix).
//   - Folders dated before STATIC_BEFORE are archived: copied into dist/ as
//     they are.
//   - Later folders are built by Vite: every .html page in them is an entry.
const STATIC_BEFORE = "2026-11-01";
const SESSION = /^\d{4}-\d{2}-\d{2}/;

// Pages in archived folders that still need Vite (they import npm packages).
const ALSO_BUILD = ["2026-04-01/editor/index.html"];

// Top-level files and folders copied as they are: the landing page, and the
// stylesheet, scripts, images, demos, downloads and libraries shared by decks.
const STATIC_ROOT = [
  "index.html",
  "editor.html",
  "css",
  "js",
  "images",
  "spectator",
  "data",
  "lib",
];

// Files git tracks or would track (so ignored folders such as node_modules
// and leafwriter never ship).
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  {
    cwd: __dirname,
    encoding: "utf8",
  },
)
  .split("\0")
  .filter(Boolean)
  // git still lists tracked files that were deleted but not yet committed
  .filter((f) => existsSync(join(__dirname, f)));

const top = (f) => f.split("/")[0];
const isStatic = (f) =>
  (SESSION.test(top(f)) && top(f) < STATIC_BEFORE) ||
  STATIC_ROOT.includes(top(f));

const pages = [
  ...files.filter(
    (f) =>
      SESSION.test(top(f)) && top(f) >= STATIC_BEFORE && f.endsWith(".html"),
  ),
  ...ALSO_BUILD,
];
const builtDirs = ALSO_BUILD.map((p) => dirname(p) + "/");
const staticFiles = files.filter(
  (f) => isStatic(f) && !builtDirs.some((d) => f.startsWith(d)),
);

// Build stamp: every page gets the build date and version as <meta> tags.
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));
let commit = process.env.GITHUB_SHA?.slice(0, 7);
try {
  commit ??= execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: __dirname,
    encoding: "utf8",
  }).trim();
} catch {
  commit = "unknown";
}

export default defineConfig({
  base: "./",
  publicDir: false,
  logLevel: "info",
  plugins: [
    {
      name: "update-documents",
      transformIndexHtml: {
        order: "pre",
        handler(html, ctx) {
          const { document } = parseHTML(html);

          // Update any of the code block samples;
          const samples = document.querySelectorAll(
            'code.language-xml > script[type="text/template"]',
          );
          samples.forEach((script) => {
            script.parentNode.textContent = script.textContent;
          });
          // Inline any SVGs
          const imgsToProcess = document.querySelectorAll(
            "img[src$='.svg'][data-import='true']",
          );
          imgsToProcess.forEach((img) => {
            const href = resolve(
              dirname(ctx.filename),
              img.getAttribute("src"),
            );
            const contents = readFileSync(href, "utf8");
            const svg = parseHTML(contents).document.querySelector("svg");
            img.replaceWith(svg);
          });
          // Add build stamp
          const head = document.querySelector("head");
          const buildDate = `<meta name="build-date" content="${new Date().toISOString()}"/>`;
          const buildVersion = `<meta name="build-version" content="${pkg.version}+${commit}"/>`;
          head.insertAdjacentHTML("beforeend", `${buildDate}${buildVersion}`);

          // And now return the document
          return document.toString();
        },
      },
    },
    {
      // Copy archived workshops and shared folders into dist/ unchanged
      // (apart from the build stamp on HTML pages).
      name: "copy-static",
      apply: "build",
      closeBundle() {
        for (const f of staticFiles) {
          const out = join(__dirname, "dist", f);
          mkdirSync(dirname(out), { recursive: true });
          copyFileSync(join(__dirname, f), out);
        }
      },
    },
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p.replace(/\.html$/, ""), resolve(__dirname, p)]),
      ),
    },
  },
});
