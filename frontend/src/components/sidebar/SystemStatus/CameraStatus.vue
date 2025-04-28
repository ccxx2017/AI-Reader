<template>
  <!-- 摄像头状态 - 优化后的动态指示器 -->
  <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg">
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
        <i class="fas fa-camera mr-1.5"></i>
        摄像头
      </span>
      <div class="flex items-center">
        <span class="status-indicator pulse-animation bg-green-500 mr-1.5"></span>
        <span class="text-sm text-white px-2 py-0.5 rounded-full bg-green-700">监测中...</span>
      </div>
    </div>
    <div class="status-details text-xs flex justify-between px-1 text-gray-300">
      <div class="flex items-center">
        <i class="fas fa-lightbulb text-yellow-500 mr-1"></i>
        <span>光线: {{lightCondition}}</span>
      </div>
      <div class="flex items-center">
        <i class="fas fa-crosshairs text-blue-400 mr-1"></i>
        <span>对准: <i class="fas fa-check text-green-500"></i></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 光线状况
const lightCondition = ref('良好');

// 这里可以添加光线状况检测的逻辑，或者从父组件接收数据

</script>

<style scoped>
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
</style>