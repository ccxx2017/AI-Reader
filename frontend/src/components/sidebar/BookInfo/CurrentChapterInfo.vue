<template>
  <div class="chapter-info">
    <div class="chapter-header">
      <div class="chapter-menu-container">
        <div class="chapter-selector" @click="toggleChapterMenu">
          <span class="chapter-label">本章: <span class="current-chapter">{{ currentChapter }}</span></span>
          <i class="fas fa-chevron-down dropdown-icon"></i>
        </div>
        
        <!-- 章节下拉菜单 -->
        <transition name="fade">
          <div v-if="showChapterMenu" class="chapter-menu">
            <div class="chapter-list">
              <div 
                v-for="(chapter, index) in chapters" 
                :key="index"
                class="chapter-item"
                :class="{ 'active': chapter === currentChapter }"
                @click="handleSelectChapter(chapter)"
              >
                {{ chapter }}
              </div>
            </div>
          </div>
        </transition>
      </div>
      
      <!-- 添加书签按钮 -->
      <button @click="addBookmark" class="bookmark-button">
        <i class="fas fa-bookmark bookmark-icon"></i>
        添加书签
      </button>
    </div>
    
    <!-- 章节长度信息 -->
    <div class="chapter-details">
      <span>本章: 第一章 量子计算概述</span>
      <span class="separator">|</span>
      <span>阅读时长: 90分钟</span>
      <span class="continue-reading">
        <i class="fas fa-bookmark continue-icon"></i>
        <span>继续阅读</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted } from 'vue';

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
.chapter-info {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #374151; /* border-gray-700 */
}

.chapter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.chapter-menu-container {
  position: relative;
}

.chapter-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.chapter-label {
  color: #d1d5db; /* text-gray-300 */
}

.current-chapter {
  color: #93c5fd; /* text-blue-300 */
}

.dropdown-icon {
  margin-left: 0.375rem;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.chapter-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
  width: 12rem;
  background-color: #1f2937; /* bg-gray-800 */
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  padding: 0.25rem 0;
  border: 1px solid #374151; /* border-gray-700 */
}

.chapter-list {
  max-height: 150px;
  overflow-y: auto;
}

.chapter-item {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
  cursor: pointer;
  transition: background-color 0.2s;
}

.chapter-item:hover {
  background-color: #374151; /* hover:bg-gray-700 */
}

.chapter-item.active {
  background-color: rgba(30, 58, 138, 0.3); /* bg-blue-900/30 */
  color: #93c5fd; /* text-blue-300 */
}

.bookmark-button {
  font-size: 0.75rem;
  color: #60a5fa; /* text-blue-400 */
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.bookmark-button:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.bookmark-icon {
  margin-right: 0.125rem;
}

.chapter-details {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.separator {
  margin: 0 0.375rem;
}

.continue-reading {
  float: right;
  color: #60a5fa; /* text-blue-400 */
  cursor: pointer;
  transition: color 0.2s;
}

.continue-reading:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.continue-icon {
  margin-right: 0.125rem;
}

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