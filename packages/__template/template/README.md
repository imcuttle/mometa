# {{{packagePrefix}}}{{{name}}}

[![NPM version](https://img.shields.io/npm/v/{{{packagePrefix}}}{{{name}}}.svg?style=flat-square)](https://www.npmjs.com/package/{{{packagePrefix}}}{{{name}}})
[![NPM Downloads](https://img.shields.io/npm/dm/{{{packagePrefix}}}{{{name}}}.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/{{{packagePrefix}}}{{{name}}})
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> {{description}}

## Installation

```bash
npm install {{{packagePrefix}}}{{name}}
# or use yarn
yarn add {{{packagePrefix}}}{{name}}
```

## Usage

```javascript
{{#if useTs}}
import {{camelCase name}} from '{{{packagePrefix}}}{{name}}'
{{else}}
const {{camelCase name}} = require('{{{packagePrefix}}}{{name}}')
{{/if}}
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

This library is written and maintained by [{{_.git.name}}](mailto:{{_.git.email}}).

## License

MIT - [{{_.git.name}}](mailto:{{_.git.email}})
