<template>
  <!-- 顶部导航栏 -->
  <nav class="nav-bar">
    <div class="nav-container">
      <div class="left-section">
        <button 
          id="menu-toggle" 
          class="nav-icon-button"
          @click="uiStore.toggleSideNav"
        >
          <i class="fas fa-bars"></i>
        </button>
        <div class="app-title">AI 阅读助手</div>
      </div>
      
      <div class="right-section">
        <div class="theme-toggle-container">
          <button 
            id="theme-toggle" 
            class="nav-icon-button"
            @click="toggleThemeDropdown"
          >
            <i class="fas fa-moon" v-if="!uiStore.isDarkMode"></i>
            <i class="fas fa-sun" v-else></i>
          </button>
          <div id="theme-dropdown" class="theme-dropdown" :class="{ 'show': isThemeDropdownVisible }">
            <div class="theme-option theme-light" data-theme="light" @click="changeTheme('默认')">
              <div class="theme-color-indicator"></div>
              <span>浅色模式</span>
            </div>
            <div class="theme-option theme-dark" data-theme="dark" @click="changeTheme('深色')">
              <div class="theme-color-indicator"></div>
              <span>深色模式</span>
            </div>
          </div>
        </div>
        <button 
          id="notification-button" 
          class="nav-icon-button"
        >
          <div class="notification-badge-container">
            <i class="fas fa-bell"></i>
            <div class="notification-badge">2</div>
          </div>
        </button>
        <div id="user-menu-button" class="user-avatar">
          <span>张</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUIStore } from '../../store/modules/ui';

// 使用UI状态管理
const uiStore = useUIStore();

// 主题下拉菜单状态
const isThemeDropdownVisible = ref(false);

// 切换主题下拉菜单
function toggleThemeDropdown(e) {
  e.stopPropagation(); // 防止事件冒泡导致立即关闭菜单
  isThemeDropdownVisible.value = !isThemeDropdownVisible.value;
}

// 更改主题
function changeTheme(theme) {
  uiStore.setTheme(theme);
  isThemeDropdownVisible.value = false;
}

// 点击其他地方关闭主题菜单
function handleClickOutside(e) {
  const dropdown = document.getElementById('theme-dropdown');
  const toggle = document.getElementById('theme-toggle');
  
  if (isThemeDropdownVisible.value && dropdown && toggle && 
      !toggle.contains(e.target) && !dropdown.contains(e.target)) {
    isThemeDropdownVisible.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.nav-bar {
  height: 60px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #f8fafc;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0.5rem 1rem;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-icon-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.nav-icon-button:hover {
  background-color: #f3f4f6;
}

.nav-icon-button:focus {
  outline: none;
}

.nav-icon-button i {
  color: #4b5563;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3498db;
}

.theme-toggle-container {
  position: relative;
}

.theme-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  width: 160px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 0.5rem;
  z-index: 50;
  display: none;
}

.theme-dropdown.show {
  display: block;
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-option:hover {
  background-color: #f1f5f9;
}

.theme-color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.theme-light .theme-color-indicator {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.theme-dark .theme-color-indicator {
  background-color: #1e293b;
  border: 1px solid #475569;
}

.notification-badge-container {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1rem;
  height: 1rem;
  background-color: #ef4444;
  border-radius: 9999px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

/* 深色模式适配 */
:global(.dark) .nav-bar {
  background-color: #1f2937;
}

:global(.dark) .nav-icon-button:hover {
  background-color: #374151;
}

:global(.dark) .nav-icon-button i {
  color: #d1d5db;
}

:global(.dark) .theme-dropdown {
  background-color: #1f2937;
  border-color: #374151;
}

:global(.dark) .theme-option {
  color: #f1f5f9;
}

:global(.dark) .theme-option:hover {
  background-color: #374151;
}
</style>
