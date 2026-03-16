import mitt from 'mitt';
import { head, toArray } from 'lodash-es'
const emitter = mitt()


const $pub = (...args) => {
  emitter.emit(head(args), args[1])
}

const $sub = (...args) => {
  Reflect.apply(emitter.on, emitter, toArray(args))
}

const $unsub = (...args) => {
  Reflect.apply(emitter.off, emitter, toArray(args))
}
export { $pub, $sub, $unsub }
export default emitter
