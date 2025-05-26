<template>
  <div
    class="svg-container"
    v-html="processedSvg"
    :style="{ '--svg-fill-color': active ? '#ffffff' : '#004d94' }"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
    validator: (value) => {
      // 简单验证路径是否以 .svg 结尾
      return value.endsWith(".svg");
    },
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const processedSvg = ref("");

// 加载 SVG 内容
const loadSvg = async () => {
  // 尝试使用 import.meta.url  构建完整路径
  const svgUrl = new URL(props.src, import.meta.url).href;
  const response = await fetch(svgUrl);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let svgText = await response.text();

  // 优化 SVG - 移除 XML 声明和注释
  svgText = svgText.replace(/<\?xml[^>]+\?>/, "").replace(/<!--.*?-->/gs, "");

  // 确保 SVG 有 fill="currentColor" 或类似的属性以便继承颜色
  if (!svgText.includes("fill=")) {
    svgText = svgText.replace("<svg", '<svg fill="currentColor"');
  }

  processedSvg.value = svgText;
};

// 监听 path 变化重新加载
watch(() => props.path, loadSvg);

onMounted(loadSvg);
</script>

<style scoped>
.svg-container {
  --svg-fill-color: #004d94; /* 默认颜色 */
  display: inline-flex;
  width: 100%;
  height: 100%;
  color: var(--svg-fill-color);
}

.svg-container :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor; /* 继承父元素颜色 */
}

.svg-container :deep(path),
.svg-container :deep(circle),
.svg-container :deep(rect) {
  fill: inherit; /* 确保所有子元素继承 fill 属性 */
}
</style>
