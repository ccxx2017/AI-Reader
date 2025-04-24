<template>
  <div class="mt-3 bg-gray-800/60 p-3 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <div class="text-sm text-blue-300 font-medium flex items-center">
        <i class="fas fa-users text-blue-400 mr-1.5"></i>
        社区进度对比
      </div>
      <div class="text-xs text-gray-300">
        {{ comparisonData.position }}
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="relative w-full h-2 bg-gray-700 rounded-full mb-1.5 overflow-hidden">
      <!-- 社区平均值标记 -->
      <div class="absolute top-0 h-full w-0.5 bg-gray-400" style="left: 50%;"></div>
      
      <!-- 用户进度 -->
      <div 
        class="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${comparisonData.percentile}%` }"
      ></div>
    </div>
    
    <div class="flex justify-between text-xs text-gray-400">
      <span>落后</span>
      <span>社区平均</span>
      <span>领先</span>
    </div>
    
    <div class="flex items-center justify-center mt-2 text-xs text-gray-400">
      <i class="fas fa-info-circle mr-1 text-blue-400"></i>
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