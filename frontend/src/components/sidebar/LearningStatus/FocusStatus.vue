<template>
  <div class="mb-3 p-3 bg-gray-800/70 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <div class="text-sm text-blue-300 font-medium flex items-center">
        <i class="fas fa-brain text-purple-400 mr-1.5"></i>
        阅读专注度
      </div>
      <div class="flex items-center">
        <span class="text-sm text-gray-300 font-medium">{{ focusScore }}%</span>
        <i class="fas ml-1.5 text-xs" 
          :class="trend === 'up' ? 'fa-arrow-up text-green-400' : 'fa-arrow-down text-red-400'"></i>
      </div>
    </div>
    
    <!-- 专注度进度条 -->
    <div class="w-full h-4 bg-gray-700/50 rounded-full mb-2 overflow-hidden">
      <div 
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="getFocusBarClass(focusScore)"
        :style="{ width: `${focusScore}%` }"
      ></div>
    </div>
    
    <!-- 连续专注时间 -->
    <div class="flex justify-between items-center text-xs text-gray-400">
      <div>
        <span>{{ continuousFocusTime }}分钟</span>
        <span class="text-gray-500 mx-1">连续专注</span>
      </div>
      <div>
        <span>最佳记录:</span>
        <span class="text-green-400 ml-1">{{ maxFocusRecord }}分钟</span>
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
  if (score >= 80) return 'bg-gradient-to-r from-green-500 to-green-400';
  if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-green-400';
  if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-blue-400';
  if (score >= 20) return 'bg-gradient-to-r from-red-500 to-yellow-400';
  return 'bg-gradient-to-r from-red-600 to-red-400';
}
</script>