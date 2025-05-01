<template>
  <!-- AI 处理状态 - 优化后的进度指示 -->
  <div class="status-container">
    <div class="status-header">
      <span class="status-title">
        <i class="fas fa-robot robot-icon"></i>
        AI 处理
      </span>
      <div class="status-indicator-wrapper">
        <span class="status-indicator" :class="{'idle': !isProcessing, 'active': isProcessing}"></span>
        <span class="status-label" :class="{'processing': isProcessing, 'standby': !isProcessing}">
          {{isProcessing ? '分析中...' : '待机'}}
        </span>
      </div>
    </div>
    <div v-if="isProcessing" class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{width: `${progress}%`}"></div>
      </div>
      <div class="processing-text">{{processingText}}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 定义组件接收的属性
const props = defineProps({
  isProcessing: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  processingText: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.status-container {
  background-color: rgba(31, 41, 55, 0.5); /* bg-gray-800/50 */
  padding: 0.625rem;
  border-radius: 0.5rem;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-title {
  font-size: 0.875rem;
  color: #f97316; /* text-orange-500 */
  font-weight: 500;
  display: flex;
  align-items: center;
}

.robot-icon {
  margin-right: 0.375rem;
}

.status-indicator-wrapper {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.375rem;
}

.status-indicator.idle {
  background-color: #6b7280; /* bg-gray-500 */
}

.status-indicator.active {
  background-color: #3b82f6; /* bg-blue-500 */
  animation: pulse-blue 1.5s infinite;
}

.status-label {
  font-size: 0.875rem;
  color: white;
  padding: 0 0.5rem;
  line-height: 1.5;
  border-radius: 9999px;
}

.status-label.standby {
  background-color: #4b5563; /* bg-gray-600 */
}

.status-label.processing {
  background-color: #1d4ed8; /* bg-blue-700 */
  transition: background-color 0.5s;
}

.progress-container {
  margin-top: 0.375rem;
}

.progress-bar {
  background-color: #374151; /* bg-gray-700 */
  height: 0.25rem;
  width: 100%;
  border-radius: 0.25rem;
}

.progress-fill {
  background-color: #3b82f6; /* bg-blue-500 */
  height: 100%;
  border-radius: 0.25rem;
  transition: width 0.5s ease-in-out;
}

.processing-text {
  font-size: 0.75rem;
  color: #93c5fd; /* text-blue-300 */
  margin-top: 0.25rem;
}

@keyframes pulse-blue {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 5px rgba(59, 130, 246, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* 深色模式 */
:global(.dark) .status-container {
  background-color: rgba(55, 65, 81, 0.5); /* dark:bg-gray-700/50 */
}

:global(.dark) .status-title {
  color: #fb923c; /* dark:text-orange-400 */
}
</style>