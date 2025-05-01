<template>
  <!-- 左侧侧边栏 -->
  <div 
    id="sidebar" 
    class="sidebar-transition"
    :class="{ 
      'sidebar-collapsed': isCollapsed
    }"
  >
    <div class="sidebar-content">
      <!-- 折叠按钮 -->
      <div class="sidebar-toggle-wrapper" 
           :style="{ 
             'right': isCollapsed ? '2px' : '-12px', 
             'top': '70px', 
             'height': '100px', 
             'z-index': 30
           }">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'" style="color: #0052cc;"></i>
        </div>
      </div>
      
      <!-- 正常状态下显示的内容 -->
      <div class="normal-content">
        <!-- 系统状态 -->
        <SystemStatusPanel v-if="visibleSections['systemStatus']?.visible" />
        
        <!-- 分隔线 -->
        <div class="sidebar-divider"></div>
        
        <!-- 仪表盘设置 -->
        <SidebarSettingsPanel 
          v-if="showDashboardSettings"
          :sidebarSections="sidebarSections"
          :currentTheme="currentTheme"
          @close="uiStore.showDashboardSettings = false"
          @save-settings="saveSettings"
          @move-section-up="moveSectionUp"
          @move-section-down="moveSectionDown"
        />
        
        <!-- 当前书籍信息 -->
        <BookInfoPanel v-if="visibleSections['currentBook']?.visible" />
        
        <!-- 阅读历史 -->
        <ReadingHistoryPanel 
          v-if="visibleSections['readingHistory']?.visible" 
          :historyViewMode="historyViewMode"
          :toggleBookHistory="toggleBookHistory"
          :expandedBookId="expandedBookId"
          :searchQuery="historySearchQuery"
          :filterDate="historyFilterDate"
          :filterGenre="historyFilterGenre"
          :formatRelativeTime="formatRelativeTime"
          :continueReading="continueReading"
        />
        
        <!-- 我的笔记 -->
        <NotesPanel v-if="visibleSections['notes']?.visible" />
        
        <!-- 个性化学习状态 -->
        <LearningStatusPanel 
          v-if="visibleSections['learningState']?.visible"
          :learningState="learningState"
          :showLearningStatistics="showLearningStatistics"
          :toggleLearningStatistics="() => showLearningStatistics = !showLearningStatistics"
        />
      </div>
      
      <!-- 折叠状态下显示的图标 -->
      <CollapsedSidebarIcons v-if="isCollapsed" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUIStore } from '../../store/modules/ui';
import SystemStatusPanel from './SystemStatus/SystemStatusPanel.vue';
import BookInfoPanel from './BookInfo/BookInfoPanel.vue';
import ReadingHistoryPanel from './ReadingHistory/ReadingHistoryPanel.vue';
import NotesPanel from './Notes/NotesPanel.vue';
import LearningStatusPanel from './LearningStatus/LearningStatusPanel.vue';
import SidebarSettingsPanel from './SidebarSettingsPanel.vue';
import CollapsedSidebarIcons from './CollapsedSidebarIcons.vue';

// 使用UI状态管理
const uiStore = useUIStore();

// 侧边栏状态
const isCollapsed = computed(() => uiStore.isSidebarCollapsed);

// 仪表盘设置
const showDashboardSettings = computed(() => uiStore.showDashboardSettings);
const currentTheme = computed(() => uiStore.currentTheme);
const sidebarSections = computed(() => uiStore.sidebarSections);

// 计算可见的部分
const visibleSections = computed(() => {
  const sections = {};
  Object.entries(sidebarSections.value)
    .filter(([_, section]) => section.visible)
    .sort((a, b) => a[1].order - b[1].order)
    .forEach(([key, section]) => {
      sections[key] = section;
    });
  return sections;
});

