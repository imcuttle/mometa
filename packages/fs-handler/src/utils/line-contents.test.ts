import { Range, Point, LineContents, createLineContentsByContent } from './line-contents'

describe('content-parser', function () {
  it('should spec', function () {
    const vo = createLineContentsByContent(
      `
    import React, { StrictMode } from "react";
import Tabs from "antd/es/tabs";
import "antd/es/tabs/style/index.css";

type Props = {
  x: string
}

const array = new Array(100).fill(1)

export default function App(props: Props) {

  return (
    <div>
      <h1 title={'abc'}>Hello World</h1>
      <Tabs>
      <Tabs.TabPane key={'tool'} tab={'物料'}>
        <p className='empty'></p>
        <p>单独 p</p>
        {array.map((x, i) => <p key={i}>物料__{i}</p>)}
      </Tabs.TabPane>
      <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
      </Tabs>
    </div>
  )
}
    `.trim(),
      { filename: '/App.tsx' }
    )

    const lines = vo
      .locateByRange({
        start: { line: 19, column: 8 },
        end: { line: 19, column: 19 }
      })
      .map((x) => x.line)
    expect(new LineContents(lines).toString()).toMatchInlineSnapshot(`"<p>单独 p</p>"`)
  })
})
