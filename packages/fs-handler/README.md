# @mometa/fs-handler

[![NPM version](https://img.shields.io/npm/v/@mometa/fs-handler.svg?style=flat-square)](https://www.npmjs.com/package/@mometa/fs-handler)
[![NPM Downloads](https://img.shields.io/npm/dm/@mometa/fs-handler.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/@mometa/fs-handler)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> 代码操作转换核心逻辑，如删除、移动、替换、插入等

## Installation

```bash
npm install @mometa/fs-handler
# or use yarn
yarn add @mometa/fs-handler
```

## Usage

```javascript
const { createFsHandler, commonMiddlewares } = require('@mometa/fs-handler')
const handle = createFsHandler({
  middlewares: commonMiddlewares(),
  fs: require('fs')
})

handle(requestData).then(console.log)
```

### RequestData

```typescript
export interface CommonPreload extends Range {
  filename: string
  text: string
}

// 删除
export interface DelPreload extends CommonPreload {}
// 替换
export interface ReplacePreload extends CommonPreload {
  data: {
    // 替换为哪个文本
    newText: string
  }
}
// 移动
export interface MoveNodePreload extends CommonPreload {
  data: {
    // 移动到哪个位置
    to: Point
  }
}
// 插入
export interface InsertNodePreload {
  // 插入在哪个文件
  filename: string
  // 插入在哪个位置
  to: Point
  data: {
    // 插入文本
    newText?: string
    wrap?: {
      anotherTo: Point
      startStr: string
      endStr: string
    }
    // 插入物料
    material?: Asset['data']
  }
}

export type RequestData =
  | {
      type: OpType.DEL
      preload: DelPreload
    }
  | {
      type: OpType.REPLACE_NODE
      preload: ReplacePreload
    }
  | {
      type: OpType.MOVE_NODE
      preload: MoveNodePreload
    }
  | {
      type: OpType.INSERT_NODE
      preload: InsertNodePreload
    }
```

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by [imcuttle](mailto:imcuttle@163.com).

## License

MIT - [imcuttle](mailto:imcuttle@163.com)
