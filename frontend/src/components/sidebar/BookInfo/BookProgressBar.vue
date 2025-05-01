<template>
  <div class="progress-container">
    <div class="progress-bar">
      <!-- 进度条 -->
      <div 
        class="progress-fill"
        :style="{ width: `${progress}%` }"
      ></div>
      
      <!-- 进度指示点 -->
      <div
        class="progress-handle"
        :style="{ left: `${progress}%` }"
        @mousedown="startDrag"
      ></div>
      
      <!-- 上次阅读位置标记 -->
      <div 
        class="last-read-mark"
        :style="{ left: `${lastReadPosition}%` }"
        title="上次阅读位置"
      ></div>
    </div>
    
    <!-- 书签标记 -->
    <div class="bookmarks-container">
      <div 
        v-for="bookmark in bookmarks" 
        :key="bookmark.position"
        class="bookmark-indicator"
        :style="{ marginLeft: `${bookmark.position}%` }"
        :title="bookmark.title"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onUnmounted } from 'vue';

// 定义组件属性
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
});

// 上次阅读位置
const lastReadPosition = ref(18);

// 书签列表
const bookmarks = ref([
  { position: 8, title: '量子比特介绍' },
  { position: 22, title: '量子叠加原理' },
  { position: 45, title: '量子纠缠概念' }
]);

// 拖动进度条的逻辑
let isDragging = false;

function startDrag(event) {
  isDragging = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(event) {
  if (!isDragging) return;
  
  // 这里可以添加拖动进度条的逻辑
  // 例如计算新的进度位置，并触发相应的事件
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.progress-container {
  margin-bottom: 0.5rem;
}

.progress-bar {
  position: relative;
  height: 0.5rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #3b82f6; /* bg-blue-500 */
}

.progress-handle {
  position: absolute;
  top: 0;
  height: 0.5rem;
  width: 0.5rem;
  background-color: white;
  border-radius: 9999px;
  transform: translateX(-50%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: left 0.1s ease;
}

.progress-handle:hover {
  transform: scale(1.5) translateX(-33%);
}

.last-read-mark {
  position: absolute;
  top: 0;
  height: 100%;
  width: 0.125rem;
  background-color: #4ade80; /* bg-green-400 */
}

.bookmarks-container {
  display: flex;
  margin-top: 0.25rem;
  gap: 0.25rem;
}

.bookmark-indicator {
  width: 0.25rem;
  height: 0.75rem;
  background-color: #eab308; /* bg-yellow-500 */
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 1px;
}

.bookmark-indicator:hover {
  background-color: #facc15; /* hover:bg-yellow-400 */
}
</style>