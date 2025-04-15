<template>
  <div :class="currentTheme">
    <!-- 顶部导航栏 -->
    <NavBar />
    
    <!-- 侧边导航菜单 -->
    <SideNav />
    
    <!-- 主内容区域 -->
    <div class="container mx-auto px-4 py-6 main-content-container">
      <div class="main-content">
        <!-- 左侧边栏 - 系统状态 -->
        <Sidebar />
        
        <!-- 中间 - 书籍显示 -->
        <BookPanel />
        
        <!-- 可调整大小的分隔线 - 只在大屏幕上可见 -->
        <div id="resizer" class="resizer my-2 lg:my-0 lg:h-full"></div>
        
        <!-- 右侧 - AI助手聊天 -->
        <ChatPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import NavBar from './components/NavBar.vue';
import SideNav from './components/SideNav.vue';
import Sidebar from './components/Sidebar.vue';
import BookPanel from './components/BookPanel.vue';
import ChatPanel from './components/ChatPanel.vue';
import { useTheme } from './composables/useTheme';
import { useBookPages } from './store/bookPages';

// 使用主题相关的组合式API
const { currentTheme, toggleTheme, setTheme } = useTheme();
provide('theme', { currentTheme, toggleTheme, setTheme });

// 使用书籍数据
const { bookPages, currentPageIndex, navigatePage, renderPage } = useBookPages();
provide('bookData', { bookPages, currentPageIndex, navigatePage, renderPage });

// 侧边栏状态
const isSidebarCollapsed = ref(false);
provide('sidebarState', isSidebarCollapsed);

// 初始化应用
onMounted(() => {
  // 设置面板初始宽度
  setInitialPanelWidths();
  
  // 初始化拖拽分隔线
  initResizer();
  
  // 响应设备类型
  checkDeviceAndAdjustLayout();
  
  // 监听窗口大小改变
  window.addEventListener('resize', () => {
    checkDeviceAndAdjustLayout();
  });
  
  // 监听侧边栏折叠/展开事件
  window.addEventListener('adjust-panel-widths', handleSidebarToggle);
});

// 处理侧边栏折叠/展开事件
function handleSidebarToggle() {
  const container = document.querySelector('.main-content');
  if (!container) return;
  
  const sidebar = document.querySelector('#sidebar');
  const bookPanel = document.querySelector('#book-panel');
  const chatPanel = document.querySelector('#chat-panel');
  
  if (!sidebar || !bookPanel || !chatPanel) return;
  
  const availableWidth = container.offsetWidth;
  
  if (isSidebarCollapsed.value) {
    // 侧边栏折叠时，将侧边栏原占空间分配给书籍面板
    const sidebarWidth = 48; // 折叠后的宽度
    const bookPanelWidth = parseInt(bookPanel.style.width || bookPanel.offsetWidth);
    const chatPanelWidth = parseInt(chatPanel.style.width || chatPanel.offsetWidth);
    
    // 计算原侧边栏宽度与折叠后宽度的差值
    const originalSidebarWidth = parseInt(sidebar.dataset.originalWidth || availableWidth * 0.2);
    const extraSpace = originalSidebarWidth - sidebarWidth;
    
    // 将额外空间分配给书籍面板
    bookPanel.style.width = `${bookPanelWidth + extraSpace}px`;
    
    // 保存原始宽度以便展开时恢复
    if (!sidebar.dataset.originalWidth) {
      sidebar.dataset.originalWidth = `${originalSidebarWidth}`;
      bookPanel.dataset.originalWidth = `${bookPanelWidth}`;
    }
  } else {
    // 侧边栏展开时，恢复原始宽度
    if (sidebar.dataset.originalWidth && bookPanel.dataset.originalWidth) {
      const originalSidebarWidth = parseInt(sidebar.dataset.originalWidth);
      const originalBookPanelWidth = parseInt(bookPanel.dataset.originalWidth);
      
      sidebar.style.width = `${originalSidebarWidth}px`;
      bookPanel.style.width = `${originalBookPanelWidth}px`;
    }
  }
}

