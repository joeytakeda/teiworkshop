/**
 * xmlUtils.js
 * Helpers for XML validation and pretty-printing.
 */

/**
 * Parse an XML string with DOMParser.
 * Returns { doc, error } where error is a string message or null.
 */
export function parseXML(xml) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const parseError = doc.querySelector('parseerror, parsererror')
  if (parseError) {
    return { doc: null, error: parseError.textContent.trim() }
  }
  return { doc, error: null }
}

/**
 * Naïve but readable XML pretty-printer.
 * Handles most well-formed TEI documents without external dependencies.
 */
export function prettyPrintXML(xml) {
  let indent = 0
  const tab = '  '
  const lines = []

  // Normalise whitespace between tags
  const parts = xml.replace(/>\s*</g, '>\n<').split('\n')

  for (let part of parts) {
    part = part.trim()
    if (!part) continue

    const isClosing      = part.startsWith('</')
    const isSelfClosing  = part.endsWith('/>')
    const isProcessing   = part.startsWith('<?')
    const isOpening      = part.startsWith('<') && !isClosing && !isSelfClosing && !isProcessing && part.includes('<')

    if (isClosing) indent = Math.max(0, indent - 1)

    lines.push(tab.repeat(indent) + part)

    if (isOpening && !part.includes('</')) indent++
  }

  return lines.join('\n')
}

/**
 * Count elements and words in a parsed document for the status bar.
 */
export function docStats(xml, doc) {
  const elCount = (xml.match(/<[a-zA-Z]/g) ?? []).length
  const text = doc
    ? doc.documentElement?.textContent ?? ''
    : xml.replace(/<[^>]+>/g, ' ')
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return { elCount, wordCount }
}
