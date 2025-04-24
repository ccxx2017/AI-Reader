<template>
  <div>
    <div class="mb-3">
      <div class="text-sm text-blue-300 font-medium mb-2">阅读时长分析</div>
      
      <!-- 阅读时长统计切换 -->
      <div class="flex mb-2">
        <button 
          @click="timeRange = 'daily'" 
          class="px-2 py-1 text-xs rounded-l-md"
          :class="timeRange === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'"
        >
          每日
        </button>
        <button 
          @click="timeRange = 'weekly'" 
          class="px-2 py-1 text-xs"
          :class="timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'"
        >
          每周
        </button>
        <button 
          @click="timeRange = 'monthly'" 
          class="px-2 py-1 text-xs rounded-r-md"
          :class="timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'"
        >
          每月
        </button>
      </div>
      
      <!-- 阅读时长图表 -->
      <div class="h-32 flex items-end justify-between space-x-1">
        <div 
          v-for="(value, index) in currentTimeData" 
          :key="index"
          class="reading-bar bg-blue-500 hover:bg-blue-400 transition-colors rounded-t-sm relative group"
          :style="{ height: `${(value / maxTimeValue) * 100}%`, width: `${100 / currentTimeData.length}%` }"
        >
          <!-- 数值提示 -->
          <div class="reading-tooltip">{{ value }}分钟</div>
        </div>
      </div>
      
      <!-- 图表说明 -->
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <template v-if="timeRange === 'daily'">
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
          <span>日</span>
        </template>
        <template v-else-if="timeRange === 'weekly'">
          <span v-for="i in 5" :key="i">第{{ i }}周</span>
        </template>
        <template v-else>
          <span v-for="i in 6" :key="i">{{ i }}月</span>
        </template>
      </div>
    </div>
    
    <!-- 概念学习进度 -->
    <div>
      <div class="text-sm text-blue-300 font-medium mb-2">概念学习进度</div>
      <div class="space-y-3">
        <template v-for="(point, index) in statisticsData.conceptProgress.timeline" :key="index">
          <div v-if="index < statisticsData.conceptProgress.timeline.length - 1" class="concept-progress-item text-xs">
            <div class="mb-1 flex justify-between">
              <span class="text-gray-400">{{ formatDate(point.date) }}</span>
              <span class="text-gray-400">→</span>
              <span class="text-gray-400">{{ formatDate(statisticsData.conceptProgress.timeline[index + 1].date) }}</span>
            </div>
            <div class="space-y-1">
              <div 
                v-for="(progress, concept) in point.concepts" 
                :key="concept"
                class="concept-item"
              >
                <div class="flex justify-between items-center mb-0.5">
                  <span class="text-gray-300">{{ concept }}</span>
                  <div class="text-gray-400">
                    <span>{{ progress }}%</span>
                    <i 
                      class="fas fa-arrow-right mx-1 text-gray-600"
                      :class="{'text-green-500': statisticsData.conceptProgress.timeline[index + 1].concepts[concept] > progress}"
                    ></i>
                    <span>{{ statisticsData.conceptProgress.timeline[index + 1].concepts[concept] || progress }}%</span>
                  </div>
                </div>
                <div class="relative w-full h-1 bg-gray-700 rounded-full">
                  <!-- 旧进度 -->
                  <div 
                    class="absolute h-full bg-gray-500 rounded-full"
                    :style="{ width: `${progress}%` }"
                  ></div>
                  <!-- 新进度 -->
                  <div 
                    v-if="statisticsData.conceptProgress.timeline[index + 1].concepts[concept]"
                    class="absolute h-full bg-green-500 rounded-full"
                    :style="{ width: `${statisticsData.conceptProgress.timeline[index + 1].concepts[concept]}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
  statisticsData: {
    type: Object,
    default: () => ({
      readingHours: {
        daily: [],
        weekly: [],
        monthly: []
      },
      conceptProgress: {
        timeline: []
      }
    })
  }
});

// 时间范围
const timeRange = ref('daily');

// 当前选择的时间范围的数据
const currentTimeData = computed(() => {
  return props.statisticsData.readingHours[timeRange.value] || [];
});

// 当前时间范围中的最大值，用于计算柱状图高度
const maxTimeValue = computed(() => {
  if (currentTimeData.value.length === 0) return 100;
  return Math.max(...currentTimeData.value);
});

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
</script>

<style scoped>
.reading-bar {
  position: relative;
}

.reading-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(30, 64, 175, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  white-space: nowrap;
  margin-bottom: 0.25rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.reading-bar:hover .reading-tooltip {
  opacity: 1;
}
</style>