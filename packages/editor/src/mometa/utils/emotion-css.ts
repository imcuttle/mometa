import createEmotion from '@emotion/css/create-instance/dist/emotion-css-create-instance.esm.js'

const mod = createEmotion({
  key: 'mometa-css'
}) as typeof import('@emotion/css')

export function refresh() {
  mod.flush()
}

export const injectGlobal: typeof import('@emotion/css')['injectGlobal'] = function () {
  return mod.injectGlobal.apply(mod, arguments)
}

refresh()

export const css: typeof mod['css'] = function () {
  return mod.css.apply(this, arguments)
}
