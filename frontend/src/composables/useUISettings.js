import { ref, computed, onMounted, watch } from 'vue';
import { useUIStore } from '../store/modules/ui';

export function useUISettings() {
  const uiStore = useUIStore();
  
  // 是否初始化完成
  const initialized = ref(false);
  
  // 窗口尺寸
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);
  
  // 是否为移动设备
  const isMobileDevice = computed(() => windowWidth.value < 768);
  
  // 是否为平板设备
  const isTabletDevice = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024);
  
  // 是否为桌面设备
  const isDesktopDevice = computed(() => windowWidth.value >= 1024);
  
  // 侧边栏宽度
  const sidebarWidth = computed(() => {
    if (uiStore.isSidebarCollapsed) {
      return '60px';
    }
    
    if (isMobileDevice.value) {
      return '100%'; // 在移动设备上，展开的侧边栏占据整个屏幕
    }
    
    return '320px';
  });
  
  // 书籍面板宽度（响应式）
  const bookPanelWidth = ref('40%');
  
  // 聊天面板宽度（响应式）
  const chatPanelWidth = ref('60%');
  
  // 更新窗口尺寸
  function updateWindowDimensions() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
    
    // 根据窗口尺寸调整面板尺寸
    adjustPanelWidths();
  }
  
  // 调整面板宽度
  function adjustPanelWidths() {
    if (isMobileDevice.value) {
      // 在移动设备上，书籍和聊天面板各占100%，需要通过切换来显示
      bookPanelWidth.value = '100%';
      chatPanelWidth.value = '100%';
    } else if (isTabletDevice.value) {
      // 在平板设备上，默认分配比例为50:50
      bookPanelWidth.value = '50%';
      chatPanelWidth.value = '50%';
    } else {
      // 在桌面设备上，默认分配比例为40:60
      bookPanelWidth.value = '40%';
      chatPanelWidth.value = '60%';
    }
  }
  
  // 调整书籍和聊天面板的相对宽度
  function resizePanels(bookWidth, chatWidth) {
    // 只在非移动设备上调整
    if (!isMobileDevice.value) {
      bookPanelWidth.value = bookWidth;
      chatPanelWidth.value = chatWidth;
      
      // 存储到本地存储，以便下次打开时保持一致
      localStorage.setItem('bookPanelWidth', bookWidth);
      localStorage.setItem('chatPanelWidth', chatWidth);
    }
  }
  
  // 监听窗口大小变化
  function setupResizeListener() {
    window.addEventListener('resize', updateWindowDimensions);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }
  
  // 设置分隔线拖动功能
  function setupResizerDrag() {
    const resizer = document.getElementById('resizer');
    if (!resizer) return;
    
    let isResizing = false;
    
    const startResizing = (e) => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      
      // 添加透明遮罩防止选中文本内容
      const overlay = document.createElement('div');
      overlay.id = 'resize-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;';
      document.body.appendChild(overlay);
    };
    
    const stopResizing = () => {
      isResizing = false;
      document.body.style.cursor = '';
      
      // 移除遮罩
      const overlay = document.getElementById('resize-overlay');
      if (overlay) overlay.remove();
    };
    
    const resize = (e) => {
      if (!isResizing) return;
      
      // 获取容器位置和尺寸
      const container = resizer.parentElement;
      const containerRect = container.getBoundingClientRect();
      
      // 计算相对位置
      const position = (e.clientX - containerRect.left) / containerRect.width;
      
      // 限制拖动范围（最小20%，最大80%）
      const limitedPosition = Math.min(Math.max(position, 0.2), 0.8);
      
      // 转换为百分比字符串
      const bookWidth = `${limitedPosition * 100}%`;
      const chatWidth = `${(1 - limitedPosition) * 100}%`;
      
      // 更新宽度
      resizePanels(bookWidth, chatWidth);
    };
    
    // 添加事件监听器
    resizer.addEventListener('mousedown', startResizing);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
    
    // 清理函数
    return () => {
      resizer.removeEventListener('mousedown', startResizing);
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }
  
  // 切换侧边栏折叠状态
  function toggleSidebar() {
    uiStore.toggleSidebar();
  }
  
  // 切换深色/浅色模式
  function toggleDarkMode() {
    uiStore.toggleDarkMode();
  }
  
  // 设置主题
  function setTheme(theme) {
    uiStore.setTheme(theme);
  }
  
  // 获取CSS类动态绑定对象
  const themeClasses = computed(() => {
    return {
      'theme-default': uiStore.currentTheme === '默认',
      'theme-dark': uiStore.currentTheme === '深色',
      'theme-soft': uiStore.currentTheme === '柔和',
      'dark': uiStore.isDarkMode,
      'sidebar-collapsed': uiStore.isSidebarCollapsed,
      'mobile-device': isMobileDevice.value,
      'tablet-device': isTabletDevice.value,
      'desktop-device': isDesktopDevice.value
    };
  });
  
  // 监听UI Store中的设置变化，并更新相应状态
  watch(() => uiStore.isSidebarCollapsed, (newValue) => {
    // 当侧边栏状态改变时，可能需要调整其他元素的大小
    // 触发一个自定义事件，以便其他组件可以响应这个变化
    window.dispatchEvent(new CustomEvent('sidebar-state-changed', { 
      detail: { collapsed: newValue } 
    }));
  });
  
  // 初始化
  function init() {
    if (initialized.value) return;
    
    // 初始化UI Store
    uiStore.init();
    
    // 加载保存的面板宽度
    const savedBookWidth = localStorage.getItem('bookPanelWidth');
    const savedChatWidth = localStorage.getItem('chatPanelWidth');
    
    if (savedBookWidth && savedChatWidth) {
      bookPanelWidth.value = savedBookWidth;
      chatPanelWidth.value = savedChatWidth;
    } else {
      adjustPanelWidths();
    }
    
    // 标记为已初始化
    initialized.value = true;
  }
  
  // 在组件挂载时执行一次性初始化
  onMounted(() => {
    init();
    
    // 设置窗口大小变化监听器
    const cleanupResizeListener = setupResizeListener();
    
    // 设置分隔线拖动功能
    const cleanupResizerDrag = setupResizerDrag();
    
    // 监听调整面板宽度的自定义事件
    window.addEventListener('adjust-panel-widths', adjustPanelWidths);
    
    // 返回清理函数
    return () => {
      cleanupResizeListener();
      cleanupResizerDrag();
      window.removeEventListener('adjust-panel-widths', adjustPanelWidths);
    };
  });
  
  return {
    windowWidth,
    windowHeight,
    isMobileDevice,
    isTabletDevice,
    isDesktopDevice,
    sidebarWidth,
    bookPanelWidth,
    chatPanelWidth,
    themeClasses,
    toggleSidebar,
    toggleDarkMode,
    setTheme,
    resizePanels,
    adjustPanelWidths
  };
}