// 阅读历史变量
const historyViewMode = ref('list'); // 'list' 或 'timeline'
const expandedBookId = ref(null);
const historySearchQuery = ref('');
const historyFilterDate = ref('all');
const historyFilterGenre = ref('all');

// 学习状态相关变量
const showLearningStatistics = ref(false);
const learningState = ref({
  focusScore: {
    today: 85,
    trend: 'up', // 'up' 或 'down'
    continuousFocusTime: 28, // 分钟
  },
  // 这里只保留结构，详细数据会在LearningStatusPanel内定义
});

// 切换侧边栏折叠状态
function toggleSidebar() {
  uiStore.isSidebarCollapsed = !uiStore.isSidebarCollapsed;
  
  // 触发调整事件以便App.vue中的布局重新计算
  window.dispatchEvent(new CustomEvent('adjust-panel-widths'));
}

// 格式化相对时间（例如：今天、昨天、3天前）
function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) {
    return '今天';
  } else if (diff === 1) {
    return '昨天';
  } else if (diff < 7) {
    return `${diff}天前`;
  } else if (diff < 30) {
    const weeks = Math.floor(diff / 7);
    return `${weeks}周前`;
  } else {
    const months = Math.floor(diff / 30);
    return `${months}个月前`;
  }
}

// 切换书籍历史记录展开/折叠状态
function toggleBookHistory(bookId) {
  if (expandedBookId.value === bookId) {
    expandedBookId.value = null;
  } else {
    expandedBookId.value = bookId;
  }
}

// 继续阅读指定书籍
function continueReading(book) {
  console.log(`继续阅读: ${book.title}`);
}

// 保存仪表盘设置
function saveSettings() {
  uiStore.showDashboardSettings = false;
  // 这里可以添加保存设置到本地存储或发送到服务器的逻辑
}

// 向上移动部分
function moveSectionUp(key) {
  const sections = { ...uiStore.sidebarSections };
  const currentSection = sections[key];
  const currentOrder = currentSection.order;
  
  // 查找前一个部分
  const prevSection = Object.values(sections).find(section => section.order === currentOrder - 1);
  if (prevSection) {
    // 交换顺序
    currentSection.order -= 1;
    prevSection.order += 1;
    
    // 更新UI状态
    uiStore.sidebarSections = sections;
  }
}

// 向下移动部分
function moveSectionDown(key) {
  const sections = { ...uiStore.sidebarSections };
  const currentSection = sections[key];
  const currentOrder = currentSection.order;
  
  // 查找后一个部分
  const nextSection = Object.values(sections).find(section => section.order === currentOrder + 1);
  if (nextSection) {
    // 交换顺序
    currentSection.order += 1;
    nextSection.order -= 1;
    
    // 更新UI状态
    uiStore.sidebarSections = sections;
  }
}

onMounted(() => {
  // 监听侧边栏折叠/展开事件
  window.addEventListener('sidebar-toggle', () => {
    uiStore.isSidebarCollapsed = !uiStore.isSidebarCollapsed;
  });
});
</script>

<style scoped>
.sidebar-transition {
  position: relative;
  transition: width 0.3s ease-in-out;
}

.sidebar-collapsed {
  width: 48px;
  min-width: 48px;
}

.sidebar-transition:not(.sidebar-collapsed) {
  width: 20%;
  min-width: 200px;
}

.sidebar-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
}

.sidebar-collapsed .sidebar-content {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sidebar-toggle-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.sidebar-toggle:hover {
  background-color: #f3f4f6;
}

.normal-content {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}

.sidebar-divider {
  border-top: 1px solid #4b5563;
  margin: 1rem 0;
}

/* 深色模式 */
:global(.dark) .sidebar-content {
  background-color: #1e293b;
}

:global(.dark) .sidebar-toggle {
  background-color: #1e293b;
}

:global(.dark) .sidebar-toggle:hover {
  background-color: #334155;
}

:global(.dark) .sidebar-divider {
  border-top-color: #475569;
}
</style>
