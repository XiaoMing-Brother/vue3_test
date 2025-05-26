export default function () {
  const baseSize = 16;
  function setRem() {
    const scale = document.documentElement.clientWidth / 1920;
    document.documentElement.style.fontSize = baseSize * scale + "px";
  }

  window.onresize = () => {
    setRem();
  };

  setRem();
}
