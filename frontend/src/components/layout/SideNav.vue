<template>
  <!-- 侧边导航菜单 -->
  <div 
    id="side-nav" 
    class="nav-menu"
    :class="{ 'open': isOpen }"
  >
    <div class="menu-container">
      <!-- 顶部标题和关闭按钮 -->
      <div class="menu-header">
        <div class="menu-title">菜单</div>
        <button 
          @click="closeMenu"
          class="close-button"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- 导航链接 -->
      <div class="menu-content">
        <div class="nav-list">
          <a href="#" class="nav-link">
            <i class="fas fa-home nav-icon"></i> 首页
          </a>
          <a href="#" class="nav-link">
            <i class="fas fa-book nav-icon"></i> 我的书架
          </a>
          <a href="#" class="nav-link">
            <i class="fas fa-history nav-icon"></i> 阅读历史
          </a>
          <a href="#" class="nav-link">
            <i class="fas fa-bookmark nav-icon"></i> 收藏笔记
          </a>
          <a href="#" class="nav-link">
            <i class="fas fa-cog nav-icon"></i> 设置
          </a>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="menu-footer">
        <div class="version-info">版本: 1.0.0</div>
      </div>
    </div>
  </div>
  
  <!-- 侧边菜单外部遮罩 -->
  <div 
    v-if="isOpen"
    @click="closeMenu"
    class="nav-overlay"
  ></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '../../store/modules/ui';

// 使用UI状态管理
const uiStore = useUIStore();

// 侧边菜单状态
const isOpen = ref(false);

// 关闭菜单
function closeMenu() {
  isOpen.value = false;
}

// 监听侧边导航菜单状态变化
watch(() => uiStore.isSideNavOpen, (open) => {
  // 当侧边导航菜单状态切换时，更新侧边导航状态
  isOpen.value = open;
});

// 在组件挂载时初始化状态
onMounted(() => {
  isOpen.value = uiStore.isSideNavOpen;
  
  // 监听toggle-side-nav事件
  window.addEventListener('toggle-side-nav', (event) => {
    isOpen.value = event.detail?.isOpen ?? !isOpen.value;
  });
});
</script>

<style scoped>
.nav-menu {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 16rem; /* w-64 */
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  z-index: 40;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.nav-menu:not(.open) {
  transform: translateX(-100%);
}

.nav-menu.open {
  transform: translateX(0);
}

.menu-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.menu-header {
  padding: 1rem; /* p-4 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
}

.menu-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  color: var(--color-primary, #3b82f6); /* text-primary */
}

.close-button {
  padding: 0.5rem; /* p-2 */
  border-radius: 0.375rem; /* rounded-md */
  background: none;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  background-color: #f3f4f6; /* hover:bg-gray-100 */
}

.close-button i {
  color: #4b5563; /* text-gray-600 */
}

.menu-content {
  flex-grow: 1;
  padding: 1rem; /* p-4 */
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

.nav-link {
  display: block;
  padding: 0.5rem 1rem; /* px-4 py-2 */
  border-radius: 0.375rem; /* rounded-md */
  color: #374151; /* text-gray-700 */
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f3f4f6; /* hover:bg-gray-100 */
}

.nav-icon {
  margin-right: 0.75rem; /* mr-3 */
}

.menu-footer {
  padding: 1rem; /* p-4 */
  border-top: 1px solid #e5e7eb; /* border-gray-200 */
}

.version-info {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* text-gray-500 */
}

.nav-overlay {
  position: fixed;
  inset: 0; /* inset-0 */
  background-color: rgba(0, 0, 0, 0.3); /* bg-black bg-opacity-30 */
  z-index: 30;
}

/* 适配深色模式 */
:root.dark .nav-menu {
  background-color: #1f2937; /* dark:bg-gray-900 */
  border-right-color: #374151; /* dark:border-gray-700 */
}

:root.dark .menu-header {
  border-bottom-color: #374151; /* dark:border-gray-700 */
}

:root.dark .menu-footer {
  border-top-color: #374151; /* dark:border-gray-700 */
}

:root.dark .menu-title {
  color: var(--color-primary, #3b82f6); /* text-primary */
}

:root.dark .close-button i {
  color: #d1d5db; /* dark:text-gray-300 */
}

:root.dark .close-button:hover {
  background-color: #1f2937; /* dark:hover:bg-gray-800 */
}

:root.dark .nav-link {
  color: #d1d5db; /* dark:text-gray-300 */
}

:root.dark .nav-link:hover {
  background-color: #374151; /* dark:hover:bg-gray-800 */
}

:root.dark .version-info {
  color: #9ca3af; /* dark:text-gray-400 */
}
</style>
