import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  // 侧边栏折叠状态
  const isSidebarCollapsed = ref(false);
  
  // 当前主题
  const currentTheme = ref('默认'); // '默认', '深色', '柔和'
  
  // 暗黑模式设置
  const isDarkMode = ref(false);
  
  // 是否显示仪表盘设置
  const showDashboardSettings = ref(false);
  
  // 侧边栏部分配置
  const sidebarSections = ref({
    systemStatus: { label: '系统状态', visible: true, order: 1 },
    currentBook: { label: '当前书籍', visible: true, order: 2 },
    readingHistory: { label: '阅读历史', visible: true, order: 3 },
    notes: { label: '我的笔记', visible: true, order: 4 },
    learningState: { label: '学习状态', visible: true, order: 5 }
  });
  
  // 阅读界面设置
  const bookUISettings = ref({
    isHeaderCollapsed: false,
    isFooterCollapsed: false,
    showChapterNav: false,
    showBookmarks: false,
    showNotesPanel: false,
    enableKeywordHighlight: false
  });
  
  // 聊天界面设置
  const chatUISettings = ref({
    showSuggestions: true,
    showTools: false,
    isMessageCollapsed: true,
    aiSettings: {
      responseLength: 'balanced', // 'concise', 'balanced', 'detailed'
      tonality: 'professional', // 'friendly', 'professional', 'academic'
      includeCitations: true,
      autoSuggestQuestions: true,
      notifyBookmarkReferences: true,
      notifyNoteReferences: true,
      theme: 'auto' // 'light', 'dark', 'auto'
    }
  });
  
  // 学习工具显示状态
  const learningToolsState = ref({
    showConceptMap: false,
    showStudyCards: false,
    showLearningStatistics: false
  });
  
  // 模态框状态
  const modalState = ref({
    showSettingsPanel: false,
    showDrawingTool: false
  });
  
  // 切换侧边栏折叠状态
  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    // 触发窗口调整事件，以便其他组件响应
    window.dispatchEvent(new CustomEvent('adjust-panel-widths'));
  }
  
  // 设置主题
  function setTheme(theme) {
    currentTheme.value = theme;
    
    // 保存到本地存储
    localStorage.setItem('theme', theme);
    
    // 如果是'深色'主题，自动切换到暗黑模式
    if (theme === '深色') {
      setDarkMode(true);
    } else if (theme === '默认') {
      // 默认主题时，使用系统偏好设置
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    } else {
      // 柔和主题默认使用浅色模式
      setDarkMode(false);
    }
  }
  
  // 切换暗黑模式
  function toggleDarkMode() {
    setDarkMode(!isDarkMode.value);
  }
  
  // 设置暗黑模式
  function setDarkMode(value) {
    isDarkMode.value = value;
    
    // 更新DOM
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 保存到本地存储
    localStorage.setItem('darkMode', value ? 'true' : 'false');
  }
  
  // 显示/隐藏仪表盘设置
  function toggleDashboardSettings() {
    showDashboardSettings.value = !showDashboardSettings.value;
  }
  
  // 显示/隐藏章节导航
  function toggleChapterNav() {
    bookUISettings.value.showChapterNav = !bookUISettings.value.showChapterNav;
    
    // 如果显示章节导航，则关闭书签面板
    if (bookUISettings.value.showChapterNav && bookUISettings.value.showBookmarks) {
      bookUISettings.value.showBookmarks = false;
    }
  }
  
  // 显示/隐藏书签面板
  function toggleBookmarks() {
    bookUISettings.value.showBookmarks = !bookUISettings.value.showBookmarks;
    
    // 如果显示书签面板，则关闭章节导航
    if (bookUISettings.value.showBookmarks && bookUISettings.value.showChapterNav) {
      bookUISettings.value.showChapterNav = false;
    }
  }
  
  // 显示/隐藏笔记面板
  function toggleNotesPanel() {
    bookUISettings.value.showNotesPanel = !bookUISettings.value.showNotesPanel;
  }
  
  // 切换关键词高亮
  function toggleKeywordHighlight() {
    bookUISettings.value.enableKeywordHighlight = !bookUISettings.value.enableKeywordHighlight;
  }
  
  // 切换顶部导航栏显示/隐藏
  function toggleHeader() {
    bookUISettings.value.isHeaderCollapsed = !bookUISettings.value.isHeaderCollapsed;
  }
  
  // 切换底部导航栏显示/隐藏
  function toggleFooter() {
    bookUISettings.value.isFooterCollapsed = !bookUISettings.value.isFooterCollapsed;
  }
  
  // 切换提问建议显示/隐藏
  function toggleSuggestions() {
    chatUISettings.value.showSuggestions = !chatUISettings.value.showSuggestions;
  }
  
  // 切换工具显示/隐藏
  function toggleTools() {
    chatUISettings.value.showTools = !chatUISettings.value.showTools;
  }
  
  // 显示/隐藏设置面板
  function toggleSettingsPanel() {
    modalState.value.showSettingsPanel = !modalState.value.showSettingsPanel;
  }
  
  // 显示/隐藏绘图工具
  function toggleDrawingTool() {
    modalState.value.showDrawingTool = !modalState.value.showDrawingTool;
  }
  
  // 上下移动侧边栏部分
  function moveSectionUp(key) {
    const currentSection = sidebarSections.value[key];
    const currentOrder = currentSection.order;
    
    // 查找前一个部分
    const prevSection = Object.values(sidebarSections.value).find(section => section.order === currentOrder - 1);
    if (prevSection) {
      // 交换顺序
      currentSection.order -= 1;
      prevSection.order += 1;
    }
  }
  
  function moveSectionDown(key) {
    const currentSection = sidebarSections.value[key];
    const currentOrder = currentSection.order;
    
    // 查找后一个部分
    const nextSection = Object.values(sidebarSections.value).find(section => section.order === currentOrder + 1);
    if (nextSection) {
      // 交换顺序
      currentSection.order += 1;
      nextSection.order -= 1;
    }
  }
  
  // 保存侧边栏设置
  function saveSidebarSettings() {
    localStorage.setItem('sidebarSections', JSON.stringify(sidebarSections.value));
  }
  
  // 加载侧边栏设置
  function loadSidebarSettings() {
    const savedSettings = localStorage.getItem('sidebarSections');
    if (savedSettings) {
      try {
        sidebarSections.value = JSON.parse(savedSettings);
      } catch (error) {
        console.error('加载侧边栏设置失败:', error);
      }
    }
  }
  
  // 保存UI设置
  function saveUISettings() {
    localStorage.setItem('bookUISettings', JSON.stringify(bookUISettings.value));
    localStorage.setItem('chatUISettings', JSON.stringify(chatUISettings.value));
  }
  
  // 加载UI设置
  function loadUISettings() {
    const savedBookUI = localStorage.getItem('bookUISettings');
    if (savedBookUI) {
      try {
        bookUISettings.value = { ...bookUISettings.value, ...JSON.parse(savedBookUI) };
      } catch (error) {
        console.error('加载书籍UI设置失败:', error);
      }
    }
    
    const savedChatUI = localStorage.getItem('chatUISettings');
    if (savedChatUI) {
      try {
        chatUISettings.value = { ...chatUISettings.value, ...JSON.parse(savedChatUI) };
      } catch (error) {
        console.error('加载聊天UI设置失败:', error);
      }
    }
  }
  
  // 初始化
  function init() {
    // 加载主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 根据系统偏好设置暗黑模式
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    
    // 加载暗黑模式设置
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
    
    // 加载侧边栏设置
    loadSidebarSettings();
    
    // 加载UI设置
    loadUISettings();
  }
  
  return {
    isSidebarCollapsed,
    currentTheme,
    isDarkMode,
    showDashboardSettings,
    sidebarSections,
    bookUISettings,
    chatUISettings,
    learningToolsState,
    modalState,
    toggleSidebar,
    setTheme,
    toggleDarkMode,
    setDarkMode,
    toggleDashboardSettings,
    toggleChapterNav,
    toggleBookmarks,
    toggleNotesPanel,
    toggleKeywordHighlight,
    toggleHeader,
    toggleFooter,
    toggleSuggestions,
    toggleTools,
    toggleSettingsPanel,
    toggleDrawingTool,
    moveSectionUp,
    moveSectionDown,
    saveSidebarSettings,
    saveUISettings,
    init
  };
});
