<template>
  <div :class="currentTheme">
    <!-- 顶部导航栏 -->
    <NavBar />
    
    <!-- 侧边导航菜单 -->
    <SideNav />
    
    <!-- 主内容区域 -->
    <div class="main-content-container">
      <div class="main-content">
        <!-- 左侧边栏 - 系统状态 -->
        <Sidebar />
        
        <!-- 中间和右侧区域容器 -->
        <div class="content-container" :class="{ 'content-expanded': !uiStore.isSidebarCollapsed, 'content-collapsed': uiStore.isSidebarCollapsed }">
          <!-- 中间 - 书籍显示 -->
          <BookPanel id="book-panel" />
          
          <!-- 可调整大小的分隔线 -->
          <div id="resizer" class="resizer"></div>
          
          <!-- 右侧 - AI助手聊天 -->
          <ChatPanel id="chat-panel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, provide } from 'vue';
import NavBar from './components/layout/NavBar.vue';
import SideNav from './components/layout/SideNav.vue';
import Sidebar from './components/sidebar/index.vue';
import BookPanel from './components/book/index.vue';
import ChatPanel from './components/chat/index.vue';
import { useTheme } from './composables/useTheme';
import { useBookPages } from './store/bookPages';
import { useUIStore } from './store/modules/ui';

// 获取UI状态
const uiStore = useUIStore();

// 使用主题相关的组合式API
const { currentTheme, toggleTheme, setTheme } = useTheme();
provide('theme', { currentTheme, toggleTheme, setTheme });

// 使用书籍数据
const { bookPages, currentPageIndex, navigatePage, renderPage } = useBookPages();
provide('bookData', { bookPages, currentPageIndex, navigatePage, renderPage });

// 提供UI状态
provide('uiStore', uiStore);

// 组件挂载后执行初始化
onMounted(() => {
  console.log('App组件已挂载');
  
  // 延迟初始化以确保DOM元素已完全渲染
  setTimeout(() => {
    console.log('开始初始化面板宽度和拖动条');
    setInitialPanelWidths();
    initResizer();
    setupPanelWidthListeners();
    checkDeviceAndAdjustLayout();
  }, 100);
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setInitialPanelWidths();
    checkDeviceAndAdjustLayout();
  });
  
  // 添加窗口调整事件监听器
  window.addEventListener('resize', adjustPanelWidths);
  
  // 添加调整面板宽度事件监听器
  window.addEventListener('adjust-panel-widths', adjustPanelWidths);
});

// 组件卸载前移除事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', adjustPanelWidths);
  window.removeEventListener('adjust-panel-widths', adjustPanelWidths);
});

// 处理侧边栏折叠/展开事件
function handleSidebarToggle() {
  uiStore.toggleSidebar();
  
  // 重新计算面板宽度
  setTimeout(() => {
    const container = document.querySelector('.main-content');
    const bookPanel = document.querySelector('.book-panel');
    const chatPanel = document.querySelector('.chat-panel');
    
    if (!container || !bookPanel || !chatPanel) return;
    
    const availableWidth = container.offsetWidth;
    
    if (uiStore.isSidebarCollapsed) {
      // 侧边栏折叠时，将侧边栏原占空间分配给书籍面板
      const sidebarWidth = 48; // 折叠后的宽度
      const bookPanelWidth = parseInt(bookPanel.style.width || bookPanel.offsetWidth);
      const chatPanelWidth = parseInt(chatPanel.style.width || chatPanel.offsetWidth);
      
      const totalWidth = bookPanelWidth + chatPanelWidth;
      const ratio = bookPanelWidth / totalWidth;
      
      // 按比例分配额外空间
      const extraSpace = 152; // 200 - 48 = 152px
      const extraForBook = extraSpace * ratio;
      
      bookPanel.style.width = `${bookPanelWidth + extraForBook}px`;
      chatPanel.style.width = `${chatPanelWidth + (extraSpace - extraForBook)}px`;
    } else {
      // 恢复默认比例
      bookPanel.style.width = '40%';
      chatPanel.style.width = '60%';
    }
  }, 300); // 给过渡效果一些时间
}

// 设置初始面板宽度
function setInitialPanelWidths() {
  const bookPanel = document.getElementById('book-panel');
  const chatPanel = document.getElementById('chat-panel');
  
  if (!bookPanel || !chatPanel) return;
  
  // 从本地存储或设置默认值
  let bookPanelWidth = localStorage.getItem('bookPanelWidth') || '40%';
  let chatPanelWidth = localStorage.getItem('chatPanelWidth') || '60%';
  
  // 侧边栏折叠状态可能需要调整宽度
  if (uiStore.isSidebarCollapsed) {
    // 计算额外空间分配
    bookPanelWidth = 'calc(40% + 152px)';
  }
  
  // 设置到UI Store
  uiStore.bookPanelWidth = bookPanelWidth;
  uiStore.chatPanelWidth = chatPanelWidth;
  
  // 应用样式
  bookPanel.style.width = bookPanelWidth;
  chatPanel.style.width = chatPanelWidth;
}

// 根据设备类型调整布局
function checkDeviceAndAdjustLayout() {
  const isMobile = window.innerWidth < 1024;
  
  if (isMobile) {
    // 移动设备上垂直堆叠面板
    const panels = document.querySelectorAll('.panel-container');
    panels.forEach(panel => {
      panel.style.width = '100%';
    });
  } else {
    // 桌面设备上水平布局面板
    setInitialPanelWidths();
  }
}

