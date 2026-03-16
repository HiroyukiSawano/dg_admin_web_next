export const errorHandler = (error, vm) => {
  // 过滤请求错误
  if (error.status || error.status === 0) {
    return false
  }
  const errorMap = {
    InternalError: 'Javascript 引擎内部错误',
    ReferenceError: '未找到对象',
    TypeError: '使用了错误的类型或对象',
    RangeError: '使用内置对象时，参数超范围',
    SyntaxError: '语法错误',
    EvalError: '错误的使用了Eval',
    URIError: 'URI错误',
  }
  // const errorName = errorMap[error.name] || '未知错误'
  console.warn(`【error】:${error}`)
  console.error('捕获到的错误==>>'+error)
  // vm.$nextTick(() => {
  //   vm.$notify.error({
  //     title: errorName,
  //     message: error,
  //   })
  // })
}

