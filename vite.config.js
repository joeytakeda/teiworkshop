import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { defineConfig } from "vite";

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
const STATIC_ROOT = ["index.html", "editor.html", "css", "js", "images", "spectator", "data", "lib"];

// Files git tracks or would track (so ignored folders such as node_modules
// and leafwriter never ship).
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
  cwd: __dirname,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const top = (f) => f.split("/")[0];
const isStatic = (f) =>
  (SESSION.test(top(f)) && top(f) < STATIC_BEFORE) ||
  STATIC_ROOT.includes(top(f));

const pages = [
  ...files.filter((f) => SESSION.test(top(f)) && top(f) >= STATIC_BEFORE && f.endsWith(".html")),
  ...ALSO_BUILD,
];
const builtDirs = ALSO_BUILD.map((p) => dirname(p) + "/");
const staticFiles = files.filter((f) => isStatic(f) && !builtDirs.some((d) => f.startsWith(d)));

// Build stamp: every page gets the build date and version as <meta> tags.
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));
let commit = process.env.GITHUB_SHA?.slice(0, 7);
try {
  commit ??= execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: __dirname, encoding: "utf8" }).trim();
} catch {
  commit = "unknown";
}
const stamp = `<meta name="build-date" content="${new Date().toISOString()}"/>\n<meta name="build-version" content="${pkg.version}+${commit}"/>`;
const addStamp = (html) => html.replace(/<head\b[^>]*>/i, (head) => `${head}\n${stamp}`);

const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [
    {
      // Raw XML samples can be pasted inside
      //   <code class="language-xml"><script type="text/template">…</script></code>
      // and are escaped at build time, so the code is in the page without JS.
      name: "escape-xml-samples",
      transformIndexHtml: (html) =>
        html.replace(
          /(<code\b[^>]*\blanguage-xml\b[^>]*>)\s*<script type="text\/template">([\s\S]*?)<\/script>\s*(<\/code>)/gi,
          (_, open, xml, close) => open + escapeXml(xml) + close,
        ),
    },
    {
      name: "build-stamp",
      apply: "build",
      transformIndexHtml: addStamp,
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
          if (f.endsWith(".html")) writeFileSync(out, addStamp(readFileSync(join(__dirname, f), "utf8")));
          else copyFileSync(join(__dirname, f), out);
        }
      },
    },
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p.replace(/\.html$/, ""), resolve(__dirname, p)])),
    },
  },
});
