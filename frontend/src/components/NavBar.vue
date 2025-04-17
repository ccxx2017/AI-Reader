<template>
  <!-- 顶部导航栏 -->
  <nav class="nav-bar bg-light-card dark:bg-gray-900 shadow-sm py-2 px-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button 
          id="menu-toggle" 
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          @click="toggleSideNav"
        >
          <i class="fas fa-bars text-gray-600 dark:text-gray-300"></i>
        </button>
        <div class="text-xl font-bold text-primary">AI 阅读助手</div>
      </div>
      
      <div class="flex items-center space-x-3">
        <div class="theme-toggle-container">
          <button 
            id="theme-toggle" 
            class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            @click="toggleThemeDropdown"
          >
            <i class="fas fa-moon text-gray-600 dark:hidden"></i>
            <i class="fas fa-sun text-gray-300 hidden dark:block"></i>
          </button>
          <div id="theme-dropdown" class="theme-dropdown" :class="{ 'show': isThemeDropdownVisible }">
            <div class="theme-option theme-light" data-theme="light" @click="changeTheme('light')">
              <div class="theme-color-indicator"></div>
              <span>浅色模式</span>
            </div>
            <div class="theme-option theme-dark" data-theme="dark" @click="changeTheme('dark')">
              <div class="theme-color-indicator"></div>
              <span>深色模式</span>
            </div>
          </div>
        </div>
        <button 
          id="notification-button" 
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        >
          <div class="relative">
            <i class="fas fa-bell text-gray-600 dark:text-gray-300"></i>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">2</div>
          </div>
        </button>
        <div id="user-menu-button" class="user-avatar w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span>张</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import { useEventBus } from '../composables/useEventBus';

// 注入主题相关函数
const { setTheme } = inject('theme');

// 主题下拉菜单状态
const isThemeDropdownVisible = ref(false);

// 事件总线
const eventBus = useEventBus();

// 侧边导航栏状态
function toggleSideNav() {
  eventBus.emit('toggle-side-nav');
}

// 切换主题下拉菜单
function toggleThemeDropdown(e) {
  e.stopPropagation(); // 防止事件冒泡导致立即关闭菜单
  isThemeDropdownVisible.value = !isThemeDropdownVisible.value;
}

// 更改主题
function changeTheme(theme) {
  setTheme(theme);
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
