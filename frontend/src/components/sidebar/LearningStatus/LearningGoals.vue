<template>
  <div class="goals-container">
    <div class="goals-header">
      <div class="section-title">
        <i class="fas fa-bullseye bullseye-icon"></i>学习目标
      </div>
      <button class="settings-button">
        <i class="fas fa-cog settings-icon"></i>
        设置目标
      </button>
    </div>
    
    <div class="goals-list">
      <!-- 每日阅读时间 -->
      <div class="goal-item">
        <div class="goal-header">
          <div class="goal-name">每日阅读时间</div>
          <div class="goal-progress-text">
            {{ dailyReadingGoal.current }}/{{ dailyReadingGoal.target }}分钟
          </div>
        </div>
        <div class="progress-container">
          <div 
            class="progress-bar daily-progress"
            :style="{ width: `${(dailyReadingGoal.current / dailyReadingGoal.target) * 100}%` }"
          ></div>
        </div>
      </div>
      
      <!-- 每周阅读页数 -->
      <div class="goal-item">
        <div class="goal-header">
          <div class="goal-name">每周阅读页数</div>
          <div class="goal-progress-text">
            {{ weeklyPagesGoal.current }}/{{ weeklyPagesGoal.target }}页/周
          </div>
        </div>
        <div class="progress-container">
          <div 
            class="progress-bar weekly-progress"
            :style="{ width: `${(weeklyPagesGoal.current / weeklyPagesGoal.target) * 100}%` }"
          ></div>
        </div>
      </div>
      
      <!-- 按当前进度，将在12天内完成本书 -->
      <div class="goal-item">
        <div class="goal-header">
          <div class="goal-name">按当前进度，将在{{ completionPrediction.daysLeft }}天内完成本书</div>
          <div class="prediction-info">
            <div>提示: 每天增加{{ completionPrediction.dailyIncrement }}分钟</div>
            <div>可提前3天完成</div>
          </div>
        </div>
        <div class="progress-container">
          <div 
            class="progress-bar completion-progress"
            :style="{ width: `${completionPrediction.completion}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 最近成就 -->
    <div class="achievements-section">
      <div class="achievements-title">最近成就</div>
      <div class="achievements-list">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.title"
          class="achievement-badge tooltip-container"
        >
          <i :class="['fas', achievement.icon]" class="achievement-icon"></i>
          <!-- 成就提示 -->
          <div class="tooltip">
            <div class="tooltip-title">{{ achievement.title }}</div>
            <div class="tooltip-description">{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  dailyReadingGoal: {
    type: Object,
    default: () => ({
      target: 60,
      current: 0
    })
  },
  weeklyPagesGoal: {
    type: Object,
    default: () => ({
      target: 70,
      current: 0
    })
  },
  completionPrediction: {
    type: Object,
    default: () => ({
      daysLeft: 0,
      dailyIncrement: 0,
      completion: 0
    })
  },
  achievements: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.goals-container {
  background-color: rgba(31, 41, 55, 0.7); /* bg-gray-800/70 */
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.goals-header {
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

.bullseye-icon {
  color: #f87171; /* text-red-400 */
  margin-right: 0.375rem;
}

.settings-button {
  font-size: 0.75rem;
  color: #60a5fa; /* text-blue-400 */
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.settings-button:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.settings-icon {
  margin-right: 0.25rem;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.goal-item {
  margin-bottom: 0.5rem;
}

.goal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.goal-name {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.goal-progress-text {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.prediction-info {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  text-align: right;
}

.progress-container {
  width: 100%;
  height: 0.375rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 9999px;
}

.daily-progress {
  background-color: #3b82f6; /* bg-blue-500 */
}

.weekly-progress {
  background-color: #10b981; /* bg-green-500 */
}

.completion-progress {
  background-color: #f59e0b; /* bg-yellow-500 */
}

.achievements-section {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #374151; /* border-gray-700 */
}

.achievements-title {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.5rem;
}

.achievements-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.achievement-badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: rgba(55, 65, 81, 0.5); /* bg-gray-700/50 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.achievement-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.achievement-icon {
  color: #f59e0b; /* text-yellow-500 */
}

.tooltip-container {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(31, 41, 55, 0.95);
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  width: max-content;
  max-width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}

.tooltip-container:hover .tooltip {
  opacity: 1;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border-width: 6px;
  border-style: solid;
  border-color: rgba(31, 41, 55, 0.95) transparent transparent transparent;
}

.tooltip-title {
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
}

.tooltip-description {
  font-size: 0.625rem;
  color: #9ca3af; /* text-gray-400 */
}
</style>