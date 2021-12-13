import createEmotion from '@emotion/css/create-instance/dist/emotion-css-create-instance.esm.js'

const mod = createEmotion({
  key: 'mometa-css'
})

export function refresh() {
  mod.flush()
}

refresh()

export const css: typeof mod['css'] = function () {
  return mod.css.apply(this, arguments)
}
