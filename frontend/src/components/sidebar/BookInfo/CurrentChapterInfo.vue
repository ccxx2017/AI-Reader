<template>
  <div class="mt-3 pt-3 border-t border-gray-700">
    <div class="flex items-center justify-between text-sm mb-1">
      <div class="relative">
        <div class="flex items-center cursor-pointer" @click="toggleChapterMenu">
          <span class="text-gray-300">本章: <span class="text-blue-300">{{ currentChapter }}</span></span>
          <i class="fas fa-chevron-down ml-1.5 text-xs text-gray-400"></i>
        </div>
        
        <!-- 章节下拉菜单 -->
        <transition name="fade">
          <div v-if="showChapterMenu" class="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-700">
            <div class="max-h-[150px] overflow-y-auto">
              <div 
                v-for="(chapter, index) in chapters" 
                :key="index"
                class="px-3 py-1.5 hover:bg-gray-700 cursor-pointer text-xs text-gray-300 transition-colors"
                :class="{ 'bg-blue-900/30 text-blue-300': chapter === currentChapter }"
                @click="handleSelectChapter(chapter)"
              >
                {{ chapter }}
              </div>
            </div>
          </div>
        </transition>
      </div>
      
      <!-- 添加书签按钮 -->
      <button @click="addBookmark" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
        <i class="fas fa-bookmark mr-0.5"></i>
        添加书签
      </button>
    </div>
    
    <!-- 章节长度信息 -->
    <div class="text-xs text-gray-400">
      <span>本章: 第一章 量子计算概述</span>
      <span class="mx-1.5">|</span>
      <span>阅读时长: 90分钟</span>
      <span class="float-right text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
        <i class="fas fa-bookmark mr-0.5"></i>
        <span>继续阅读</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// 定义组件属性
const props = defineProps({
  currentChapter: {
    type: String,
    default: ''
  },
  chapters: {
    type: Array,
    default: () => []
  }
});

// 定义事件
const emit = defineEmits(['selectChapter']);

// 章节菜单显示状态
const showChapterMenu = ref(false);

// 切换章节菜单显示/隐藏
function toggleChapterMenu() {
  showChapterMenu.value = !showChapterMenu.value;
}

// 选择章节
function handleSelectChapter(chapter) {
  emit('selectChapter', chapter);
  showChapterMenu.value = false;
}

// 添加书签
function addBookmark() {
  console.log('添加书签');
  // 这里可以实现添加书签的逻辑
}

// 点击页面其他位置关闭菜单
function closeMenuOnOutsideClick(event) {
  if (showChapterMenu.value) {
    const isClickOutside = !event.target.closest('.chapter-menu-container');
    if (isClickOutside) {
      showChapterMenu.value = false;
    }
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>