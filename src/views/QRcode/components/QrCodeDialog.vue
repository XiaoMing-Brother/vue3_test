<template>
  <el-dialog
    v-model="showDialog"
    title="二维码"
    width="600"
    :before-close="handleClose"
  >
    <div class="dia-info">
      <QrContent :content="qrContent" ref="qr_cord" />
      <div class="btn-box">
        <el-button type="primary" @click="exportQr">下载</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import QrContent from "./QrContent.vue";
import { exportQrCode } from "@/utils/exportQrCode";

const props = defineProps({
  show: { type: Boolean, default: false },
  qrContent: { type: String, default: "学习强国" },
});

const emit = defineEmits(["update:show"]);
const showDialog = ref(props.show);
const qr_cord = ref(null);

watch(
  () => props.show,
  (newVal) => {
    showDialog.value = newVal;
  }
);

const handleClose = () => {
  emit("update:show", false);
};

const exportQr = () => {
  exportQrCode(props.qrContent, qr_cord.value.$el);
};
</script>

<style lang="less" scoped>
.dia-info {
  padding: 30px;

  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
