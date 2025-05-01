<template>
  <div class="book-basic-info">
    <h3 class="book-title">{{ title }}</h3>
    <div class="book-author">
      <span>作者: {{ author }}</span>
    </div>
    <div class="progress-info">
      <span>阅读进度: {{ progress }}%</span>
      <span>第25/102页</span>
    </div>
    <div class="reading-time">
      <span>今日: <span class="time-highlight">30分钟</span></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.book-basic-info {
  margin-bottom: 0.5rem;
}

.book-title {
  font-size: 1rem;
  font-weight: 500;
  color: #60a5fa; /* text-blue-400 */
  margin-bottom: 0.25rem;
}

.book-author {
  font-size: 0.875rem;
  color: #d1d5db; /* text-gray-300 */
  margin-bottom: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.5rem;
}

.reading-time {
  font-size: 0.75rem;
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 0.375rem;
}

.time-highlight {
  color: #4ade80; /* text-green-400 */
}
</style>