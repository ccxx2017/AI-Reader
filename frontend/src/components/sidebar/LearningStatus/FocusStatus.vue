<template>
  <div class="focus-container">
    <div class="focus-header">
      <div class="focus-title">
        <i class="fas fa-brain brain-icon"></i>
        阅读专注度
      </div>
      <div class="focus-score">
        <span class="score-value">{{ focusScore }}%</span>
        <i class="fas trend-icon" 
          :class="trend === 'up' ? 'trend-up' : 'trend-down'"></i>
      </div>
    </div>
    
    <!-- 专注度进度条 -->
    <div class="progress-bar-container">
      <div 
        class="progress-bar-fill"
        :class="getFocusBarClass(focusScore)"
        :style="{ width: `${focusScore}%` }"
      ></div>
    </div>
    
    <!-- 连续专注时间 -->
    <div class="focus-stats">
      <div class="continuous-focus">
        <span>{{ continuousFocusTime }}分钟</span>
        <span class="focus-label">连续专注</span>
      </div>
      <div class="max-focus">
        <span>最佳记录:</span>
        <span class="record-value">{{ maxFocusRecord }}分钟</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  focusScore: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    default: 'up'
  },
  continuousFocusTime: {
    type: Number,
    default: 0
  },
  maxFocusRecord: {
    type: Number,
    default: 0
  }
});

// 根据专注度获取进度条样式
function getFocusBarClass(score) {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-average';
  if (score >= 20) return 'score-poor';
  return 'score-bad';
}
</script>

<style scoped>
.focus-container {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background-color: rgba(31, 41, 55, 0.7); /* bg-gray-800/70 */
  border-radius: 0.5rem;
}

.focus-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.focus-title {
  font-size: 0.875rem;
  color: #93c5fd; /* text-blue-300 */
  font-weight: 500;
  display: flex;
  align-items: center;
}

.brain-icon {
  color: #c084fc; /* text-purple-400 */
  margin-right: 0.375rem;
}

.focus-score {
  display: flex;
  align-items: center;
}

.score-value {
  font-size: 0.875rem;
  color: #d1d5db; /* text-gray-300 */
  font-weight: 500;
}

.trend-icon {
  margin-left: 0.375rem;
  font-size: 0.75rem;
}

.trend-up {
  color: #4ade80; /* text-green-400 */
}

.trend-down {
  color: #f87171; /* text-red-400 */
}

.progress-bar-container {
  width: 100%;
  height: 1rem;
  background-color: rgba(55, 65, 81, 0.5); /* bg-gray-700/50 */
  border-radius: 9999px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: all 0.5s ease-out;
}

.score-excellent {
  background-image: linear-gradient(to right, #10b981, #34d399); /* from-green-500 to-green-400 */
}

.score-good {
  background-image: linear-gradient(to right, #3b82f6, #34d399); /* from-blue-500 to-green-400 */
}

.score-average {
  background-image: linear-gradient(to right, #f59e0b, #60a5fa); /* from-yellow-500 to-blue-400 */
}

.score-poor {
  background-image: linear-gradient(to right, #ef4444, #fbbf24); /* from-red-500 to-yellow-400 */
}

.score-bad {
  background-image: linear-gradient(to right, #dc2626, #ef4444); /* from-red-600 to-red-400 */
}

.focus-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.continuous-focus {
  display: flex;
  align-items: center;
}

.focus-label {
  color: #6b7280; /* text-gray-500 */
  margin: 0 0.25rem;
}

.max-focus {
  display: flex;
  align-items: center;
}

.record-value {
  color: #4ade80; /* text-green-400 */
  margin-left: 0.25rem;
}
</style>