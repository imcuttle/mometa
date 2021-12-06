import React from 'react'
import p from 'prefix-classname'
import { useDragDropManager } from 'react-dnd'
import { CLS_PREFIX } from '../../../config/const'
import { addModule } from '../../utils/externals-modules'

const Dnd = require('react-dnd')

const cn = p('')
const c = p(`${CLS_PREFIX}-stage`)

import './style.scss'

import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react'

const CustomSandpack = ({ bundlerURL }) => (
  <div className={c('__sandpack')}>
    <SandpackProvider
      bundlerURL={bundlerURL}
      customSetup={{
        files: {
          '/App.tsx': {
            code: `
import React, { StrictMode } from "react";
import Tabs from "antd/es/tabs";
import "antd/es/tabs/style/index.css";

type Props = {
  x: string
}
export default function App(props: Props) {
  return (
    <div>
      <h1 title={'abc'}>Hello World</h1>
      <Tabs>
      <Tabs.TabPane key={'tool'} tab={'物料'}>
        <p>物料</p>
        <p className='empty'></p>
      </Tabs.TabPane>
      <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
      </Tabs>
    </div>
  )
}
`
          },
          '/index.tsx': {
            code: `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`
          },
          '/styles.css': {
            code: `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`
          },
          '/public/index.html': {
            code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
          }
        },
        dependencies: {
          react: '^17.0.0',
          'react-dom': '^17.0.0',
          'react-scripts': '^4.0.0',
          antd: '^4.17.0'
        },
        entry: '/index.tsx',
        // main: '/App.tsx',
        environment: 'create-react-app-typescript'
      }}
    >
      <SandpackLayout>
        {/*<SandpackCodeEditor showLineNumbers showInlineErrors />*/}
        <SandpackPreview showNavigator viewportOrientation={'landscape'} />
      </SandpackLayout>
    </SandpackProvider>
  </div>
)

export interface StageProps {
  className?: string
  bundlerURL?: string
}

const Stage: React.FC<StageProps> = React.memo(({ className, bundlerURL }) => {
  const ddManager = useDragDropManager()
  React.useLayoutEffect(() => {
    addModule('react-dnd', {
      ...Dnd,
      DndProvider: (props) => <Dnd.DndProvider {...props} manager={ddManager} />
    })
  }, [ddManager])

  return (
    <div className={cn(c(), className)}>
      <CustomSandpack bundlerURL={bundlerURL} />

      {/*<Iframe*/}
      {/*  src={previewFrameUrl}*/}
      {/*  channel={'editor-preview'}*/}
      {/*  methods={{*/}
      {/*    pong: () => {*/}
      {/*      console.log("call 'pong'")*/}
      {/*      return 'pong'*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  side={0}*/}
      {/*/>*/}
    </div>
  )
})

Stage.defaultProps = {
  bundlerURL: location.origin + '/bundler.html'
}

export default Stage
