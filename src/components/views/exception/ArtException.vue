<template>
  <div class="page-content state-page">
    <div class="tips">
      <ThemeSvg :src="data.imgUrl" size="300px" />
      <div class="right-wrap">
        <p>{{ data.desc }}</p>
        <el-button type="primary" size="large" @click="backHome" v-ripple>{{ data.btnText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import ThemeSvg from "@/components/views/theme/theme-svg/index.vue";

const router = useRouter();

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

const backHome = () => {
  router.push("/");
};
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
    }
  }
}

@media only screen and (max-width: $device-ipad-vertical) {
  .state-page {
    .tips {
      display: block;
      text-align: center;

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
</style>
