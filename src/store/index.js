import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const store = createPinia()

// 配置持久化插件
store.use(piniaPluginPersistedstate)

/**
 * 初始化 Store
 */
export function initStore(app) {
  app.use(store)
}
