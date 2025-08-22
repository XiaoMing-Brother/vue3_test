import { useWorktabStore } from '@/store/modules/worktab'
import { isIframe } from './route'
import { useSettingStore } from '@/store/modules/setting'
import { useCommon } from '@/composables/useCommon'

/**
 * 根据当前路由信息设置工作标签页（worktab）
 * @param to 当前路由对象
 */
export const setWorktab = (to) => {
  const worktabStore = useWorktabStore()
  const { meta, path, name, params, query } = to
  if (!meta.isHideTab) {
    // 简化处理，不支持iframe路由
    if (useSettingStore().showWorkTab || path === useCommon().homePath.value) {
      worktabStore.openTab({
        title: meta.title,
        path,
        name: name,
        keepAlive: meta.keepAlive,
        params,
        query,
        fixedTab: meta.fixedTab
      })
    }
  }
}
