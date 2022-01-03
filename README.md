<p align="center">
  <img src="./images/logo.png" />
</p>
<p align="center">
  <a href="https://github.com/imcuttle/mometa/actions"><img src="https://img.shields.io/github/workflow/status/imcuttle/mometa/Test/master?style=flat-square" /></a>
  <a href="https://codecov.io/github/imcuttle/mometa?branch=master"><img src="https://img.shields.io/codecov/c/github/imcuttle/mometa/master.svg?style=flat-square" /></a>
  <a href="https://prettier.io/"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" /></a>
  <a href="https://lernajs.io/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square" /></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square" /></a>
</p>

<p align="center">
面向研发的低代码元编程（代码可视化）能力</p>

---

<!-- toc -->

- [背景](#%E8%83%8C%E6%99%AF)
- [特性](#%E7%89%B9%E6%80%A7)
- [使用场景](#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)
  - [新开发一个页面](#%E6%96%B0%E5%BC%80%E5%8F%91%E4%B8%80%E4%B8%AA%E9%A1%B5%E9%9D%A2)
  - [已有历史项目，需要迭代功能，只在某一小块 ui 模块内](#%E5%B7%B2%E6%9C%89%E5%8E%86%E5%8F%B2%E9%A1%B9%E7%9B%AE%E9%9C%80%E8%A6%81%E8%BF%AD%E4%BB%A3%E5%8A%9F%E8%83%BD%E5%8F%AA%E5%9C%A8%E6%9F%90%E4%B8%80%E5%B0%8F%E5%9D%97-ui-%E6%A8%A1%E5%9D%97%E5%86%85)
- [操作演示](#%E6%93%8D%E4%BD%9C%E6%BC%94%E7%A4%BA)
  - [编辑](#%E7%BC%96%E8%BE%91)
    - [反向定位](#%E5%8F%8D%E5%90%91%E5%AE%9A%E4%BD%8D)
    - [插入物料](#%E6%8F%92%E5%85%A5%E7%89%A9%E6%96%99)
    - [删除视图](#%E5%88%A0%E9%99%A4%E8%A7%86%E5%9B%BE)
    - [移动视图](#%E7%A7%BB%E5%8A%A8%E8%A7%86%E5%9B%BE)
    - [编辑代码](#%E7%BC%96%E8%BE%91%E4%BB%A3%E7%A0%81)
  - [预览](#%E9%A2%84%E8%A7%88)
- [如何实现](#%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0)
- [如何使用](#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8)
  - [安装依赖](#%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96)
  - [使用 antd 物料](#%E4%BD%BF%E7%94%A8-antd-%E7%89%A9%E6%96%99)
  - [接入编辑器](#%E6%8E%A5%E5%85%A5%E7%BC%96%E8%BE%91%E5%99%A8)
- [NPM 包](#npm-%E5%8C%85)
- [作者](#%E4%BD%9C%E8%80%85)

<!-- tocstop -->

## 背景

mometa 不是传统主流的低代码平台（如 amis/云凤蝶），mometa 是面向研发的、代码可视设计编辑平台；它更像是 dreamweaver、gui 可视编辑 之于 程序员。

**它用于解决的问题有：**

- 对低代码平台不形成依赖，二次开发可以无缝进入代码开发模式
- 同时支持所见即所得的可视编辑，用于提效，提升开发体验
- 提供物料生态，可自定义物料，提升物料使用体验，提升复用率

<p align="center">
  <img src="./images/snapshot.png" />
</p>

## 特性

- 面向研发的代码可视化编辑，直接作用于源码
  - 反向定位（视图定位源码）
  - 拖拽插入物料
  - 拖拽移动
  - 上下移动
  - 删除
  - 替换
  - 层级选择
- 开放物料生态，可定制团队内物料库，见 [mometa-mat](https://github.com/imcuttle/mometa-mat)
- 多语言、多生态支持，目前暂只支持 React
- 接入友好，Webpack>=4 插件化接入
- 开发友好，物料库支持热更新，不破坏已有开发模式

## 使用场景

#### 新开发一个页面

1.  使用团队开发指令，新增一个空的占位路由 & 页面
2.  进入 mometa，查看本地物料，和远端物料市场，选中自己需要的物料，直接拖拽，基本成型的页面布局完成
3.  进入 ide，完成数据联调，数据传递等，源码开发

#### 已有历史项目，需要迭代功能，只在某一小块 ui 模块内

1.  进入 mometa，物料操作插入
2.  反向定位直接进入 ide 源码开发

## 操作演示

#### 编辑

##### 反向定位

支持从视图定位代码位置
![](./images/mometa-locate.gif)

##### 插入物料

可视化插入物料
![](./images/mometa-insert-material.gif)

##### 删除视图

![](./images/mometa-delete.gif)

##### 移动视图

![](./images/mometa-move.gif)

##### 编辑代码

![](./images/mometa-code-edit.gif)

#### 预览

单页应用中的路由跳转能够进行拦截控制，其他和正常预览保持一致

![](./images/mometa-preview-url.gif)

## 如何实现

见 [mometa 实现原理](./docs/how-to-work.md)

## 如何使用

#### 安装依赖

```bash
npm i @mometa/materials-generator @mometa/editor -D
```

#### 使用 antd 物料

1.  安装 antd 物料

```bash
npm i @mometa-mat/antd -D
```

2.  在项目根目录中创建 `mometa-material.config.js`

```jsx
const { resolveLibMatConfig } = require('@mometa/materials-generator')

module.exports = [resolveLibMatConfig('antd')]
```

你也可以创建自己的物料库，数据结构规则见 [Material 定义](./packages/materials-generator/src/types.ts)

#### 接入编辑器

`webpack.config.js` 修改如下：

```js
const MometaEditorPlugin = require('@mometa/editor/webpack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        // 注意，只需要处理你需要编辑的文件目录
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [isEnvDevelopment && require.resolve('@mometa/editor/babel/plugin-react')]
        }
      }
    ]
  },
  plugins: [isEnvDevelopment && new MometaEditorPlugin()]
}
```

**注意：使用时，不需要开启官方预设的 react-refresh，mometa 默认会开启 react-refresh 能力**

启动 webpack dev server，开启 `http://localhost:${port}/mometa/` 即可

提供的例子可见 [@mometa/app](./packages/app)

## NPM 包

- [@mometa/editor](packages/editor) - 编辑器
- [@mometa/fs-handler](packages/fs-handler) - 代码操作转换核心逻辑，如删除、移动、替换、插入等
- [@mometa/materials-generator](packages/materials-generator) - 物料生成 & 解析
- [@mometa/react-refresh-webpack-plugin](packages/react-refresh-webpack-plugin) - An **EXPERIMENTAL** Webpack plugin to enable "Fast Refresh" (also previously known as _Hot Reloading_) for React components.

## 作者

This library is written and maintained by imcuttle, <a href="mailto:imcuttle@163.com">imcuttle@163.com</a>.
