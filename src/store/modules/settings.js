import { defineStore } from "pinia";
import { themeAnimation } from "@/utils/theme/animation";
import { setElementThemeColor } from "@/utils/ui/colors";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      // 主题设置
      theme: "light", // light | dark | auto
      primaryColor: "#5D87FF", // 使用配置文件中的主题色

      // 自定义圆角设置 (rem单位，范围0-1)
      customRadius: 0.375, // 默认 6px = 0.375rem

      // 设置面板显示状态
      settingsPanelVisible: false,
    };
  },

  getters: {
    // 获取当前实际主题（处理 auto 模式）
    actualTheme: (state) => {
      if (state.theme === "auto") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return state.theme;
    },

    // 是否为深色主题
    isDarkTheme: (state) => {
      if (state.theme === "auto") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return state.theme === "dark";
    },
  },

  actions: {
    // 设置主题
    setTheme(theme) {
      this.theme = theme;
      this.saveSettings();
    },

    // 设置主题色
    setPrimaryColor(color) {
      // 验证颜色格式
      if (!color || typeof color !== "string") {
        console.warn("颜色值无效:", color);
        throw new Error("输入错误的hex颜色值");
      }

      // 支持更多颜色格式，包括 rgba、rgb 和带透明度的 hex
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4})$/;
      const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)$/;

      if (!hexPattern.test(color) && !rgbaPattern.test(color)) {
        console.warn("颜色格式不支持:", color);
        throw new Error("输入错误的hex颜色值");
      }

      try {
        this.primaryColor = color;
        setElementThemeColor(color);
        this.saveSettings();
      } catch (error) {
        console.error("设置主题色失败:", error);
        throw new Error("输入错误的hex颜色值");
      }
    },

    /**
     * 设置自定义圆角
     * @param radius 圆角值 (rem单位)
     */
    setCustomRadius(radius) {
      // 限制圆角值范围 0-1rem
      const clampedRadius = Math.max(0, Math.min(1, parseFloat(radius)));
      this.customRadius = clampedRadius;
      this.applyCustomRadius();
      this.saveSettings();
    },

    // 应用自定义圆角设置
    applyCustomRadius() {
      document.documentElement.style.setProperty("--custom-radius", `${this.customRadius}rem`);
    },

    // 打开设置面板
    openSettingsPanel() {
      this.settingsPanelVisible = true;
    },

    // 关闭设置面板
    closeSettingsPanel() {
      this.settingsPanelVisible = false;
    },

    // 重置所有设置
    resetSettings() {
      this.theme = "light";
      this.primaryColor = "#5D87FF";
      this.customRadius = 0.375;

      // 重置主题色和圆角
      setElementThemeColor(this.primaryColor);
      this.applyCustomRadius();

      // 清除本地存储
      localStorage.removeItem("app-settings");
    },

    // 保存设置到本地存储
    saveSettings() {
      const settings = {
        theme: this.theme,
        primaryColor: this.primaryColor,
        customRadius: this.customRadius,
      };

      localStorage.setItem("app-settings", JSON.stringify(settings));
    },

    // 从本地存储加载设置
    loadSettings() {
      try {
        const savedSettings = localStorage.getItem("app-settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);

          this.theme = settings.theme || "light";
          this.primaryColor = settings.primaryColor || "#5D87FF";
          this.customRadius = settings.customRadius || 0.375;

          // 应用主题色和圆角
          setElementThemeColor(this.primaryColor);
          this.applyCustomRadius();
        } else {
          // 如果没有保存的设置，应用默认圆角
          this.applyCustomRadius();
        }
      } catch (error) {
        console.error("加载设置失败:", error);
        // 出错时也要应用默认圆角
        this.applyCustomRadius();
      }
    },
  },
});