// 设置初始面板宽度
function setInitialPanelWidths() {
  if (window.innerWidth < 1024) return;
  
  const container = document.querySelector('.main-content');
  if (!container) return;
  
  const sidebar = document.querySelector('#sidebar');
  const bookPanel = document.querySelector('#book-panel');
  const chatPanel = document.querySelector('#chat-panel');
  
  if (!sidebar || !bookPanel || !chatPanel) return;
  
  // 设置默认比例：侧边栏 20%，书籍面板 40%，聊天面板 40%
  const sidebarRatio = 0.2;
  const bookRatio = 0.4;
  const chatRatio = 0.4;
  
  const availableWidth = container.offsetWidth;
  
  sidebar.style.width = `${availableWidth * sidebarRatio}px`;
  bookPanel.style.width = `${availableWidth * bookRatio}px`;
  chatPanel.style.width = `${availableWidth * chatRatio}px`;
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

// 初始化拖拽分隔线
function initResizer() {
  const resizer = document.querySelector('#resizer');
  if (!resizer) return;
  
  let isResizing = false;
  let lastX = 0;
  
  // 鼠标按下事件
  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    lastX = e.clientX;
    resizer.classList.add('active');
    document.body.style.cursor = 'col-resize';
    
    // 防止选择文本
    document.addEventListener('selectstart', preventSelection);
  });
  
  // 鼠标移动事件
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - lastX;
    lastX = e.clientX;
    
    // 获取面板元素
    const bookPanel = document.querySelector('#book-panel');
    const chatPanel = document.querySelector('#chat-panel');
    
    if (!bookPanel || !chatPanel) return;
    
    // 计算新的宽度
    const currentBookWidth = parseInt(bookPanel.style.width) || bookPanel.offsetWidth;
    const currentChatWidth = parseInt(chatPanel.style.width) || chatPanel.offsetWidth;
    
    // 设置新宽度，确保不小于最小宽度
    const minWidth = 200; // 最小宽度
    const maxChatWidth = window.innerWidth - minWidth - 50; // 聊天面板最大宽度（留出左侧和分隔线空间）
    
    // 向右拖动（增加书籍面板宽度）
    if (deltaX > 0) {
      // 如果聊天面板已经达到最小宽度，不再增加书籍面板宽度
      if (currentChatWidth <= minWidth) return;
      
      const newBookWidth = Math.max(currentBookWidth + deltaX, minWidth);
      const newChatWidth = Math.max(currentChatWidth - deltaX, minWidth);
      
      // 应用新宽度
      bookPanel.style.width = `${newBookWidth}px`;
      chatPanel.style.width = `${newChatWidth}px`;
    } 
    // 向左拖动（减少书籍面板宽度）
    else if (deltaX < 0) {
      // 如果书籍面板已经达到最小宽度，不再减少
      if (currentBookWidth <= minWidth) return;
      
      const newBookWidth = Math.max(currentBookWidth + deltaX, minWidth);
      const newChatWidth = Math.min(currentChatWidth - deltaX, maxChatWidth);
      
      // 应用新宽度
      bookPanel.style.width = `${newBookWidth}px`;
      chatPanel.style.width = `${newChatWidth}px`;
    }
  });
  
  // 鼠标松开事件 - 停止调整大小
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('active');
      document.body.style.cursor = '';
      
      // 移除防止选择的事件监听器
      document.removeEventListener('selectstart', preventSelection);
    }
  });
  
  // 防止在拖拽时选择文本
  function preventSelection(e) {
    e.preventDefault();
    return false;
  }
}
</script>

<style scoped>
.main-content-container {
  height: calc(100vh - 60px);
  width: 100%;
  overflow: hidden;
}

.main-content {
  display: flex;
  height: 100%;
  width: 100%;
}

.resizer {
  width: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: col-resize;
  flex-shrink: 0;
}

:root.dark .resizer {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
