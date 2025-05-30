<template>
  <el-dialog
    v-model="showDialog"
    title="二维码"
    width="600"
    :before-close="handleClose"
  >
    <div class="dia-info">
      <div class="qr" ref="qr_cord">
        <div class="qr_div">
          <div class="title">学习强国</div>
          <img src="@images/icon/bg-icon.png" alt="" class="bg-icon1" />
          <img src="@images/icon/bg-icon.png" alt="" class="bg-icon2" />

          <div class="info">
            <div class="qr-img">
              <qrcode-vue :value="qrCodeImg" :size="200" />
            </div>

            <div class="name">学习强国</div>
            <div class="company">{{ qrContent }}</div>
          </div>
        </div>
      </div>

      <div class="btn-box">
        <el-button type="primary" @click="exportQrCode">下载</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import QrcodeVue from "qrcode.vue";
import { qrCode } from "@/utils/exportQrCode";

// Props 定义
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  qrSize: {
    type: Number,
    default: 200,
  },
  qrContent: {
    type: String,
    default: "学习强国",
  },
});

// Emits 定义
const emit = defineEmits(["update:show"]);

// 响应式数据
const showDialog = ref(props.show);
const qrCodeImg = ref(props.qrContent);

// 监听props变化
watch(
  () => props.show,
  (newVal) => {
    showDialog.value = newVal;
  }
);

watch(
  () => props.qrContent,
  (newVal) => {
    console.log("props.qrContent变化了", newVal);

    qrCodeImg.value = newVal;
  }
);

// 对话框关闭处理
const handleClose = () => {
  console.log("关闭");

  emit("update:show", false);
};

const qr_cord = ref(null);
const exportQrCode = () => {
  var TypeName = props.qrContent;
  // console.log(document.querySelector("#qr_cord"));

  qrCode(TypeName, qr_cord.value);
};
</script>

<style lang="less" scoped>
.qr {
  width: 360px;
  height: 540px;
  background-color: transparent;
  /* 确保背景色是透明的 */
  margin: 0 auto;
  box-shadow: 0px 2px 10px 0px rgba(9, 59, 117, 0.24);

  .qr_div {
    width: 100%;
    height: 100%;
    background-color: #004d94;
    position: relative;

    .title {
      font-size: 28px;
      color: #ffffff;
      padding: 30px;
    }

    .bg-icon1 {
      width: 151px;
      height: 180px;
      position: absolute;
      top: 20px;
      right: 35px;
      z-index: 0;
    }

    .bg-icon2 {
      width: 151px;
      height: 180px;
      position: absolute;
      top: 5px;
      right: -40px;
      z-index: 0;
    }

    .info {
      width: 360px;
      height: 430px;
      background-image: linear-gradient(0deg, #ffffff 0%, #cae4fc 100%),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      border-radius: 20px 20px 0 0;
      overflow: hidden;
      position: absolute;
      bottom: 0;
      z-index: 1;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .qr-img {
        width: 230px;
        height: 230px;
        // box-shadow: 0px 2px 10px 0px rgba(9, 117, 75, 0.24);
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 20px;
        img {
          width: 210px;
          height: 210px;
        }
      }

      .name {
        font-size: 22px;
        // font-weight: bold;
        margin: 20px 0;
        color: #333333;
      }

      .company {
        font-size: 17px;
        // font-weight: bold;
        color: #333333;
      }
    }
  }
}

.dia-info {
  padding: 30px;

  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}

//
</style>
