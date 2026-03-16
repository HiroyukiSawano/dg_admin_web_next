
// hex颜色转rgb颜色
export const colorHexToRgb = (str) => {
  str = str.replace('#', '')
  const hxs = str.match(/../g)
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16)
  return hxs
}
// rgb颜色转hex颜色
export const colorRgbToHex = (a, b, c) => {
  const hexs = [a.toString(16), b.toString(16), c.toString(16)]
    for (let i = 0; i < 3; i++) {
      if (hexs[i].length === 1) hexs[i] = '0' + hexs[i]
    }
    return '#' + hexs.join('')
}
// 变淡
export const colorLighten = (color, level) => {
  const rgbc = colorHexToRgb(color)
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i])
  return colorRgbToHex(rgbc[0], rgbc[1], rgbc[2])
}
// 加深
export const colorDarken = (color, level) => {
  const rgbc = colorHexToRgb(color)
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level))
  return colorRgbToHex(rgbc[0], rgbc[1], rgbc[2])
}
