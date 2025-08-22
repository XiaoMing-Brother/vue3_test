<template>
  <div class="svg-container" v-html="processedSvg" :style="containerStyle" :class="{ 'is-active': active }" />
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useSettingsStore } from "@/store/modules/settings";

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
  // 自定义颜色，如果不传则使用主题色
  color: {
    type: String,
    default: "",
  },
  // 激活状态的颜色
  activeColor: {
    type: String,
    default: "#ffffff",
  },
});

const settingsStore = useSettingsStore();
const processedSvg = ref("");

// 计算容器样式
const containerStyle = computed(() => {
  let fillColor;

  if (props.active) {
    // 激活状态使用主题色
    fillColor = settingsStore.primaryColor || "var(--el-color-primary)";
  } else {
    // 未激活状态使用 #6b6b6b
    fillColor = "#6b6b6b";
  }

  return {
    "--svg-fill-color": fillColor,
  };
});

// 加载 SVG 内容
const loadSvg = async () => {
  try {
    // 尝试使用 import.meta.url 构建完整路径
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
  } catch (error) {
    console.error("加载 SVG 失败:", error);
    // 可以在这里设置一个默认的 SVG 或错误提示
  }
};

// 监听 src 变化重新加载
watch(() => props.src, loadSvg);

onMounted(loadSvg);
</script>

<style scoped>
.svg-container {
  --svg-fill-color: var(--el-color-primary); /* 默认颜色 */
  display: inline-flex;
  width: 100%;
  height: 100%;
  color: var(--svg-fill-color);
  transition: color 0.3s ease; /* 添加颜色过渡动画 */
}

.svg-container.is-active {
  /* 激活状态的额外样式 */
}

.svg-container :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor; /* 继承父元素颜色 */
  transition: fill 0.3s ease; /* SVG 填充颜色过渡 */
}

.svg-container :deep(path),
.svg-container :deep(circle),
.svg-container :deep(rect),
.svg-container :deep(polygon),
.svg-container :deep(ellipse),
.svg-container :deep(line) {
  fill: inherit; /* 确保所有子元素继承 fill 属性 */
  transition: fill 0.3s ease; /* 子元素填充颜色过渡 */
}

/* 对于描边元素 */
.svg-container :deep(path[stroke]),
.svg-container :deep(circle[stroke]),
.svg-container :deep(rect[stroke]),
.svg-container :deep(line[stroke]) {
  stroke: currentColor;
  transition: stroke 0.3s ease;
}
</style>
