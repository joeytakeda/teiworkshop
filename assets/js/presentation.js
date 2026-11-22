// Entry point for decks built with Vite. A deck uses it with:
//   <html data-style="2024">
//   <script type="module" src="../assets/js/presentation.js"></script>
// Raw XML samples inside <code class="language-xml"><script type="text/template">
// are escaped at build time (see vite.config.js).
import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";
import Notes from "reveal.js/plugin/notes/notes.esm.js";
import { initDeck } from "../../js/presentation.js";
import "../css/presentation.css";

initDeck(Reveal, { plugins: [Highlight, Markdown, Notes], fragmented: true });
