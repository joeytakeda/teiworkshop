/**
 * teiSchema.js
 * A TEI subset schema for workshop use.
 * Each entry maps an element name to its allowed children and attributes.
 */

export const TEI_SCHEMA = {
  elements: {
    TEI: { children: ["teiHeader", "text"], attrs: ["xmlns"] },
    teiHeader: { children: ["fileDesc"], attrs: [] },
    fileDesc: {
      children: ["titleStmt", "publicationStmt", "sourceDesc"],
      attrs: [],
    },
    titleStmt: { children: ["title", "author"], attrs: [] },
    title: { children: [], attrs: ["level", "type"] },
    author: { children: [], attrs: [] },
    publicationStmt: { children: ["p"], attrs: [] },
    sourceDesc: { children: ["p", "bibl"], attrs: [] },
    bibl: {
      children: ["title", "author", "date", "publisher", "pubPlace"],
      attrs: [],
    },
    text: { children: ["body", "front", "back"], attrs: [] },
    body: { children: ["div", "p", "lg"], attrs: [] },
    front: { children: ["div", "p"], attrs: [] },
    back: { children: ["div", "p"], attrs: [] },
    div: {
      children: ["head", "p", "div", "lg", "list", "table"],
      attrs: ["type", "n", "xml:id"],
    },
    head: { children: ["hi", "title"], attrs: ["type"] },
    p: {
      children: [
        "hi",
        "persName",
        "placeName",
        "date",
        "note",
        "lb",
        "gap",
        "unclear",
        "supplied",
      ],
      attrs: ["n", "xml:id", "rend"],
    },
    hi: { children: [], attrs: ["rend"] },
    persName: {
      children: ["forename", "surname"],
      attrs: ["ref", "key", "role"],
    },
    placeName: {
      children: ["settlement", "region", "country"],
      attrs: ["ref", "key"],
    },
    date: { children: [], attrs: ["when", "from", "to", "cert"] },
    note: { children: ["p"], attrs: ["type", "n", "resp"] },
    lb: { children: [], attrs: ["n", "break"] },
    gap: { children: [], attrs: ["reason", "extent", "unit"] },
    unclear: { children: [], attrs: ["reason", "cert"] },
    supplied: { children: [], attrs: ["reason", "cert"] },
    lg: { children: ["l", "head"], attrs: ["type", "n"] },
    l: { children: ["hi", "persName", "placeName"], attrs: ["n", "rhyme"] },
    list: { children: ["item", "head"], attrs: ["type"] },
    item: { children: ["hi", "persName", "placeName"], attrs: ["n"] },
    table: { children: ["row"], attrs: [] },
    row: { children: ["cell"], attrs: [] },
    cell: { children: [], attrs: ["cols", "rows"] },
    forename: { children: [], attrs: [] },
    surname: { children: [], attrs: [] },
    settlement: { children: [], attrs: [] },
    region: { children: [], attrs: [] },
    country: { children: [], attrs: [] },
    publisher: { children: [], attrs: [] },
    pubPlace: { children: [], attrs: [] },
  },
};

/** Suggested values for common attributes */
const ATTR_VALUES = {
  rend: ["italic", "bold", "underline", "small-caps"],
  level: ["a", "m", "s", "j"],
  type: ["editorial", "gloss", "letter", "verse", "prose"],
  break: ["yes", "no"],
  cert: ["high", "medium", "low", "unknown"],
  unit: ["chars", "words", "lines"],
  reason: ["illegible", "damage", "faded"],
};

/**
 * Build a CodeMirror xml-hint schemaInfo object from TEI_SCHEMA.
 */
export function buildXMLSchemaInfo(schema) {
  const out = { "!top": Object.keys(schema.elements) };
  for (const [el, data] of Object.entries(schema.elements)) {
    const attrs = {};
    for (const a of data.attrs) {
      attrs[a] = ATTR_VALUES[a] ?? null;
    }
    out[el] = { children: data.children, attrs };
  }
  return out;
}
