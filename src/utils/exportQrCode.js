import html2canvas from "html2canvas";

/**
 * 将HTML元素转换为圆角PNG图片并下载
 * @param {string} title - 下载文件的名称
 * @param {HTMLElement} html - 要转换的HTML元素
 * @param {object} [options] - 额外配置选项
 * @param {number} [options.radius=40] - 圆角半径
 * @param {number} [options.scale=3] - 缩放比例
 */
export const qrCode = (title, html, options = {}) => {
  const { radius = 40, scale = 3, ...html2canvasOptions } = options;

  const defaultOptions = {
    allowTaint: false,
    taintTest: false,
    logging: false,
    useCORS: true,
    dpi: window.devicePixelRatio * 1,
    scale,
    ...html2canvasOptions,
  };

  html2canvas(html, defaultOptions)
    .then((canvas) => {
      const roundedCanvas = document.createElement("canvas");
      const ctx = roundedCanvas.getContext("2d");

      // 设置新Canvas尺寸
      roundedCanvas.width = canvas.width;
      roundedCanvas.height = canvas.height;

      // 绘制圆角矩形
      ctx.clearRect(0, 0, roundedCanvas.width, roundedCanvas.height);
      ctx.beginPath();
      roundRect(ctx, 0, 0, canvas.width, canvas.height, radius);
      ctx.clip();

      // 绘制原始内容
      ctx.drawImage(canvas, 0, 0);

      // 触发下载
      triggerDownload(roundedCanvas, title);
    })
    .catch((error) => {
      console.error("图片转换失败:", error);
      throw error;
    });
};

/**
 * 绘制圆角矩形路径
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

/**
 * 触发图片下载
 */
function triggerDownload(canvas, filename) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${filename}.png`; // 清理文件名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
