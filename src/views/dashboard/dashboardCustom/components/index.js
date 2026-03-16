

import { markRaw } from 'vue'
const files = import.meta.glob('./**/*.vue', { eager: true })

const comps = Object.entries(files).reduce((acc, [name, module]) => {
  const key = name.replace(/^\.\/(.*)\.\w+$/, '$1').replace(/\/index$/, '')
  acc[key] = module.default
  return acc
}, {})

export default markRaw(comps)

