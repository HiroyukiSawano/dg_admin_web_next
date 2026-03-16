import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const Time = {
  // 获取当前时间戳（毫秒）
  getUnix: () => Date.now(),
  //获取今天0点0分0秒的时间戳
  getTodayUnix: () => dayjs().startOf('day').valueOf(),
  //获取今年1月1日0点0秒的时间戳
  getYearUnix: () => dayjs().startOf('year').valueOf(),
  //获取标准年月日
  getLastDate: (time) => dayjs(time).format('YYYY-MM-DD'),
  //转换时间
  getFormattedTime: (timestamp) => {
    const now = dayjs()
    const target = dayjs(timestamp)
    if (!target.isValid())  return '无效时间'

    const diffSecond = now.diff(target, 'second')

    if (diffSecond < 0) return '即将发生'
    if (diffSecond < 60) return '刚刚'
    if (diffSecond < 3600) return `${Math.floor(diffSecond / 60)}分钟前`

    if (target.isSame(dayjs(), 'day')) return `${Math.floor(diffSecond / 3600)}小时前`


    const diffDay = now.startOf('day').diff(target.startOf('day'), 'day')
    if (diffDay <= 31) return `${diffDay}天前`

    return target.isSame(now, 'year') ? target.format('MM-DD') : target.format('YYYY-MM-DD')
  },
}

const cleanTimer = (el) => {
  if (el.__timeout__) {
    clearInterval(el.__timeout__)
    delete el.__timeout__
  }
}

const processTimer = (el, binding) => {
  cleanTimer(el) // 清除现有定时器

  const { value, modifiers } = binding

  // 处理空值
  if (value === undefined || value === null) {
    el.textContent = ''
    return
  }

  // 转换为数字并处理时间戳格式
  let timestamp = Number(value)
  if (isNaN(timestamp)) {
    console.warn(`v-time 指令接收到无效的时间值: ${value}`)
    el.textContent = '无效时间'
    return
  }

  // 10位秒级时间戳转为毫秒
  if (timestamp.toString().length === 10) {
    timestamp *= 1000
  }

  // 检查时间是否有效
  if (!dayjs(timestamp).isValid()) {
    console.warn(`v-time 指令接收到无效的时间戳: ${value}`)
    el.textContent = '无效时间'
    return
  }

  if (modifiers.tip) {
    // 更新显示内容
    const updateContent = () => {
      el.textContent = Time.getFormattedTime(timestamp)
    }

    updateContent()

    // 根据时间差动态调整更新频率
    const now = dayjs()
    const target = dayjs(timestamp)
    const diffHours = now.diff(target, 'hour')

    // 超过3小时减少更新频率
    const interval = diffHours > 3 ? 3600000 : 60000 // 1小时或1分钟
    el.__timeout__ = setInterval(updateContent, interval)
  } else {
    // 格式化为指定时间
    const format = el.getAttribute('format') || 'YYYY-MM-DD HH:mm'
    el.textContent = dayjs(timestamp).format(format)
  }
}
export default {
  mounted(el, binding) {
    processTimer(el, binding)
  },
  updated(el, binding) {
    // 只有当值变化时才更新
    if (binding.value !== binding.oldValue) {
      processTimer(el, binding)
    }
  },
  beforeUnmount(el) {
    cleanTimer(el)
  },
}
