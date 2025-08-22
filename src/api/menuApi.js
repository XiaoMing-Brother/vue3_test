import { menuItems } from '@/router/menuItems'

// 菜单接口
export const menuService = {
  async getMenuList(delay = 300) {
    try {
      // 返回简化的菜单数据
      const menuList = menuItems
      // 模拟接口延迟
      await new Promise((resolve) => setTimeout(resolve, delay))

      return { menuList }
    } catch (error) {
      throw error instanceof Error ? error : new Error('获取菜单失败')
    }
  }
}