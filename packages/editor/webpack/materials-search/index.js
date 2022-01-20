const execa = require('execa')
const debounce = require('lodash.debounce')
const memoize = require('memoize-fn')
const QuickLRU = require('quick-lru')

const stringifyOpts = (opts) => {
  if (!opts) {
    return ''
  }

  let optStrs = []
  Object.keys(opts).forEach((name) => {
    optStrs.push(`${name} ${JSON.stringify(opts[name])}`)
  })
  return optStrs.join(' ')
}

const materialsSearch = (exports.materialsSearch = async function materialsSearch(keyword, opts, conf) {
  const data = await execa.command(`npm search ${JSON.stringify(keyword)} ${stringifyOpts(opts)} --json`, conf)
  console.log('data', data)
  return data
})

exports.debouncedMaterialsSearch = debounce(
  memoize.robust(materialsSearch, {
    cache: new QuickLRU({ maxSize: 100, maxAge: 1000 * 60 })
  }),
  200
)
