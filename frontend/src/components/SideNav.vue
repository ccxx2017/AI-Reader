<template>
  <!-- 侧边导航菜单 -->
  <div 
    id="side-nav" 
    class="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-40 nav-menu"
    :class="{ 'open': isOpen }"
  >
    <div class="h-full flex flex-col overflow-y-auto">
      <!-- 顶部标题和关闭按钮 -->
      <div class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div class="text-lg font-semibold text-primary">菜单</div>
        <button 
          @click="closeMenu"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        >
          <i class="fas fa-times text-gray-600 dark:text-gray-300"></i>
        </button>
      </div>
      
      <!-- 导航链接 -->
      <div class="flex-grow p-4">
        <div class="space-y-2">
          <a href="#" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <i class="fas fa-home mr-3"></i> 首页
          </a>
          <a href="#" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <i class="fas fa-book mr-3"></i> 我的书架
          </a>
          <a href="#" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <i class="fas fa-history mr-3"></i> 阅读历史
          </a>
          <a href="#" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <i class="fas fa-bookmark mr-3"></i> 收藏笔记
          </a>
          <a href="#" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
            <i class="fas fa-cog mr-3"></i> 设置
          </a>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-sm text-gray-500 dark:text-gray-400">版本: 1.0.0</div>
      </div>
    </div>
  </div>
  
  <!-- 侧边菜单外部遮罩 -->
  <div 
    v-if="isOpen"
    @click="closeMenu"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
  ></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEventBus } from '../composables/useEventBus';

// 侧边菜单状态
const isOpen = ref(false);

// 事件总线
const eventBus = useEventBus();

// 关闭菜单
function closeMenu() {
  isOpen.value = false;
}

// 切换菜单状态
function toggleMenu() {
  isOpen.value = !isOpen.value;
}

onMounted(() => {
  // 监听切换侧边导航的事件
  eventBus.on('toggle-side-nav', toggleMenu);
});
</script>
