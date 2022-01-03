# 实现原理

对于 React 生态，通过 babel 插件，编译时注入 JSX 的元信息至 props 中，包括 colNumber, lineNumber, filename 等；

```jsx
<div __mometa={{ start: { line: 9, col: 10 }, end: { line: 10, col: 10 } }}></div>
```

同时为了不影响正常的渲染，不暴露 `__mometa` props，拦截覆盖 `react/jsx-dev-runtime` 中的 `jsxDEV` 方法，用于隐藏 `__mometa`

```jsx
const jsxDEV = JSXDEVRuntime.jsxDEV
JSXDEVRuntime.jsxDEV = function _jsxDev() {
  let [type, props, key, isStaticChildren, source, ...rest] = arguments
  //
  if (props?.__mometa) {
    const __mometa = props?.__mometa
    delete props?.__mometa
    source = {
      ...source,
      __mometa
    }
  }
  return jsxDEV.apply(this, [type, props, key, isStaticChildren, source, ...rest])
}
```

HTMLElement 通过 \_\_reactFiberXX 属性，获取对应 fiber 节点，判断是否为 React 渲染元素，同时拿到层级关系 (`fiber.return`)

![img.png](img.png)

在开发模式下，能够通过 fiber 实例中的 `_debugSource` 获取 mometa 数据  
![img_1.png](img_1.png)

对于可视编辑功能方面实现，依赖 node.js 服务接口修改文件内容，通过语义化分析进行代码内容的 插入、删除、移动 等操作。

其中的操作，只是相当于代码位置
