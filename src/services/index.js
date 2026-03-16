const context = import.meta.glob('./modules/*.js', { eager: true })

const modules = Object.keys(context).reduce((acc, path) => {
  const name = path.replace(/^\.\/modules\/(.*)\.js$/, '$1')
  acc[name] = context[path].default
  return acc
}, {})

export default modules
