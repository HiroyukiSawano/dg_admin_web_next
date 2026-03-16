// 数据表格配置
import { Session } from '@/utils/storage'
const tableConfig = {
  successCode: 200, //请求完成代码
  pageCurrent: 1, // 当前页数的默认页码
  pageSize: 10, // 默认每页显示数量
  pageSizes: [10, 20, 30, 40, 50], // 表格可设置的每页条数
  pageLayout: 'total, prev, pager, next, sizes', //表格分页布局
  parseData: (res) => {
    //数据分析
    return {
      data: res.data, //分析无分页的数据字段结构
      rows: res.data.rows, //分析行数据字段结构
      total: res.data.total, //分析总数字段结构
      summary: res.data.summary, //分析合计行字段结构
      msg: res.message, //分析描述字段结构
      code: res.code, //分析状态字段结构
    }
  },
  request: {
    //请求字段映射
    page: 'page',
    pageSize: 'pageSize',
    prop: 'prop',
    order: 'order',
  },
  /**
   * 自定义列保存处理
   */
  columnSettingSave: (table, column) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 使用session和setTimeout演示，模拟数据请求
        Session.setItem(table, column)
        resolve(true)
      }, 1000)
    })
  },
  /**
   * 获取自定义列
   */
  columnSettingGet: (table, column) => {
    return new Promise((resolve) => {
      const _column = Session.getItem(table)
      if (_column) {
        resolve(_column)
      } else {
        resolve(column)
      }
    })
  },
  /**
   * 重置自定义列
   */
  columnSettingReset: (table, column) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Session.remove(table)
        resolve(column)
      }, 1000)
    })
  },
}
export { tableConfig }
export default tableConfig
