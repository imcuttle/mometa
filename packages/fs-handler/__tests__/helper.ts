/** * @file helper */ const nps = require('path')

export function fixture(...args: string[]) {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(...args))
}

export function readContent(...args: string[]) {
  return require('fs').readFileSync(fixture(...args), 'utf-8')
}
