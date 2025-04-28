<template>
  <div class="bg-gray-800/70 p-3 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <div class="text-sm text-blue-300 font-medium flex items-center">
        <i class="fas fa-bullseye text-red-400 mr-1.5"></i>学习目标
      </div>
      <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center">
        <i class="fas fa-cog mr-1"></i>
        设置目标
      </button>
    </div>
    
    <div class="space-y-2">
      <!-- 每日阅读时间 -->
      <div class="goal-item">
        <div class="flex items-center justify-between mb-1">
          <div class="text-xs text-gray-300">每日阅读时间</div>
          <div class="text-xs text-gray-400">
            {{ dailyReadingGoal.current }}/{{ dailyReadingGoal.target }}分钟
          </div>
        </div>
        <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-500 rounded-full"
            :style="{ width: `${(dailyReadingGoal.current / dailyReadingGoal.target) * 100}%` }"
          ></div>
        </div>
      </div>
      
      <!-- 每周阅读页数 -->
      <div class="goal-item">
        <div class="flex items-center justify-between mb-1">
          <div class="text-xs text-gray-300">每周阅读页数</div>
          <div class="text-xs text-gray-400">
            {{ weeklyPagesGoal.current }}/{{ weeklyPagesGoal.target }}页/周
          </div>
        </div>
        <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-green-500 rounded-full"
            :style="{ width: `${(weeklyPagesGoal.current / weeklyPagesGoal.target) * 100}%` }"
          ></div>
        </div>
      </div>
      
      <!-- 按当前进度，将在12天内完成本书 -->
      <div class="goal-item">
        <div class="flex items-center justify-between mb-1">
          <div class="text-xs text-gray-300">按当前进度，将在{{ completionPrediction.daysLeft }}天内完成本书</div>
          <div class="text-xs text-gray-400 text-right">
            <div>提示: 每天增加{{ completionPrediction.dailyIncrement }}分钟</div>
            <div>可提前3天完成</div>
          </div>
        </div>
        <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-yellow-500 rounded-full"
            :style="{ width: `${completionPrediction.completion}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 最近成就 -->
    <div class="mt-3 pt-3 border-t border-gray-700">
      <div class="text-xs text-gray-400 mb-2">最近成就</div>
      <div class="flex items-center space-x-2">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.title"
          class="achievement-badge w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-sm relative tooltip-container"
        >
          <i :class="['fas', achievement.icon]" class="text-yellow-500"></i>
          <!-- 成就提示 -->
          <div class="tooltip">
            <div class="text-xs font-medium mb-0.5">{{ achievement.title }}</div>
            <div class="text-[10px] text-gray-400">{{ achievement.description }}</div>
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
.achievement-badge {
  transition: transform 0.2s, box-shadow 0.2s;
}

.achievement-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
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
</style>