// 监听调整面板宽度事件
function setupPanelWidthListeners() {
  window.addEventListener('adjust-panel-widths', () => {
    // 调整两个面板的宽度
    const bookPanel = document.querySelector('#book-panel');
    const chatPanel = document.querySelector('#chat-panel');
    
    if (!bookPanel || !chatPanel) return;
    
    // 从UI Store获取最新宽度
    bookPanel.style.width = uiStore.bookPanelWidth;
    chatPanel.style.width = uiStore.chatPanelWidth;
  });
}

// 初始化拖动条功能
function initResizer() {
  const resizer = document.getElementById('resizer');
  const bookPanel = document.getElementById('book-panel');
  const chatPanel = document.getElementById('chat-panel');
  
  if (!resizer || !bookPanel || !chatPanel) {
    console.error('无法找到拖动条或面板元素');
    return;
  }
  
  let isResizing = false;
  let initialX;
  let initialBookWidth;
  let initialChatWidth;
  
  // 鼠标按下事件
  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    initialX = e.clientX;
    initialBookWidth = bookPanel.offsetWidth;
    initialChatWidth = chatPanel.offsetWidth;
    
    // 添加临时事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 添加调整中的视觉指示
    resizer.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });
  
  // 处理鼠标移动
  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const totalWidth = initialBookWidth + initialChatWidth;
    const minWidth = totalWidth * 0.2; // 最小宽度为总宽度的20%
    const maxWidth = totalWidth * 0.8; // 最大宽度为总宽度的80%
    
    // 计算拖动距离
    const deltaX = e.clientX - initialX;
    
    // 计算新的面板宽度
    let newBookWidth = initialBookWidth + deltaX;
    let newChatWidth = initialChatWidth - deltaX;
    
    // 限制面板最小和最大宽度
    if (newBookWidth < minWidth) {
      newBookWidth = minWidth;
      newChatWidth = totalWidth - minWidth;
    } else if (newBookWidth > maxWidth) {
      newBookWidth = maxWidth;
      newChatWidth = totalWidth - maxWidth;
    }
    
    // 设置新的宽度
    bookPanel.style.width = `${newBookWidth}px`;
    chatPanel.style.width = `${newChatWidth}px`;
    
    // 更新UI Store中的宽度值（使用百分比）
    const bookWidthPercentage = Math.round((newBookWidth / totalWidth) * 100);
    const chatWidthPercentage = 100 - bookWidthPercentage;
    
    uiStore.bookPanelWidth = `${bookWidthPercentage}%`;
    uiStore.chatPanelWidth = `${chatWidthPercentage}%`;
    
    // 保存到本地存储
    localStorage.setItem('bookPanelWidth', `${bookWidthPercentage}%`);
    localStorage.setItem('chatPanelWidth', `${chatWidthPercentage}%`);
  }
  
  // 处理鼠标释放
  function handleMouseUp() {
    isResizing = false;
    
    // 移除临时事件监听器
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 移除调整中的视觉指示
    resizer.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
}

// 调整面板宽度
function adjustPanelWidths() {
  const bookPanel = document.getElementById('book-panel');
  const chatPanel = document.getElementById('chat-panel');
  
  if (!bookPanel || !chatPanel) return;
  
  // 获取UI Store中的宽度值
  const bookPanelWidth = uiStore.bookPanelWidth;
  const chatPanelWidth = uiStore.chatPanelWidth;
  
  // 应用宽度样式
  bookPanel.style.width = bookPanelWidth;
  chatPanel.style.width = chatPanelWidth;
}

// 调整面板宽度
adjustPanelWidths();
</script>

<style scoped>
.main-content-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.main-content {
  display: flex;
  height: 100%;
  position: relative;
}

.content-container {
  display: flex;
  flex: 1;
  min-width: 0;
  position: relative;
  margin-left: 1rem;
}

.content-expanded {
  margin-left: 1rem;
}

.content-collapsed {
  margin-left: 0;
}

.resizer {
  width: 0.5rem;
  background-color: #e5e7eb;
  cursor: col-resize;
  transition: background-color 0.2s ease;
  z-index: 10;
}

.resizer:hover {
  background-color: #3b82f6;
}

.resizer.active {
  background-color: #3b82f6;
}

/* 深色模式样式优化 */
:global(.dark) {
  background-color: #111827;
  color: #e5e7eb;
}

:global(.dark) .main-content-container {
  background-color: #111827;
}

:global(.dark) .resizer {
  background-color: #374151;
}

:global(.dark) .resizer:hover,
:global(.dark) .resizer.active {
  background-color: #4d98ff;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .content-container {
    flex-direction: column;
    margin-left: 0;
    margin-top: 1rem;
  }
  
  .resizer {
    width: 100%;
    height: 0.5rem;
    cursor: row-resize;
  }
}

/* 面板过渡效果 */
#book-panel, #chat-panel {
  transition: width 0.3s ease;
}

/* 当侧边栏折叠/展开时，内容区域过渡效果 */
.content-expanded, .content-collapsed {
  transition: all 0.3s ease;
}
</style>
