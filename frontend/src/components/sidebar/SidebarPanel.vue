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
        <SystemStatusPanel class="mb-6" />
        
        <!-- 分隔线 -->
        <div class="border-t border-gray-700 dark:border-gray-600 my-4"></div>
        
        <!-- 当前书籍信息 -->
        <BookInfoPanel class="mb-6" />
        
        <!-- 阅读历史 -->
        <ReadingHistoryPanel class="mb-6" />
        
        <!-- 我的笔记 -->
        <NotesPanel class="mb-6" />
        
        <!-- 个性化学习状态 -->
        <LearningStatusPanel class="mb-6" />
      </div>
      
      <!-- 折叠状态下显示的图标 -->
      <div v-if="isCollapsed" class="sidebar-icons">
        <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer mt-3 mb-2 mx-auto" title="拍照" @click="toggleSidebar">
          <i class="fas fa-camera text-orange-500"></i>
        </div>
        <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer my-2 mx-auto" title="书籍" @click="toggleSidebar">
          <i class="fas fa-book text-blue-500"></i>
        </div>
        <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer my-2 mx-auto" title="历史" @click="toggleSidebar">
          <i class="fas fa-history text-green-500"></i>
        </div>
        <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer my-2 mx-auto" title="笔记" @click="toggleSidebar">
          <i class="fas fa-sticky-note text-yellow-500"></i>
        </div>
        <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer my-2 mx-auto" title="学习状态" @click="toggleSidebar">
          <i class="fas fa-brain text-purple-500"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
  transition: width 0.3s ease-in-out;
}

.sidebar-toggle-wrapper {
  transition: opacity 0.3s ease-in-out;
}

.sidebar-toggle {
  width: 24px;
  height: 24px;
  background-color: #3b82f6;
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
  background-color: #2563eb;
}

.sidebar-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

.sidebar-icon {
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.sidebar-icon:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.dark .sidebar-icon:hover {
  background-color: rgba(59, 130, 246, 0.2);
}
</style>