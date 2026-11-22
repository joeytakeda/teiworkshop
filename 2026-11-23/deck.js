// Deck entry for 2026-11-23 (index.html).
//
// ?drafts in the URL shows a badge on slides marked data-draft.
import Reveal from "reveal.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";
import Notes from "reveal.js/plugin/notes/notes.esm.js";
import { initDeck } from "../js/presentation.js";
import "./deck.css";

if (new URLSearchParams(location.search).has("drafts")) {
  document.documentElement.classList.add("show-drafts");
}

// Long URLs get line-break opportunities (from Lethbridge-2026).
document.querySelectorAll("section a").forEach((a) => {
  if (a.textContent.startsWith("http")) {
    a.innerHTML = a.textContent
      .split("//")
      .map((s) => s.replace(/([/~.,\-_?#%])/g, "<wbr>$1"))
      .join("//<wbr>");
  }
});

initDeck(Reveal, {
  plugins: [Highlight, Notes],
  fragmented: true,
  options: {
    hash: true,
    maxScale: 1.5,
    width: 1280,
    height: 720,
    margin: 0.06,
    transition: "fade",
    transitionSpeed: "fast",
    backgroundTransition: "fade",
    autoAnimateDuration: 0.7,
    autoAnimateEasing: "ease-out",
    slideNumber: "c",
    controlsTutorial: false,
    progress: true,
  },
});
