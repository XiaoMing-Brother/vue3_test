import html2Canvas from "html2canvas";

export const exportQrCode = (title, html) => {
  console.log(title);

  html2Canvas(html, {
    allowTaint: false, // 不允许污染源
    taintTest: false, // 不进行污染测试
    logging: false, // 关闭日志
    useCORS: true, // 使用CORS加载图像
    dpi: window.devicePixelRatio * 1, // 设置DPI
    scale: 3, // 设置缩放比例
  })
    .then((canvas) => {
      // 创建一个新的 Canvas 来应用圆角
      // const roundedCanvas = document.createElement("canvas");
      // const context = roundedCanvas.getContext("2d");

      // // 设置新 Canvas 的尺寸
      // roundedCanvas.width = canvas.width;
      // roundedCanvas.height = canvas.height;

      // // 在新 Canvas 上绘制圆角矩形
      // // const radius = 40; // 圆角半径
      // context.clearRect(0, 0, roundedCanvas.width, roundedCanvas.height);
      // context.fillStyle = "#ffffff00"; // 背景颜色，必要时设置透明度
      // context.beginPath();
      // context.moveTo(radius, 0);
      // context.arcTo(
      //   roundedCanvas.width,
      //   0,
      //   roundedCanvas.width,
      //   roundedCanvas.height,
      //   radius
      // );
      // context.arcTo(
      //   roundedCanvas.width,
      //   roundedCanvas.height,
      //   0,
      //   roundedCanvas.height,
      //   radius
      // );
      // context.arcTo(0, roundedCanvas.height, 0, 0, radius);
      // context.arcTo(0, 0, roundedCanvas.width, 0, radius);
      // context.closePath();
      // context.clip();

      // // 将原始 Canvas 的内容绘制到新的 Canvas 上
      // context.drawImage(canvas, 0, 0);

      // 将新的 Canvas 转换为图片 URL
      // const imgURL = roundedCanvas.toDataURL("image/png");
      const imgURL = canvas.toDataURL("image/png");

      // 创建一个链接并触发下载
      const link = document.createElement("a");
      link.href = imgURL;
      link.download = `${title}.png`;
      link.click();
    })
    .catch((error) => {
      console.error("Error during html2canvas conversion:", error);
    });
};
