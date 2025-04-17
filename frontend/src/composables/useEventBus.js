import { ref, onBeforeUnmount } from 'vue'

// 创建一个全局事件总线单例
const eventHandlers = ref(new Map())

export function useEventBus() {
  // 注册事件处理函数
  function on(event, handler) {
    if (!eventHandlers.value.has(event)) {
      eventHandlers.value.set(event, [])
    }
    eventHandlers.value.get(event).push(handler)
    
    // 清理函数
    return () => off(event, handler)
  }
  
  // 移除事件处理函数
  function off(event, handler) {
    if (!eventHandlers.value.has(event)) return
    
    const handlers = eventHandlers.value.get(event)
    const index = handlers.indexOf(handler)
    
    if (index !== -1) {
      handlers.splice(index, 1)
    }
    
    if (handlers.length === 0) {
      eventHandlers.value.delete(event)
    }
  }
  
  // 触发事件
  function emit(event, payload) {
    if (!eventHandlers.value.has(event)) return
    
    for (const handler of eventHandlers.value.get(event)) {
      handler(payload)
    }
  }
  
  // 组件卸载前清除所有事件处理函数
  function cleanup() {
    eventHandlers.value.clear()
  }

  onBeforeUnmount(() => {
    // 这里可以选择是否清除所有事件
    // 根据实际应用需求决定
    // cleanup()
  })
  
  return {
    on,
    off,
    emit,
    cleanup
  }
}
