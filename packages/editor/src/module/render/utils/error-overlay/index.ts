import formatWebpackMessages from './formatWebpackMessages'

var stripAnsi = require('strip-ansi')
var ErrorOverlay = require('react-error-overlay')
// @ts-ignore

export function setEditorHandler(fn) {
  ErrorOverlay.setEditorHandler(fn)
}
// ErrorOverlay.setEditorHandler(function editorHandler(errorLocation) {
//   // Keep this sync with errorOverlayMiddleware.js
//   fetch(
//     '/sadsa' +
//       '?fileName=' +
//       window.encodeURIComponent(errorLocation.fileName) +
//       '&lineNumber=' +
//       window.encodeURIComponent(errorLocation.lineNumber || 1) +
//       '&colNumber=' +
//       window.encodeURIComponent(errorLocation.colNumber || 1)
//   )
// })

var hadRuntimeError = false
ErrorOverlay.startReportingRuntimeErrors({
  onError: function () {
    hadRuntimeError = true
  },
  filename: '/static/js/bundle.js'
})

if (module.hot && typeof module?.hot?.dispose === 'function') {
  module.hot.dispose(function () {
    // TODO: why do we need this?
    ErrorOverlay.stopReportingRuntimeErrors()
  })
}

let hasErrors = false

function clearOutdatedErrors() {
  // Clean up outdated compile errors, if any.
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
    if (hasErrors) {
      console.clear()
      hasErrors = false
    }
  }
}

export function handleErrors(errors) {
  clearOutdatedErrors()

  // "Massage" webpack messages.
  var formatted = formatWebpackMessages({
    // errors: errors.map(err => stripAnsi(String(err))),
    errors,
    warnings: []
  })

  console.log(formatted, errors)

  // Only show the first error.
  ErrorOverlay.reportBuildError(formatted.errors[0])

  // console.

  // Also log them to the console.
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    for (var i = 0; i < formatted.errors.length; i++) {
      console.error(stripAnsi(formatted.errors[i]))
      hasErrors = true
    }
  }

  return () => {
    clearOutdatedErrors()
    ErrorOverlay.dismissBuildError()
    ErrorOverlay.dismissRuntimeErrors()
    hasErrors = false
  }
}
