import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

const modules = import.meta.glob('./modules/*.js', { eager: true })

export const useStore = () => {
  return Object.keys(modules).reduce((acc, path) => {
    const name = path.replace(/^\.\/modules\/(.*)\.js$/, '$1')
    acc[name] = modules[path].default()
    return acc
  }, {})
}

export function setupStore(app) {
  app.use(store)
}
export default store
