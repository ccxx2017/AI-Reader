<template>
  <div class="mb-2">
    <div class="relative h-2 bg-gray-700 rounded-full overflow-hidden">
      <!-- 进度条 -->
      <div 
        class="absolute top-0 left-0 h-full bg-blue-500"
        :style="{ width: `${progress}%` }"
      ></div>
      
      <!-- 进度指示点 -->
      <div
        class="progress-handle absolute top-0 h-2 w-2 bg-white rounded-full transform -translate-x-1/2 shadow-sm cursor-pointer"
        :style="{ left: `${progress}%` }"
        @mousedown="startDrag"
      ></div>
      
      <!-- 上次阅读位置标记 -->
      <div 
        class="last-read-mark absolute top-0 h-full w-0.5 bg-green-400"
        :style="{ left: `${lastReadPosition}%` }"
        title="上次阅读位置"
      ></div>
    </div>
    
    <!-- 书签标记 -->
    <div class="flex mt-1 space-x-1">
      <div 
        v-for="bookmark in bookmarks" 
        :key="bookmark.position"
        class="bookmark-indicator w-1 h-3 bg-yellow-500 cursor-pointer hover:bg-yellow-400 transition-colors"
        :style="{ marginLeft: `${bookmark.position}%` }"
        :title="bookmark.title"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

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
.progress-handle {
  transition: left 0.1s ease;
}

.progress-handle:hover {
  transform: scale(1.5) translateX(-33%);
}

.bookmark-indicator {
  border-radius: 1px;
}
</style>