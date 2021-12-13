// @ts-ignore
// @ts-ignore
import { overingNodeSubject, selectedNodeSubject } from '@@__mometa-external/shared'
import { flush } from '../../../utils/emotion-css'

export class HmrManager {
  fns = []

  addMountListener(fn) {
    this.fns.push(fn)
  }

  mount() {
    this.fns.forEach((fn) => fn())
    this.fns = []

    this.addMountListener(() => {
      selectedNodeSubject.next(null)
      overingNodeSubject.next(null)
      flush()
    })
  }
}

export const hmrManager = new HmrManager()
