// Shared setup for workshop decks. Each deck imports its own pinned reveal.js
// version and passes it in, with the options that deck has always used:
//
//   <script type="module">
//     import Reveal from "../lib/reveal-5.0.4/reveal.esm.js";
//     import Highlight from "../lib/reveal-5.0.4/plugin/highlight/highlight.esm.js";
//     import { initDeck } from "../js/presentation.js";
//     initDeck(Reveal, { plugins: [Highlight] });
//   </script>

const INFO_BOXES = "section[data-background-iframe] > div";

/**
 * @param Reveal the reveal.js constructor (ES module import or the global)
 * @param {object} [settings]
 * @param {Array} [settings.plugins] reveal.js plugins to register
 * @param {Element} [settings.element] element to pass to the constructor, for
 *   decks that passed one
 * @param {string} [settings.infoBoxes] selector for overlay boxes that get a
 *   close (×) button
 * @param {boolean} [settings.fragmented] make children of .fragmented appear
 *   one at a time
 * @param {object} [settings.options] options for deck.initialize()
 */
export function initDeck(Reveal, {
  plugins = [],
  element,
  infoBoxes = INFO_BOXES,
  fragmented = false,
  options = { hash: true, maxScale: 1.5 },
} = {}) {
  document.querySelectorAll(infoBoxes).forEach((div) => {
    const closer = document.createElement("span");
    closer.classList.add("closer");
    closer.innerHTML = "&times;";
    div.appendChild(closer);
    closer.addEventListener("click", () => div.classList.add("hidden"));
  });

  // Links on slides open in a new tab.
  document.querySelectorAll("section a").forEach((a) => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });

  if (fragmented) {
    document.querySelectorAll(".fragmented > *").forEach((el) => el.classList.add("fragment"));
  }

  const deck = element ? new Reveal(element, { plugins }) : new Reveal({ plugins });
  deck.initialize(options);
  return deck;
}
