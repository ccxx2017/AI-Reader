<template>
  <!-- 左侧侧边栏 -->
  <div 
    id="sidebar" 
    class="sidebar-transition relative"
    :class="{ 
      'sidebar-collapsed': isCollapsed, 
      'w-1/5 min-w-[200px]': !isCollapsed,
      'w-[48px] min-w-[48px]': isCollapsed 
    }"
  >
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm h-full relative" :class="{ 'rounded-r-none': isCollapsed }">
      <!-- 折叠按钮 -->
      <div class="sidebar-toggle-wrapper absolute flex items-center" style="right: -12px; top: 70px; height: 100px; z-index: 30;">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </div>
      </div>
      
      <!-- 正常状态下显示的内容 -->
      <div class="normal-content p-4 h-full overflow-y-auto">
        <!-- 系统状态 -->
        <SystemStatusPanel v-if="visibleSections['systemStatus']?.visible" />
        
        <!-- 分隔线 -->
        <div class="border-t border-gray-700 dark:border-gray-600 my-4"></div>
        
        <!-- 仪表盘设置 -->
        <SidebarSettingsPanel 
          v-if="showDashboardSettings"
          :sidebarSections="sidebarSections"
          :currentTheme="currentTheme"
          @close="showDashboardSettings = false"
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
import { ref, inject, onMounted, computed } from 'vue';
import SystemStatusPanel from './SystemStatus/SystemStatusPanel.vue';
import BookInfoPanel from './BookInfo/BookInfoPanel.vue';
import ReadingHistoryPanel from './ReadingHistory/ReadingHistoryPanel.vue';
import NotesPanel from './Notes/NotesPanel.vue';
import LearningStatusPanel from './LearningStatus/LearningStatusPanel.vue';
import SidebarSettingsPanel from './SidebarSettingsPanel.vue';
import CollapsedSidebarIcons from './CollapsedSidebarIcons.vue';

// 侧边栏状态
const isSidebarCollapsed = inject('sidebarState');
const isCollapsed = ref(false);

// 同步侧边栏状态
const updateCollapsedState = () => {
  isCollapsed.value = isSidebarCollapsed.value;
};

// 仪表盘设置
const showDashboardSettings = ref(false);
const currentTheme = ref('默认');
const sidebarSections = ref({
  systemStatus: { label: '系统状态', visible: true, order: 1 },
  currentBook: { label: '当前书籍', visible: true, order: 2 },
  readingHistory: { label: '阅读历史', visible: true, order: 3 },
  notes: { label: '我的笔记', visible: true, order: 4 },
  learningState: { label: '学习状态', visible: true, order: 5 }
});

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
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  isCollapsed.value = isSidebarCollapsed.value;
  
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
  showDashboardSettings.value = false;
  // 这里可以添加保存设置到本地存储或发送到服务器的逻辑
}

// 上下移动部分
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

onMounted(() => {
  // 初始状态同步
  updateCollapsedState();
  
  // 监听侧边栏折叠/展开事件
  window.addEventListener('sidebar-toggle', updateCollapsedState);
});
</script>

<style scoped>
.sidebar-transition {
  transition: width 0.3s ease-in-out;
}

.sidebar-toggle-wrapper {
  transition: all 0.3s ease-in-out;
}

.sidebar-toggle {
  width: 24px;
  height: 24px;
  background-color: #1e3a8a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  background-color: #2563eb;
}

.normal-content {
  opacity: 1;
  transition: opacity 0.3s;
}

.sidebar-collapsed .normal-content {
  opacity: 0;
  pointer-events: none;
}

.sidebar-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.sidebar-collapsed .sidebar-icons {
  opacity: 1;
  pointer-events: auto;
}

.sidebar-icon {
  margin-bottom: 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 50%;
  transition: transform 0.2s, background-color 0.2s;
}

.sidebar-icon:hover {
  transform: scale(1.1);
  background-color: #3b82f6;
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动淡入淡出过渡 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
