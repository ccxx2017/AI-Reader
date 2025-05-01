<template>
  <!-- 左侧侧边栏 -->
  <div 
    id="sidebar" 
    class="sidebar-transition"
    :class="{ 
      'sidebar-collapsed': isCollapsed
    }"
  >
    <div class="sidebar-content" :class="{ 'rounded-right-none': isCollapsed }">
      <!-- 折叠按钮 -->
      <div class="sidebar-toggle-wrapper">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </div>
      </div>
      
      <!-- 正常状态下显示的内容 -->
      <div class="normal-content">
        <!-- 系统状态 -->
        <SystemStatusPanel class="status-panel" />
        
        <!-- 分隔线 -->
        <div class="sidebar-divider"></div>
        
        <!-- 当前书籍信息 -->
        <BookInfoPanel class="panel-section" />
        
        <!-- 阅读历史 -->
        <ReadingHistoryPanel class="panel-section" />
        
        <!-- 我的笔记 -->
        <NotesPanel class="panel-section" />
        
        <!-- 个性化学习状态 -->
        <LearningStatusPanel class="panel-section" />
      </div>
      
      <!-- 折叠状态下显示的图标 -->
      <div v-if="isCollapsed" class="sidebar-icons">
        <div class="sidebar-icon camera-icon" title="拍照" @click="toggleSidebar">
          <i class="fas fa-camera"></i>
        </div>
        <div class="sidebar-icon book-icon" title="书籍" @click="toggleSidebar">
          <i class="fas fa-book"></i>
        </div>
        <div class="sidebar-icon history-icon" title="历史" @click="toggleSidebar">
          <i class="fas fa-history"></i>
        </div>
        <div class="sidebar-icon notes-icon" title="笔记" @click="toggleSidebar">
          <i class="fas fa-sticky-note"></i>
        </div>
        <div class="sidebar-icon learning-icon" title="学习状态" @click="toggleSidebar">
          <i class="fas fa-brain"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SystemStatusPanel from './SystemStatus/SystemStatusPanel.vue';
import BookInfoPanel from './BookInfo/BookInfoPanel.vue';
import ReadingHistoryPanel from './ReadingHistory/ReadingHistoryPanel.vue';
import NotesPanel from './Notes/NotesPanel.vue';
import LearningStatusPanel from './LearningStatus/LearningStatusPanel.vue';

// 侧边栏折叠状态
const isCollapsed = ref(false);

// 切换侧边栏折叠状态
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString());
  // 触发窗口调整事件，以便其他组件能够适应新的布局
  window.dispatchEvent(new Event('resize'));
}

// 组件挂载时，从本地存储中恢复折叠状态
onMounted(() => {
  const savedCollapsed = localStorage.getItem('sidebarCollapsed');
  if (savedCollapsed !== null) {
    isCollapsed.value = savedCollapsed === 'true';
  }
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
}

.rounded-right-none {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sidebar-toggle-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  right: -12px;
  top: 70px;
  height: 100px;
  z-index: 30;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-toggle {
  width: 24px;
  height: 24px;
  background-color: #f63bd1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: #eb25a2;
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

.panel-section {
  margin-bottom: 1.5rem;
}

.status-panel {
  margin-bottom: 1.5rem;
}

.sidebar-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

.sidebar-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0.5rem auto;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.camera-icon i {
  color: #f97316; /* orange-500 */
}

.book-icon i {
  color: #3b82f6; /* blue-500 */
}

.history-icon i {
  color: #22c55e; /* green-500 */
}

.notes-icon i {
  color: #eab308; /* yellow-500 */
}

.learning-icon i {
  color: #a855f7; /* purple-500 */
}

.sidebar-icon:hover {
  background-color: rgba(246, 59, 128, 0.769);
}

/* 深色模式 */
:global(.dark) .sidebar-content {
  background-color: #1e293b; /* dark-card */
}

:global(.dark) .sidebar-divider {
  border-top-color: #475569; /* border-gray-600 */
}

:global(.dark) .sidebar-icon:hover {
  background-color: rgba(59, 130, 246, 0.2);
}
</style>