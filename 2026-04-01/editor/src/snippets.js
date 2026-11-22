/**
 * snippets.js
 * Templates for the "Insert" toolbar buttons.
 *
 * Each entry has:
 *   open   — text inserted before the selection (or cursor)
 *   close  — text inserted after the selection (empty string for self-closing)
 *   select — if true, place the cursor inside the tag after insertion
 */

export const SNIPPETS = {
  persName: { open: '<persName ref="">', close: "</persName>", select: true },
  placeName: {
    open: '<placeName ref="">',
    close: "</placeName>",
    select: true,
  },
  date: { open: '<date when="">', close: "</date>", select: true },
  emph: { open: "<emph>", close: "</emph>", select: true },
  note: { open: '<note type="editorial">', close: "</note>", select: true },
  div: {
    open: "<div>",
    close: "</div>",
    select: false,
  },
  p: { open: "<p>", close: "</p>", select: true },
  lb: { open: "<lb/>", close: "", select: false },
  unclear: { open: "<unclear>", close: "</unclear>", select: true },
  supplied: { open: "<supplied>", close: "</supplied>", select: true },
};
