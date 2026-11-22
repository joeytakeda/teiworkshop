/**
 * preview.js
 * Handles rendering TEI XML into the preview pane using CETEIcean.
 *
 * CETEIcean works by converting a parsed TEI DOM into HTML5 custom elements
 * (e.g. <tei-p>, <tei-persname>) which are then styled via CSS.
 */

import CETEI from 'CETEIcean'

const outputEl      = document.getElementById('preview-output')
const errorEl       = document.getElementById('preview-error')
const placeholderEl = document.getElementById('preview-placeholder')

let firstRender = true

/**
 * Render a parsed XML document into the preview pane via CETEIcean.
 * @param {Document} xmlDoc — already-parsed, valid XML document
 */
export function renderDocument(xmlDoc) {
  clearError()
  if (firstRender) {
    placeholderEl.style.display = 'none'
    firstRender = false
  }
  outputEl.innerHTML = ''

  try {
    const ct = new CETEI()
    ct.domToHTML5(xmlDoc, (data) => {
      outputEl.appendChild(data)
    })
  } catch (err) {
    showError('CETEIcean error:\n' + err.message)
  }
}

/**
 * Show an XML parse error in the preview pane.
 * @param {string} message
 */
export function showError(message) {
  outputEl.innerHTML = ''
  errorEl.style.display = 'block'
  errorEl.textContent = '⚠ ' + message
}

export function clearError() {
  errorEl.style.display = 'none'
  errorEl.textContent = ''
}
