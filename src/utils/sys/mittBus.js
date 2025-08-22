/**
 * 全局事件总线，用于全局事件的发布与订阅
 * 用法：
 * mittBus.on('event', callback)
 * mittBus.emit('event', data)
 */
// import mitt from 'mitt'

// 简单的事件总线实现，避免依赖问题
class SimpleMitt {
  constructor() {
    this.events = {}
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

// 创建事件总线实例
const mittBus = new SimpleMitt()

export default mittBus
