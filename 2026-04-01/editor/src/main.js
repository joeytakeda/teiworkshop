/**
 * main.js
 * Application entry point.
 * Imports all modules and wires together the editor, preview, toolbar,
 * snippet bar, status bar, and resizable divider.
 */

// Fonts are bundled with the site instead of loaded from Google Fonts.
import "@fontsource/im-fell-english/400.css";
import "@fontsource/im-fell-english/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/700.css";
import "./style.css";

import { createEditor, insertSnippet } from "./editor.js";
import { renderDocument, showError } from "./preview.js";
import { setValid, setInvalid, setStats, setCursor } from "./statusBar.js";
import { initDivider } from "./divider.js";
import { DEFAULT_TEI } from "./defaultDocument.js";
import { SNIPPETS } from "./snippets.js";
import { parseXML, prettyPrintXML, docStats } from "./xmlUtils.js";

// ── Create editor ────────────────────────────────────────────────────────────
const textarea = document.getElementById("tei-editor");
// ── Render with debounce ─────────────────────────────────────────────────────
let renderTimer = null;

function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, 900);
}

const editor = createEditor(textarea, {
  onCursorChange: (line, col) => setCursor(line, col),
  onChange: scheduleRender,
});

editor.setValue(DEFAULT_TEI);

// ── Divider ──────────────────────────────────────────────────────────────────
initDivider(editor);

function render() {
  const xml = editor.getValue();
  const { doc, error } = parseXML(xml);

  if (error) {
    setInvalid();
    showError("XML Parse Error:\n" + error);
    const stats = docStats(xml, null);
    setStats(stats);
    return;
  }

  setValid();
  setStats(docStats(xml, doc));
  renderDocument(doc);
}

// ── Toolbar buttons ──────────────────────────────────────────────────────────
document.getElementById("btn-render").addEventListener("click", render);

document.getElementById("btn-format").addEventListener("click", () => {
  const xml = editor.getValue();
  try {
    editor.setValue(prettyPrintXML(xml));
  } catch (_) {
    // If XML is broken we silently skip formatting
  }
});

document.getElementById("btn-reset").addEventListener("click", () => {
  if (confirm("Reset the editor to the default TEI document?")) {
    editor.setValue(DEFAULT_TEI);
    render();
  }
});

// Also handle the Alt-F shortcut dispatched from editor.js
textarea.addEventListener("tei:format", () => {
  const xml = editor.getValue();
  try {
    editor.setValue(prettyPrintXML(xml));
  } catch (_) {}
});

// ── Snippet bar ───────────────────────────────────────────────────────────────
document.querySelectorAll(".snip[data-snippet]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.snippet;
    const snippet = SNIPPETS[key];
    if (snippet) insertSnippet(editor, snippet);
  });
});

// ── Initial render ────────────────────────────────────────────────────────────
setTimeout(render, 200);
