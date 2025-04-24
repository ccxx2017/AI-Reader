<template>
  <!-- 页面检测状态 - 优化后的进度指示 -->
  <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg">
    <div class="flex items-center justify-between">
      <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
        <i class="fas fa-file-alt mr-1.5"></i>
        页面检测
      </span>
      <div class="flex items-center">
        <span class="status-indicator" :class="statusColor"></span>
        <span class="text-sm text-white px-2 py-0.5 rounded-full" :class="statusBgColor">
          {{ statusText }}
        </span>
      </div>
    </div>
    <div class="progress-bar mt-1.5 bg-gray-700 h-1 w-full rounded">
      <div class="h-full rounded transition-all duration-300" 
           :class="progressColor"
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
const statusColor = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return 'bg-yellow-500';
    case 'detecting':
      return 'bg-blue-500 pulse-animation';
    case 'complete':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
});

// 状态背景色
const statusBgColor = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return 'bg-yellow-600';
    case 'detecting':
      return 'bg-blue-600';
    case 'complete':
      return 'bg-green-600';
    case 'error':
      return 'bg-red-600';
    default:
      return 'bg-gray-600';
  }
});

// 进度条颜色
const progressColor = computed(() => {
  switch (detectionStatus.value) {
    case 'preparing':
      return 'bg-yellow-500';
    case 'detecting':
      return 'bg-blue-500';
    case 'complete':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
});

// 可以在这里添加更新状态的方法，或者从父组件接收状态更新
</script>

<style scoped>
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.375rem;
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
</style>