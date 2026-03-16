
const watermark = {}

const setWatermark = (str) => {
  const id = 'y887a95a-bftj-hxrc-73et-e0r2osqkel2c'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  const can = document.createElement('canvas')
  can.width = 320
  can.height = 320

  const canvas = can.getContext('2d')
  if (canvas) {
    canvas.rotate((-30 * Math.PI) / 180)
    canvas.font = `16px "GoogleSansFlex", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif`
    canvas.fillStyle = 'rgba(200, 200, 200, 0.50)'
    canvas.textAlign = 'left'
    canvas.textBaseline = 'middle'
    canvas.fillText(str, can.width / 8, can.height / 2)
  }
  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = `${document.documentElement.clientWidth}px`
  div.style.height = `${document.documentElement.clientHeight}px`
  div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`
  document.body.appendChild(div)
  return id
}
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) id = setWatermark(str)
  }, 500)
  window.addEventListener('resize', () => {
    setWatermark(str)
  })
}

export default watermark
