<template>
  <div :class="currentTheme">
    <!-- 顶部导航栏 -->
    <NavBar />
    
    <!-- 侧边导航菜单 -->
    <SideNav />
    
    <!-- 主内容区域 -->
    <div class="container mx-auto px-4 py-6 main-content-container">
      <div class="main-content flex">
        <!-- 左侧边栏 - 系统状态 -->
        <Sidebar />
        
        <!-- 中间和右侧区域容器 -->
        <div class="flex flex-1 min-w-0">
          <!-- 中间 - 书籍显示 -->
          <BookPanel />
          
          <!-- 可调整大小的分隔线 -->
          <div id="resizer" class="resizer w-2 bg-gray-200 hover:bg-blue-500 cursor-col-resize"></div>
          
          <!-- 右侧 - AI助手聊天 -->
          <ChatPanel />
        </div>
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
  console.log('App组件已挂载');
  
  // 延迟初始化以确保DOM元素已完全渲染
  setTimeout(() => {
    console.log('开始初始化面板宽度和拖动条');
    setInitialPanelWidths();
    initResizer();
  }, 500);
  
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

// 新的拖动条实现
function initResizer() {
  console.log('初始化拖动条...');
  const resizer = document.querySelector('#resizer');
  const leftPanel = document.querySelector('#book-panel');
  const rightPanel = document.querySelector('#chat-panel');
  
  if (!resizer) console.error('拖动条元素不存在');
  if (!leftPanel) console.error('左侧面板元素不存在');
  if (!rightPanel) console.error('右侧面板元素不存在');
  
  if (!resizer || !leftPanel || !rightPanel) {
    console.error('拖动条初始化失败: 缺少必要元素');
    return;
  }
  
  console.log('找到所有必要元素，继续初始化拖动条');
  
  // 添加数据属性标识这是主拖动条
  resizer.setAttribute('data-main-resizer', 'true');
  
  // 确保拖动条可见并有足够的宽度便于用户抓取
  resizer.style.opacity = '1';
  resizer.style.width = '8px';
  resizer.style.zIndex = '100';
  resizer.style.backgroundColor = '#e5e7eb';
  
  console.log('设置拖动条样式完成');
  
  const handleMouseDown = (e) => {
    console.log('拖动条鼠标按下事件触发');
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    const startX = e.clientX;
    const leftWidth = leftPanel.getBoundingClientRect().width;
    const rightWidth = rightPanel.getBoundingClientRect().width;
    const totalWidth = leftWidth + rightWidth;
    
    console.log(`开始拖动: 左宽=${leftWidth}px, 右宽=${rightWidth}px, 总宽=${totalWidth}px`);
    
    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      // 确保最小宽度，防止面板变得太小
      const newLeftWidth = Math.max(300, Math.min(totalWidth - 300, leftWidth + dx));
      const newRightWidth = totalWidth - newLeftWidth;
      
      leftPanel.style.width = `${newLeftWidth}px`;
      rightPanel.style.width = `${newRightWidth}px`;
      
      // 添加拖动状态类来提高视觉反馈
      resizer.classList.add('resizer-active');
      
      // 每100px移动记录一次日志
      if (Math.abs(dx) % 100 < 5) {
        console.log(`拖动中: 左宽=${newLeftWidth}px, 右宽=${newRightWidth}px, 位移=${dx}px`);
      }
    };
    
    const onMouseUp = () => {
      console.log('拖动结束');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      resizer.classList.remove('resizer-active');
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  // 移除所有现有事件监听器后重新添加
  const oldResizer = resizer;
  const newResizer = resizer.cloneNode(true);
  oldResizer.parentNode.replaceChild(newResizer, oldResizer);
  
  console.log('已克隆并替换拖动条元素，准备添加事件监听器');
  
  // 添加事件监听器
  newResizer.addEventListener('mousedown', handleMouseDown);
  
  // 添加悬停和活动状态的视觉提示
  newResizer.addEventListener('mouseover', () => {
    newResizer.style.backgroundColor = '#3b82f6';
  });
  
  newResizer.addEventListener('mouseleave', () => {
    if (!newResizer.classList.contains('resizer-active')) {
      newResizer.style.backgroundColor = '#e5e7eb';
    }
  });
  
  console.log('拖动条初始化完成');
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
}

.panel-container {
  position: relative;
  transition: width 0.3s ease;
}

.panel-container-transition {
  transition: width 0.3s ease, margin 0.3s ease;
}

/* 修复拖动条样式 */
.resizer {
  width: 8px;
  background-color: #e5e7eb;
  cursor: col-resize;
  transition: background-color 0.2s ease;
  z-index: 10;
  opacity: 1;
  margin: 0 -3px;
}

.resizer:hover, .resizer-active {
  background-color: #3b82f6;
}

.dark .resizer {
  background-color: #374151;
}

.dark .resizer:hover, .dark .resizer-active {
  background-color: #3b82f6;
}
</style>
