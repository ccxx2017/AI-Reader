<template>
  <!-- 页面检测状态 - 优化后的进度指示 -->
  <div class="status-container">
    <div class="status-header">
      <span class="status-title">
        <i class="fas fa-file-alt file-icon"></i>
        页面检测
      </span>
      <div class="status-indicator-wrapper">
        <span class="status-indicator" :class="statusColorClass"></span>
        <span class="status-label" :class="statusBgColorClass">
          {{ statusText }}
        </span>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" 
           :class="progressColorClass"
           :style="{width: `${detectionProgress}%`}"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 页面检测状态
const detectionStatus = ref('preparing'); // 可能的值: 'preparing', 'detecting', 'complete', 'error'
const detectionProgress = ref(30);

// 状态文本
const statusText = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return '准备中';
    case 'detecting':
      return '检测中';
    case 'complete':
      return '完成';
    case 'error':
      return '错误';
    default:
      return '未知';
  }
});

// 状态颜色
const statusColorClass = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return 'preparing';
    case 'detecting':
      return 'detecting';
    case 'complete':
      return 'complete';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
});

// 状态背景色
const statusBgColorClass = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return 'preparing-bg';
    case 'detecting':
      return 'detecting-bg';
    case 'complete':
      return 'complete-bg';
    case 'error':
      return 'error-bg';
    default:
      return 'default-bg';
  }
});

// 进度条颜色
const progressColorClass = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return 'preparing-progress';
    case 'detecting':
      return 'detecting-progress';
    case 'complete':
      return 'complete-progress';
    case 'error':
      return 'error-progress';
    default:
      return 'default-progress';
  }
});

// 可以在这里添加更新状态的方法，或者从父组件接收状态更新
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

.file-icon {
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

.status-indicator.preparing {
  background-color: #eab308; /* bg-yellow-500 */
}

.status-indicator.detecting {
  background-color: #3b82f6; /* bg-blue-500 */
  animation: pulse 1.5s infinite;
}

.status-indicator.complete {
  background-color: #22c55e; /* bg-green-500 */
}

.status-indicator.error {
  background-color: #ef4444; /* bg-red-500 */
}

.status-indicator.default {
  background-color: #6b7280; /* bg-gray-500 */
}

.status-label {
  font-size: 0.875rem;
  color: white;
  padding: 0 0.5rem;
  line-height: 1.5;
  border-radius: 9999px;
}

.status-label.preparing-bg {
  background-color: #ca8a04; /* bg-yellow-600 */
}

.status-label.detecting-bg {
  background-color: #2563eb; /* bg-blue-600 */
}

.status-label.complete-bg {
  background-color: #16a34a; /* bg-green-600 */
}

.status-label.error-bg {
  background-color: #dc2626; /* bg-red-600 */
}

.status-label.default-bg {
  background-color: #4b5563; /* bg-gray-600 */
}

.progress-bar {
  margin-top: 0.375rem;
  background-color: #374151; /* bg-gray-700 */
  height: 0.25rem;
  width: 100%;
  border-radius: 0.25rem;
}

.progress-fill {
  height: 100%;
  border-radius: 0.25rem;
  transition: width 0.3s ease-in-out;
}

.progress-fill.preparing-progress {
  background-color: #eab308; /* bg-yellow-500 */
}

.progress-fill.detecting-progress {
  background-color: #3b82f6; /* bg-blue-500 */
}

.progress-fill.complete-progress {
  background-color: #22c55e; /* bg-green-500 */
}

.progress-fill.error-progress {
  background-color: #ef4444; /* bg-red-500 */
}

.progress-fill.default-progress {
  background-color: #6b7280; /* bg-gray-500 */
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
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