module.exports = function createFileWatcherApi(major) {
  if (major < 5) {
    return require('./webpack4-file-watcher-api')
  } else {
    return require('./webpack5-file-watcher-api')
  }
}
