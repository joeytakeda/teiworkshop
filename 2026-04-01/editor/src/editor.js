/**
 * editor.js
 * Sets up the CodeMirror 5 instance with:
 *   - XML mode + Dracula theme
 *   - Schema-aware Ctrl+Space autocomplete
 *   - Auto close tags, fold gutter, line numbers
 */

import CodeMirror from 'codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'

// CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/dialog/dialog.css'

import { buildXMLSchemaInfo } from './teiSchema.js'
import { TEI_SCHEMA } from './teiSchema.js'

const schemaInfo = buildXMLSchemaInfo(TEI_SCHEMA)

/**
 * Create and return a configured CodeMirror editor instance.
 * @param {HTMLTextAreaElement} textarea
 * @param {{ onCursorChange: Function, onChange: Function }} callbacks
 */
export function createEditor(textarea, { onCursorChange, onChange } = {}) {
  const editor = CodeMirror.fromTextArea(textarea, {
    mode: 'xml',
    theme: 'dracula',
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    matchBrackets: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    extraKeys: {
      'Ctrl-Space': triggerHint,
      'Alt-F': (_cm) => {
        // Dispatch a custom event the main module can listen to
        textarea.dispatchEvent(new CustomEvent('tei:format', { bubbles: true }))
      },
    },
    hintOptions: { schemaInfo, alignWithWord: true, closeOnUnfocus: true },
  })

  if (onCursorChange) {
    editor.on('cursorActivity', () => {
      const c = editor.getCursor()
      onCursorChange(c.line + 1, c.ch + 1)
    })
  }

  if (onChange) {
    editor.on('change', onChange)
  }

  return editor
}

function triggerHint(cm) {
  CodeMirror.showHint(cm, CodeMirror.hint.xml, {
    schemaInfo,
    alignWithWord: true,
    closeOnUnfocus: true,
  })
}

/**
 * Insert a snippet into the editor at the current cursor / selection.
 * @param {CodeMirror.Editor} editor
 * @param {{ open: string, close: string, select: boolean }} snippet
 */
export function insertSnippet(editor, snippet) {
  const doc = editor.getDoc()
  const cursor = doc.getCursor()
  const selection = doc.getSelection()

  if (selection && snippet.close) {
    doc.replaceSelection(snippet.open + selection + snippet.close)
  } else {
    doc.replaceRange(snippet.open + snippet.close, cursor)
    if (snippet.close && snippet.select) {
      doc.setCursor({ line: cursor.line, ch: cursor.ch + snippet.open.length })
    }
  }
  editor.focus()
}
