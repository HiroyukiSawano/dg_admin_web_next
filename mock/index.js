import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

const modules = import.meta.glob('./**/*.js', { eager: true })
const mockModules = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) return
  if (key.includes('/index.js')) return

  const module = modules[key]
  mockModules.push(...module.default)
})

export const setupProdMockServer = () => {
  createProdMockServer(mockModules)
}
