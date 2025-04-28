<template>
  <!-- AI 处理状态 - 优化后的进度指示 -->
  <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg">
    <div class="flex items-center justify-between">
      <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
        <i class="fas fa-robot mr-1.5"></i>
        AI 处理
      </span>
      <div class="flex items-center">
        <span class="status-indicator" :class="{'bg-gray-500': !isProcessing, 'bg-blue-500 processing-animation': isProcessing}"></span>
        <span class="text-sm text-white px-2 py-0.5 rounded-full" 
          :class="isProcessing ? 'bg-blue-700 transition-colors duration-500' : 'bg-gray-600'">
          {{isProcessing ? '分析中...' : '待机'}}
        </span>
      </div>
    </div>
    <div v-if="isProcessing" class="mt-1.5">
      <div class="progress-bar bg-gray-700 h-1 w-full rounded">
        <div class="bg-blue-500 h-full rounded transition-all duration-500 ease-in-out" :style="{width: `${progress}%`}"></div>
      </div>
      <div class="text-xs text-blue-300 mt-1">{{processingText}}</div>
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
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.375rem;
}

.processing-animation {
  animation: processing 1.5s infinite;
}

@keyframes processing {
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