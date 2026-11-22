# TEI Workshop — Live Encoder

A split-pane TEI encoding environment for classroom use.  
Left pane: schema-aware XML editor (CodeMirror 5).  
Right pane: live preview via [CETEIcean](https://github.com/TEIC/CETEIcean).

---

## Quick start

The editor is built as part of the workshops site. From the repository root:

```bash
npm install
npm run dev
```

Then open `/2026-04-01/editor/` at the URL printed in your terminal (usually `http://localhost:5173`).

---

## Build for distribution

From the repository root, `npm run build` builds the whole site. The editor
ends up at `dist/2026-04-01/editor/index.html`.

---

## Project structure

```
tei-workshop/
├── index.html               # App shell (Vite entry point)
└── src/
    ├── main.js              # Entry point — wires all modules together
    ├── style.css            # Global styles + CETEIcean TEI rendering rules
    ├── editor.js            # CodeMirror 5 setup, hints, snippet insertion
    ├── preview.js           # CETEIcean rendering
    ├── teiSchema.js         # TEI subset schema for autocomplete
    ├── defaultDocument.js   # Starter TEI document (Jane Austen letter)
    ├── snippets.js          # Insert-toolbar snippet templates
    ├── xmlUtils.js          # XML parse, pretty-print, stats
    ├── statusBar.js         # Bottom status bar updates
    └── divider.js           # Draggable pane resizer
```

---

## Features

| Feature | Detail |
|---|---|
| Schema-aware autocomplete | `Ctrl+Space` — element names, attributes, common values |
| Auto close tags | Typing `>` closes the tag automatically |
| Code folding | Click the gutter arrows to collapse elements |
| Snippet toolbar | One-click insertion of common TEI elements |
| Wrap selection | Select text, then click a snippet to wrap it |
| Live preview | Auto-renders ~1 s after you stop typing |
| CETEIcean preview | `<persName>`, `<placeName>`, `<date>`, `<note>`, `<hi>`, verse, etc. |
| XML validation | Status bar shows parse errors inline |
| Format XML | `⌥ Format` button or `Alt+F` |
| Resizable panes | Drag the centre divider |

---

## Extending the schema

Edit `src/teiSchema.js` to add more elements or attributes to the autocomplete.  
Edit `src/style.css` (the CETEIcean section) to change how rendered elements look.  
Edit `src/defaultDocument.js` to change the starter document for students.
