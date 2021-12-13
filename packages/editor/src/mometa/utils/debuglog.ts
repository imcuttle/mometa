// eslint-disable-next-line no-console
const log = console.log.bind(console, '[MOMETA DEBUG]')

export function debuglog(...args: any[]) {
  log(...args)
}
