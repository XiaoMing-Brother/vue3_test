import { useDark, useToggle } from '@vueuse/core'

// 导入原有的主题相关功能
export const isDark = useDark({
  storageKey: 'zm-theme'
})
const toggleDark = useToggle(isDark)

/**
 * 主题切换动画
 * @param {Event} e 鼠标点击事件
 */
export const themeAnimation = (e) => {
  console.log(e)
  const x = e.clientX
  const y = e.clientY
  // 计算鼠标点击位置距离视窗的最大圆半径
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  // 设置CSS变量
  document.documentElement.style.setProperty('--x', x + 'px')
  document.documentElement.style.setProperty('--y', y + 'px')
  document.documentElement.style.setProperty('--r', endRadius + 'px')

  // 检查浏览器是否支持 View Transition API
  if (!document.startViewTransition) {
    // 如果不支持，直接切换主题
    toggleDark()
    return
  }

  // 使用 View Transition API 实现动画效果
  const transition = document.startViewTransition(() => {
    toggleDark()
  })

  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      { clipPath },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  })
}

/**
 * 提升暗黑主题下页面刷新视觉体验
 * @param {boolean} addClass 是否添加 class
 */
export const setThemeTransitionClass = (addClass) => {
  const el = document.getElementsByTagName('body')[0]

  if (addClass) {
    el.setAttribute('class', 'theme-change')
  } else {
    setTimeout(() => {
      el.removeAttribute('class')
    }, 300)
  }
}