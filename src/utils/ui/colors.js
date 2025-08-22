import { useSettingsStore } from '@/store/modules/settings'
import { ElMessage } from 'element-plus'

/**
 * 颜色转换结果接口
 */
/**
 * 获取CSS变量值（别名函数）
 * @param name CSS变量名
 * @returns CSS变量值
 */
export function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

/**
 * 验证hex颜色格式
 * @param hex hex颜色值
 * @returns 是否为有效的hex颜色
 */
function isValidHexColor(hex) {
  const cleanHex = hex.trim().replace(/^#/, '')
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{4}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(cleanHex)
}

/**
 * 验证RGB颜色值
 * @param r 红色值
 * @param g 绿色值
 * @param b 蓝色值
 * @returns 是否为有效的RGB值
 */
function isValidRgbValue(r, g, b) {
  const isValid = (value) => Number.isInteger(value) && value >= 0 && value <= 255
  return isValid(r) && isValid(g) && isValid(b)
}

/**
 * 将hex颜色转换为RGBA
 * @param hex hex颜色值 (支持 #FFF 或 #FFFFFF 格式)
 * @param opacity 透明度 (0-1)
 * @returns 包含RGB值和RGBA字符串的对象
 */
export function hexToRgba(hex, opacity) {
  if (!isValidHexColor(hex)) {
    throw new Error('Invalid hex color format')
  }

  // 移除可能存在的 # 前缀并转换为大写
  let cleanHex = hex.trim().replace(/^#/, '').toUpperCase()

  // 如果是缩写形式（如 FFF），转换为完整形式
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char.repeat(2))
      .join('')
  } else if (cleanHex.length === 4) {
    // 处理带透明度的缩写形式 #RGBA -> #RRGGBBAA
    cleanHex = cleanHex
      .split('')
      .map((char) => char.repeat(2))
      .join('')
  }

  // 对于 8 位 hex (RRGGBBAA)，只取前 6 位 (RRGGBB)
  if (cleanHex.length === 8) {
    cleanHex = cleanHex.substring(0, 6)
  }

  // 解析 RGB 值
  const rgbMatches = cleanHex.match(/\w\w/g)
  if (!rgbMatches || rgbMatches.length < 3) {
    throw new Error('Invalid hex color format')
  }
  
  const [red, green, blue] = rgbMatches.slice(0, 3).map((x) => parseInt(x, 16))

  // 确保 opacity 在有效范围内
  const validOpacity = Math.max(0, Math.min(1, opacity))

  // 构建 RGBA 字符串
  const rgba = `rgba(${red}, ${green}, ${blue}, ${validOpacity.toFixed(2)})`

  return { red, green, blue, rgba }
}

/**
 * 将hex颜色转换为RGB数组
 * @param hexColor hex颜色值
 * @returns RGB数组 [r, g, b]
 */
export function hexToRgb(hexColor) {
  if (!isValidHexColor(hexColor)) {
    ElMessage.warning('输入错误的hex颜色值')
    throw new Error('Invalid hex color format')
  }

  const cleanHex = hexColor.replace(/^#/, '')
  let hex = cleanHex

  // 处理缩写形式
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char.repeat(2))
      .join('')
  } else if (hex.length === 4) {
    // 处理带透明度的缩写形式 #RGBA -> #RRGGBBAA
    hex = hex
      .split('')
      .map((char) => char.repeat(2))
      .join('')
  }

  // 对于 8 位 hex (RRGGBBAA)，只取前 6 位 (RRGGBB)
  if (hex.length === 8) {
    hex = hex.substring(0, 6)
  }

  const hexPairs = hex.match(/../g)
  if (!hexPairs || hexPairs.length < 3) {
    throw new Error('Invalid hex color format')
  }

  // 只返回 RGB 值，忽略 Alpha 通道
  return hexPairs.slice(0, 3).map((hexPair) => parseInt(hexPair, 16))
}

/**
 * 将RGB颜色转换为hex
 * @param r 红色值 (0-255)
 * @param g 绿色值 (0-255)
 * @param b 蓝色值 (0-255)
 * @returns hex颜色值
 */
export function rgbToHex(r, g, b) {
  if (!isValidRgbValue(r, g, b)) {
    ElMessage.warning('输入错误的RGB颜色值')
    throw new Error('Invalid RGB color values')
  }

  const toHex = (value) => {
    const hex = value.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * 颜色混合
 * @param color1 第一个颜色
 * @param color2 第二个颜色
 * @param ratio 混合比例 (0-1)
 * @returns 混合后的颜色
 */
export function colourBlend(color1, color2, ratio) {
  const validRatio = Math.max(0, Math.min(1, Number(ratio)))

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const blendedRgb = rgb1.map((value1, index) => {
    const value2 = rgb2[index]
    return Math.round(value1 * (1 - validRatio) + value2 * validRatio)
  })

  return rgbToHex(blendedRgb[0], blendedRgb[1], blendedRgb[2])
}

/**
 * 获取变浅的颜色
 * @param color 原始颜色
 * @param level 变浅程度 (0-1)
 * @param isDark 是否为暗色主题
 * @returns 变浅后的颜色
 */
export function getLightColor(color, level, isDark = false) {
  if (!isValidHexColor(color)) {
    ElMessage.warning('输入错误的hex颜色值')
    throw new Error('Invalid hex color format')
  }

  if (isDark) {
    return getDarkColor(color, level)
  }

  const rgb = hexToRgb(color)
  const lightRgb = rgb.map((value) => Math.floor((255 - value) * level + value))

  return rgbToHex(lightRgb[0], lightRgb[1], lightRgb[2])
}

/**
 * 获取变深的颜色
 * @param color 原始颜色
 * @param level 变深程度 (0-1)
 * @returns 变深后的颜色
 */
export function getDarkColor(color, level) {
  if (!isValidHexColor(color)) {
    ElMessage.warning('输入错误的hex颜色值')
    throw new Error('Invalid hex color format')
  }

  const rgb = hexToRgb(color)
  const darkRgb = rgb.map((value) => Math.floor(value * (1 - level)))

  return rgbToHex(darkRgb[0], darkRgb[1], darkRgb[2])
}

/**
 * 处理 Element Plus 主题颜色
 * @param theme 主题颜色
 * @param isDark 是否为暗色主题
 */
export function handleElementThemeColor(theme, isDark = false) {
  document.documentElement.style.setProperty('--el-color-primary', theme)

  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${i}`,
      getLightColor(theme, i / 10, isDark)
    )
  }

  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-dark-${i}`,
      getDarkColor(theme, i / 10)
    )
  }
}

/**
 * 设置 Element Plus 主题颜色
 * @param color 主题颜色
 */
export function setElementThemeColor(color) {
  const mixColor = '#ffffff'
  const elStyle = document.documentElement.style

  elStyle.setProperty('--el-color-primary', color)
  handleElementThemeColor(color, useSettingsStore().isDark)

  // 生成更淡一点的颜色
  for (let i = 1; i < 16; i++) {
    const itemColor = colourBlend(color, mixColor, i / 16)
    elStyle.setProperty(`--el-color-primary-custom-${i}`, itemColor)
  }
}
