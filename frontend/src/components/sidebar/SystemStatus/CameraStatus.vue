<template>
  <!-- 摄像头状态 - 优化后的动态指示器 -->
  <div class="status-container">
    <div class="status-header">
      <span class="status-title">
        <i class="fas fa-camera camera-icon"></i>
        摄像头
      </span>
      <div class="status-indicator-wrapper">
        <span class="status-indicator pulse-animation"></span>
        <span class="status-label">监测中...</span>
      </div>
    </div>
    <div class="status-details">
      <div class="detail-item">
        <i class="fas fa-lightbulb light-icon"></i>
        <span>光线: {{lightCondition}}</span>
      </div>
      <div class="detail-item">
        <i class="fas fa-crosshairs alignment-icon"></i>
        <span>对准: <i class="fas fa-check check-icon"></i></span>
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
.status-container {
  background-color: rgba(31, 41, 55, 0.5); /* bg-gray-800/50 */
  padding: 0.625rem;
  border-radius: 0.5rem;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.status-title {
  font-size: 0.875rem;
  color: #f97316; /* text-orange-500 */
  font-weight: 500;
  display: flex;
  align-items: center;
}

.camera-icon {
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
  background-color: #22c55e; /* bg-green-500 */
  margin-right: 0.375rem;
}

.status-label {
  font-size: 0.875rem;
  color: white;
  padding: 0 0.5rem;
  line-height: 1.5;
  border-radius: 9999px;
  background-color: #15803d; /* bg-green-700 */
}

.status-details {
  font-size: 0.75rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.25rem;
  color: #d1d5db; /* text-gray-300 */
}

.detail-item {
  display: flex;
  align-items: center;
}

.light-icon {
  color: #eab308; /* text-yellow-500 */
  margin-right: 0.25rem;
}

.alignment-icon {
  color: #60a5fa; /* text-blue-400 */
  margin-right: 0.25rem;
}

.check-icon {
  color: #22c55e; /* text-green-500 */
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
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
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