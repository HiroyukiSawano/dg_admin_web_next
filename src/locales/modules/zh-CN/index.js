const modules = import.meta.glob('@/**/zh-CN/*.js', { eager: true })

const locales = Object.keys(modules).reduce((acc, key) => {
  const module = modules[key]
  if (module && module.default) {
    return { ...acc, ...module.default }
  }
  return acc
}, {})
export default {
  'ec.global.form.search.placeholder': '请输入关键字搜索',
  'ec.global.form.select.placeholder': '请选择',
  'ec.global.form.search.text': '搜索',
  'ec.global.form.daterange.placeholder': '请选择日期范围',
  'ec.global.form.daterange.start.placeholder': '请选择开始日期',
  'ec.global.form.daterange.end.placeholder': '请选择结束日期',

  'ec.global.button.text.cancel': '取消',
  'ec.global.button.text.confirm': '确定',
  'ec.global.button.text.submit': '提交',
  'ec.global.button.text.more': '更多',
  'ec.global.button.text.info': '详情',
  'ec.global.button.text.other': '其他',
  'ec.global.button.text.action': '操作',
  'ec.global.button.text.primary': '主要',
  'ec.global.button.text.search': '查询',
  'ec.global.button.text.reset': '重置',

  'ec.retrieval.dialog.title': '快速检索',
  'ec.retrieval.dialog.form.input.placeholder': '请输入"/"或者关键字进行快速检索',
  'ec.retrieval.dialog.empty.description': '暂无搜索结果',

  'ec.error.notice.404.title': '抱歉，您访问的页面不存在',
  'ec.error.notice.404.description': '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
  'ec.error.notice.500.title': '抱歉，服务器出错了',
  'ec.error.notice.500.description': '请稍后重试，或点击下面的按钮返回首页。',
  'ec.error.notice.403.title': '抱歉，您没有权限访问该页面',
  'ec.error.notice.403.description': '当前帐号没有操作权限，请联系管理员。',
  'ec.error.notice.button.text': '返回首页',

  ...locales,
}
