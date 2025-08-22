<!-- 一个让 SVG 图片跟随主题的组件，只对特定 svg 图片生效，不建议开发者使用 -->
<!-- 图片地址 https://iconpark.oceanengine.com/illustrations/13 -->
<template>
  <div class="theme-svg" :style="sizeStyle">
    <div v-if="src" class="svg-container" v-html="svgContent"></div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  size: {
    type: [String, Number],
    default: 500
  },
  themeColor: {
    type: String,
    default: 'var(--el-color-primary)'
  },
  src: {
    type: String,
    default: ''
  }
})

const svgContent = ref('')

// 计算样式
const sizeStyle = computed(() => {
  const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: sizeValue,
    height: sizeValue
  }
})

// 颜色映射配置
const COLOR_MAPPINGS = {
  '#C7DEFF': 'var(--el-color-primary-light-6)',
  '#071F4D': 'var(--el-color-primary-dark-2)',
  '#00E4E5': 'var(--el-color-primary-light-1)',
  '#006EFF': 'var(--el-color-primary)',
  '#fff': 'var(--art-main-bg-color)',
  '#ffffff': 'var(--art-main-bg-color)',
  '#DEEBFC': 'var(--el-color-primary-light-7)'
}

// 将主题色应用到 SVG 内容
const applyThemeToSvg = (content) => {
  return Object.entries(COLOR_MAPPINGS).reduce(
    (processedContent, [originalColor, themeColor]) => {
      const fillRegex = new RegExp(`fill="${originalColor}"`, 'gi')
      const strokeRegex = new RegExp(`stroke="${originalColor}"`, 'gi')

      return processedContent
        .replace(fillRegex, `fill="${themeColor}"`)
        .replace(strokeRegex, `stroke="${themeColor}"`)
    },
    content
  )
}

// 加载 SVG 文件内容
const loadSvgContent = async () => {
  if (!props.src) {
    svgContent.value = ''
    return
  }

  try {
    // 尝试直接导入SVG内容
    if (props.src.startsWith('/src/') || props.src.startsWith('@/')) {
      // 对于本地资源，直接使用import导入
      const module = await import(/* @vite-ignore */ props.src + '?raw')
      const content = module.default
      svgContent.value = applyThemeToSvg(content)
    } else {
      // 对于其他资源，使用fetch
      const response = await fetch(props.src)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const content = await response.text()
      svgContent.value = applyThemeToSvg(content)
    }
  } catch (error) {
    console.error('Failed to load SVG:', error)
    // 如果加载失败，尝试作为普通图片处理
    svgContent.value = `<img src="${props.src}" style="width: 100%; height: 100%; object-fit: contain;" alt="SVG" />`
  }
}

watchEffect(() => {
  loadSvgContent()
})
</script>

<style lang="scss" scoped>
.theme-svg {
  display: inline-block;

  .svg-container {
    width: 100%;
    height: 100%;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
