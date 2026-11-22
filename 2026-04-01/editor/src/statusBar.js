/**
 * statusBar.js
 * Updates the bottom status bar with validity, element count, word count,
 * and cursor position.
 */

const validityEl  = document.getElementById('status-validity')
const elementsEl  = document.getElementById('status-elements')
const wordsEl     = document.getElementById('status-words')
const cursorEl    = document.getElementById('status-cursor')

export function setValid() {
  validityEl.className = 'valid'
  validityEl.textContent = '✓ Valid XML'
}

export function setInvalid() {
  validityEl.className = 'invalid'
  validityEl.textContent = '✗ XML Error'
}

export function setStats({ elCount, wordCount }) {
  elementsEl.textContent = `Elements: ${elCount}`
  wordsEl.textContent    = `Words: ${wordCount}`
}

export function setCursor(line, col) {
  cursorEl.textContent = `Ln ${line}, Col ${col}`
}
