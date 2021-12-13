import createEmotion from '@emotion/css/create-instance/dist/emotion-css-create-instance.esm.js'

const { css, flush } = createEmotion({
  key: 'mometa-css'
}) as typeof import('@emotion/css')

export { css, flush }
