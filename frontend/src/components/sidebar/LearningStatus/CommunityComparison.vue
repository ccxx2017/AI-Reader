<template>
  <div class="comparison-container">
    <div class="comparison-header">
      <div class="section-title">
        <i class="fas fa-users users-icon"></i>
        社区进度对比
      </div>
      <div class="position-text">
        {{ comparisonData.position }}
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="progress-container">
      <!-- 社区平均值标记 -->
      <div class="average-marker"></div>
      
      <!-- 用户进度 -->
      <div 
        class="progress-bar"
        :style="{ width: `${comparisonData.percentile}%` }"
      ></div>
    </div>
    
    <div class="progress-labels">
      <span>落后</span>
      <span>社区平均</span>
      <span>领先</span>
    </div>
    
    <div class="progress-info">
      <i class="fas fa-info-circle info-icon"></i>
      <span>你的阅读进度超过了{{ comparisonData.percentile }}%的用户</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  comparisonData: {
    type: Object,
    default: () => ({
      percentile: 50,
      position: '平均水平'
    })
  }
});
</script>

<style scoped>
.comparison-container {
  margin-top: 0.75rem;
  background-color: rgba(31, 41, 55, 0.6); /* bg-gray-800/60 */
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.comparison-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 0.875rem;
  color: #93c5fd; /* text-blue-300 */
  font-weight: 500;
  display: flex;
  align-items: center;
}

.users-icon {
  color: #60a5fa; /* text-blue-400 */
  margin-right: 0.375rem;
}

.position-text {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.progress-container {
  position: relative;
  width: 100%;
  height: 0.5rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 9999px;
  margin-bottom: 0.375rem;
  overflow: hidden;
}

.average-marker {
  position: absolute;
  top: 0;
  height: 100%;
  width: 0.125rem;
  background-color: #9ca3af; /* bg-gray-400 */
  left: 50%;
}

.progress-bar {
  height: 100%;
  background-color: #3b82f6; /* bg-blue-500 */
  border-radius: 9999px;
  transition: all 0.5s ease-out;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.info-icon {
  color: #60a5fa; /* text-blue-400 */
  margin-right: 0.25rem;
}
</style>