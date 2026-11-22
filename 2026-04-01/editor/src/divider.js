/**
 * divider.js
 * Makes the centre divider draggable to resize the two panes.
 */

/**
 * @param {CodeMirror.Editor} editor — needed to call .refresh() after resize
 */
export function initDivider(editor) {
  const divider   = document.getElementById('divider')
  const leftPane  = document.getElementById('editor-pane')
  const workspace = document.getElementById('workspace')
  let dragging = false

  divider.addEventListener('mousedown', () => {
    dragging = true
    divider.classList.add('dragging')
    document.body.style.cursor     = 'col-resize'
    document.body.style.userSelect = 'none'
  })

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return
    const rect  = workspace.getBoundingClientRect()
    let ratio   = (e.clientX - rect.left) / rect.width
    ratio = Math.max(0.2, Math.min(0.8, ratio))
    leftPane.style.flex = `0 0 ${ratio * 100}%`
    editor.refresh()
  })

  document.addEventListener('mouseup', () => {
    if (!dragging) return
    dragging = false
    divider.classList.remove('dragging')
    document.body.style.cursor     = ''
    document.body.style.userSelect = ''
    editor.refresh()
  })
}
