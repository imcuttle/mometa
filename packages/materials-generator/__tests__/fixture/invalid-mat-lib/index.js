module.exports = [
  Promise.resolve(1),
  {
    x: Promise.resolve(1),
    y: [Promise.resolve(1)]
  }
]
