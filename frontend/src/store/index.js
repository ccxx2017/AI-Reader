import { createPinia } from 'pinia';
import { useBookStore } from './modules/book';
import { useUIStore } from './modules/ui';
import { useNotesStore } from './modules/notes';
import { useReadingStore } from './modules/reading';
import { useChatStore } from './modules/chat';

// 创建 Pinia 实例
const pinia = createPinia();

// 初始化函数，用于集中初始化所有状态管理模块
export function initializeStores() {
  // 获取各个存储模块的实例
  const uiStore = useUIStore();
  const bookStore = useBookStore();
  const notesStore = useNotesStore();
  const readingStore = useReadingStore();
  const chatStore = useChatStore();
  
  // 按照依赖关系，依次初始化各个模块
  uiStore.init();
  bookStore.init();
  notesStore.init();
  readingStore.init();
  chatStore.init();
  
  console.log('所有状态管理模块已初始化');
}

// 导出 Pinia 实例和各个存储模块
export {
  pinia,
  useBookStore,
  useUIStore,
  useNotesStore,
  useReadingStore,
  useChatStore
};
