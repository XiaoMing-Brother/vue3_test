<template>
  <div class="page-content state-page">
    <div class="tips">
      <div class="image-container">
        <!-- 加载状态 -->
        <div v-if="imageLoading" class="image-loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="imageError" class="image-error">
          <div class="error-icon">⚠️</div>
          <p>图片加载失败</p>
          <el-button size="small" @click="retryLoadImage">重试</el-button>
        </div>

        <!-- 图片显示 -->
        <img
          v-else
          v-show="imageLoaded"
          ref="imageRef"
          :src="data.imgUrl"
          :alt="data.title || '异常页面'"
          class="exception-image"
          @load="onImageLoad"
          @error="onImageError"
          loading="lazy" />
      </div>

      <div class="right-wrap">
        <p>{{ data.desc }}</p>
        <el-button
          type="primary"
          size="large"
          :loading="isNavigating"
          :disabled="isNavigating"
          @click="backHome"
          v-ripple
          class="back-home-btn">
          <span v-if="!isNavigating">{{ data.btnText }}</span>
          <span v-else>正在跳转...</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const imageRef = ref(null);
const imageLoading = ref(true);
const imageLoaded = ref(false);
const imageError = ref(false);
const isNavigating = ref(false);

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      title: "",
      desc: "",
      btnText: "",
      imgUrl: "",
    }),
  },
});

// 图片加载成功
const onImageLoad = () => {
  imageLoading.value = false;
  imageLoaded.value = true;
  imageError.value = false;
};

// 图片加载失败
const onImageError = () => {
  imageLoading.value = false;
  imageLoaded.value = false;
  imageError.value = true;
};

// 重试加载图片
const retryLoadImage = () => {
  if (imageRef.value) {
    imageLoading.value = true;
    imageError.value = false;
    imageLoaded.value = false;

    // 强制重新加载图片
    const img = imageRef.value;
    const src = img.src;
    img.src = "";
    nextTick(() => {
      img.src = src + "?t=" + Date.now(); // 添加时间戳避免缓存
    });
  }
};

// 预加载图片
const preloadImage = (url) => {
  if (!url) return;

  const img = new Image();
  img.onload = onImageLoad;
  img.onerror = onImageError;
  img.src = url;
};

// 监听图片URL变化
watch(
  () => props.data.imgUrl,
  (newUrl) => {
    if (newUrl) {
      imageLoading.value = true;
      imageError.value = false;
      imageLoaded.value = false;
    }
  },
  { immediate: true }
);

// 返回首页
const backHome = () => {
  router.push("/");
};

// 组件挂载时预加载图片
onMounted(() => {
  if (props.data.imgUrl) {
    preloadImage(props.data.imgUrl);
  }
});
</script>

<style lang="scss" scoped>
.state-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: transparent !important;
  border: 0 !important;

  .tips {
    display: flex;
    align-items: center;
    justify-content: center;

    .image-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 300px;
      min-height: 300px;

      .exception-image {
        max-width: 100%;
        max-height: 400px;
        height: auto;
        object-fit: contain;
        transition: opacity 0.3s ease, transform 0.3s ease;

        &:hover {
          transform: scale(1.02);
        }
      }

      // 加载状态样式
      .image-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--art-gray-500);

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--art-gray-200);
          border-top: 4px solid var(--art-primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        p {
          font-size: 14px;
          margin: 0;
        }
      }

      // 错误状态样式
      .image-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--art-gray-500);
        text-align: center;

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.7;
        }

        p {
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        .el-button {
          font-size: 12px;
        }
      }
    }

    .right-wrap {
      width: 300px;
      margin-left: 60px;

      p {
        font-size: 20px;
        line-height: 28px;
        color: var(--art-gray-600);
      }

      .el-button {
        margin-top: 20px;
      }

      .back-home-btn {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(64, 158, 255, 0.3);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        // 点击波纹效果增强
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }

        &:active:not(:disabled)::after {
          width: 300px;
          height: 300px;
        }
      }
    }
  }
}

// 加载动画
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media only screen and (max-width: $device-ipad-vertical) {
  .state-page {
    .tips {
      display: block;
      text-align: center;

      .image-container {
        min-width: auto;
        min-height: 200px;
        margin-bottom: 20px;

        .exception-image {
          max-height: 250px;
        }
      }

      .right-wrap {
        width: 100%;
        margin: auto;
        text-align: center;

        p {
          margin-top: 40px;
          font-size: 18px;
        }
      }
    }
  }
}

@media only screen and (max-width: 480px) {
  .state-page {
    padding: 20px;

    .tips {
      .image-container {
        min-height: 150px;

        .exception-image {
          max-height: 180px;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border-width: 3px;
        }
      }

      .right-wrap {
        p {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
}
</style>
