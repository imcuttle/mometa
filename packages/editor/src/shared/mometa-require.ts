export function mometaRequire(path: string) {
  var __mometa_require__ = window.__mometa_require__
  if (!__mometa_require__) {
    var frames = window.frames // 或 // var frames = window.parent.frames;
    for (var i = 0; i < frames.length; i++) {
      // @ts-ignore
      if (typeof frames[i].__mometa_require__ === 'function') {
        // @ts-ignore
        __mometa_require__ = frames[i].__mometa_require__
        break
      }
    }
  }

  return __mometa_require__(path)
}
