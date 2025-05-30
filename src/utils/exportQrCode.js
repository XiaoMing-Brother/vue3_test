import { nextTick } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ElLoading, ElMessage } from "element-plus";

/**
 * 应用圆角效果到Canvas
 * @param {HTMLCanvasElement} canvas - 原始Canvas
 * @param {number} radius - 圆角半径
 * @returns {HTMLCanvasElement} 带圆角效果的Canvas
 */
const applyRoundedCorners = (canvas, radius) => {
  const roundedCanvas = document.createElement("canvas");
  const context = roundedCanvas.getContext("2d");

  // 设置相同尺寸
  roundedCanvas.width = canvas.width;
  roundedCanvas.height = canvas.height;

  // 清除画布并设置透明背景
  context.clearRect(0, 0, roundedCanvas.width, roundedCanvas.height);
  context.fillStyle = "#ffffff00";

  // 绘制圆角路径
  context.beginPath();
  context.moveTo(radius, 0);
  context.arcTo(
    roundedCanvas.width,
    0,
    roundedCanvas.width,
    roundedCanvas.height,
    radius
  );
  context.arcTo(
    roundedCanvas.width,
    roundedCanvas.height,
    0,
    roundedCanvas.height,
    radius
  );
  context.arcTo(0, roundedCanvas.height, 0, 0, radius);
  context.arcTo(0, 0, roundedCanvas.width, 0, radius);
  context.closePath();

  // 应用裁剪区域并绘制原始内容
  context.clip();
  context.drawImage(canvas, 0, 0);

  return roundedCanvas;
};

/**
 * Canvas转Blob
 * @param {HTMLCanvasElement} canvas - 要转换的Canvas
 * @returns {Promise<{blob: Blob}>} 包含Blob的对象
 */
const canvasToBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob });
        } else {
          reject(new Error("Canvas转换Blob失败"));
        }
      },
      "image/png",
      0.9 // 质量参数
    );
  });
};

/**
 * 导出单张二维码图片
 * @param {string} title - 文件名
 * @param {HTMLElement} html - 二维码DOM元素
 * @param {Object} [options] - 配置选项
 * @param {number} [options.radius=40] - 圆角半径
 * @param {number} [options.scale=3] - 缩放比例
 */
const exportQrCode = async (title, html, { radius = 40, scale = 3 } = {}) => {
  try {
    // 验证输入参数
    if (!html || !(html instanceof HTMLElement)) {
      throw new Error("无效的HTML元素");
    }

    const canvas = await html2canvas(html, {
      allowTaint: false,
      useCORS: true,
      logging: false,
      scale,
      backgroundColor: null,
    });

    // 应用圆角效果
    const roundedCanvas =
      radius > 0 ? applyRoundedCorners(canvas, radius) : canvas;

    // 创建下载链接
    const link = document.createElement("a");
    link.href = roundedCanvas.toDataURL("image/png");
    link.download = `${title.replace(/[\/\\:*?"<>|]/g, "_")}.png`; // 过滤非法文件名字符
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("二维码导出失败:", error);
    ElMessage.error(`二维码导出失败: ${error.message}`);
    throw error;
  }
};

/**
 * 生成单个二维码图片
 * @param {Object} item - 数据项
 * @param {string} prefix - DOM元素ID前缀
 * @param {Object} options - 选项
 * @param {number} options.scale - 缩放比例
 * @param {number} options.radius - 圆角半径
 * @returns {Promise<{blob: Blob}>} 包含Blob的对象
 */
const generateQRImage = async (item, prefix, { scale, radius }) => {
  await nextTick();

  const elementId = `${prefix}-${item.id}`;
  const qrElement = document.getElementById(elementId);

  if (!qrElement) {
    throw new Error(`找不到二维码元素: ${elementId}`);
  }

  const canvas = await html2canvas(qrElement, {
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: null,
  });

  // 应用圆角效果
  const finalCanvas = radius > 0 ? applyRoundedCorners(canvas, radius) : canvas;

  return canvasToBlob(finalCanvas);
};

/**
 * 批量下载二维码为ZIP压缩包
 * @param {Array} dataList - 数据列表
 * @param {Object} [options] - 配置选项
 * @param {string} [options.prefix='qr'] - DOM元素ID前缀
 * @param {string} [options.folderName='二维码'] - ZIP文件夹名称
 * @param {Function} [options.getName] - 自定义文件名生成函数
 * @param {number} [options.concurrency=5] - 并发限制数
 * @param {number} [options.scale=3] - 缩放比例
 * @param {number} [options.radius=0] - 圆角半径(0表示无圆角)
 * @returns {Promise<{successCount: number, failedCount: number, failedItems: Array}>} 结果对象
 */
const batchDownloadQRCodes = async (
  dataList,
  {
    prefix = "qr",
    folderName = "二维码",
    getName = null,
    concurrency = 5,
    scale = 3,
    radius = 40,
  } = {}
) => {
  // 验证输入参数
  if (!Array.isArray(dataList) || dataList.length === 0) {
    throw new Error("无效的数据列表");
  }

  let loadingInstance;
  const failedItems = [];
  const results = {
    successCount: 0,
    failedCount: 0,
    failedItems: [],
  };

  try {
    loadingInstance = ElLoading.service({
      lock: true,
      text: "正在生成二维码压缩包...",
    });

    await nextTick();

    const zip = new JSZip();
    const imgFolder = zip.folder(folderName);
    const batchCount = Math.ceil(dataList.length / concurrency);

    for (let i = 0; i < batchCount; i++) {
      const batchStart = i * concurrency;
      const batchEnd = (i + 1) * concurrency;
      const batchItems = dataList.slice(batchStart, batchEnd);

      const batchPromises = batchItems.map((item) =>
        generateQRImage(item, prefix, { scale, radius })
          .then((result) => ({ item, result }))
          .catch((error) => {
            console.error(`生成二维码 ${item.id} 失败:`, error);
            failedItems.push(item);
            return null;
          })
      );

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach((batchResult) => {
        if (batchResult && batchResult.result) {
          const { item, result } = batchResult;
          const fileName = getName
            ? getName(item)
            : `${item.metricsName || item.id}.png`.replace(
                /[\/\\:*?"<>|]/g,
                "_"
              );
          imgFolder.file(fileName, result.blob);
          results.successCount++;
        }
      });
    }

    results.failedCount = failedItems.length;
    results.failedItems = failedItems;

    if (results.successCount > 0) {
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      saveAs(content, `${folderName}_${timestamp}.zip`);
    } else {
      throw new Error("没有成功生成的二维码");
    }

    return results;
  } catch (error) {
    console.error("批量下载失败:", error);
    ElMessage.error(`批量下载失败: ${error.message}`);
    throw error;
  } finally {
    loadingInstance?.close();
  }
};

export { exportQrCode, batchDownloadQRCodes };
