import { nextTick } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ElLoading, ElMessage } from "element-plus";

/**
 * 批量下载二维码为ZIP压缩包
 * @param {Array} dataList - 数据列表
 * @param {string} [prefix='qr'] - DOM元素ID前缀
 * @param {string} [folderName='二维码'] - ZIP文件夹名称
 * @param {Function} [getName] - 自定义文件名生成函数
 */
export const batchDownloadQRCodes = async (
  dataList,
  { prefix = "qr", folderName = "二维码", getName = null } = {}
) => {
  let loadingInstance;

  try {
    // 显示加载状态
    loadingInstance = ElLoading.service({
      lock: true,
      text: "正在生成二维码压缩包...",
    });

    await nextTick();

    const zip = new JSZip();
    const imgFolder = zip.folder(folderName);
    const failedItems = [];

    // 限制并发数，避免内存问题
    const concurrencyLimit = 5;
    const batchCount = Math.ceil(dataList.length / concurrencyLimit);

    for (let i = 0; i < batchCount; i++) {
      const batchStart = i * concurrencyLimit;
      const batchEnd = (i + 1) * concurrencyLimit;
      const batchItems = dataList.slice(batchStart, batchEnd);

      // 处理当前批次
      const batchPromises = batchItems.map((item) =>
        generateQRImage(item, prefix).catch((error) => {
          console.error(`生成二维码 ${item.id} 失败:`, error);
          failedItems.push(item);
          return null;
        })
      );

      // 等待当前批次完成
      const batchResults = await Promise.all(batchPromises);

      // 将成功的图片添加到zip
      batchResults.forEach((result, index) => {
        if (result) {
          const item = batchItems[index];
          const fileName = getName
            ? getName(item)
            : `${item.metricsName || item.id}.png`;
          imgFolder.file(fileName, result.blob);
        }
      });
    }

    // 生成zip文件
    if (Object.keys(imgFolder.files).length > 0) {
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      saveAs(content, `${folderName}_${new Date().toLocaleDateString()}.zip`);

      // 返回下载结果
      return {
        successCount: Object.keys(imgFolder.files).length,
        failedCount: failedItems.length,
        failedItems,
      };
    } else {
      throw new Error("没有可下载的二维码");
    }
  } catch (error) {
    console.error("批量下载失败:", error);
    throw error;
  } finally {
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
};

/**
 * 生成单个二维码图片
 * @param {Object} item - 数据项
 * @param {string} prefix - DOM元素ID前缀
 */
const generateQRImage = async (item, prefix) => {
  await nextTick(); // 确保DOM更新
  const qrElement = document.getElementById(`${prefix}-${item.id}`);
  if (!qrElement) {
    throw new Error("找不到二维码元素");
  }

  const canvas = await html2canvas(qrElement, {
    scale: 3,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: null, // 确保背景透明
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ item, blob });
        } else {
          reject(new Error("Canvas转换Blob失败"));
        }
      },
      "image/png",
      0.9 // 90%质量压缩
    );
  });
};
