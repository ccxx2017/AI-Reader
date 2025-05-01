<template>
  <div>
    <div class="reading-time-section">
      <div class="section-title">阅读时长分析</div>
      
      <!-- 阅读时长统计切换 -->
      <div class="time-range-tabs">
        <button 
          @click="timeRange = 'daily'" 
          class="tab-button tab-left"
          :class="{ 'tab-active': timeRange === 'daily', 'tab-inactive': timeRange !== 'daily' }"
        >
          每日
        </button>
        <button 
          @click="timeRange = 'weekly'" 
          class="tab-button tab-middle"
          :class="{ 'tab-active': timeRange === 'weekly', 'tab-inactive': timeRange !== 'weekly' }"
        >
          每周
        </button>
        <button 
          @click="timeRange = 'monthly'" 
          class="tab-button tab-right"
          :class="{ 'tab-active': timeRange === 'monthly', 'tab-inactive': timeRange !== 'monthly' }"
        >
          每月
        </button>
      </div>
      
      <!-- 阅读时长图表 -->
      <div class="chart-container">
        <div 
          v-for="(value, index) in currentTimeData" 
          :key="index"
          class="reading-bar"
          :style="{ height: `${(value / maxTimeValue) * 100}%`, width: `${100 / currentTimeData.length}%` }"
        >
          <!-- 数值提示 -->
          <div class="reading-tooltip">{{ value }}分钟</div>
        </div>
      </div>
      
      <!-- 图表说明 -->
      <div class="chart-labels">
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
    <div class="concept-progress-section">
      <div class="section-title">概念学习进度</div>
      <div class="concept-timeline">
        <template v-for="(point, index) in statisticsData.conceptProgress.timeline" :key="index">
          <div v-if="index < statisticsData.conceptProgress.timeline.length - 1" class="concept-progress-item">
            <div class="date-range">
              <span class="date-text">{{ formatDate(point.date) }}</span>
              <span class="arrow-icon">→</span>
              <span class="date-text">{{ formatDate(statisticsData.conceptProgress.timeline[index + 1].date) }}</span>
            </div>
            <div class="concept-list">
              <div 
                v-for="(progress, concept) in point.concepts" 
                :key="concept"
                class="concept-item"
              >
                <div class="concept-header">
                  <span class="concept-name">{{ concept }}</span>
                  <div class="progress-values">
                    <span>{{ progress }}%</span>
                    <i 
                      class="fas fa-arrow-right arrow-icon"
                      :class="{'progress-improved': statisticsData.conceptProgress.timeline[index + 1].concepts[concept] > progress}"
                    ></i>
                    <span>{{ statisticsData.conceptProgress.timeline[index + 1].concepts[concept] || progress }}%</span>
                  </div>
                </div>
                <div class="progress-container">
                  <!-- 旧进度 -->
                  <div 
                    class="old-progress"
                    :style="{ width: `${progress}%` }"
                  ></div>
                  <!-- 新进度 -->
                  <div 
                    v-if="statisticsData.conceptProgress.timeline[index + 1].concepts[concept]"
                    class="new-progress"
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
.reading-time-section {
  margin-bottom: 0.75rem;
}

.concept-progress-section {
  margin-top: 0.75rem;
}

.section-title {
  font-size: 0.875rem;
  color: #93c5fd; 
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.time-range-tabs {
  display: flex;
  margin-bottom: 0.5rem;
}

.tab-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
}

.tab-left {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.tab-right {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.tab-active {
  background-color: #2563eb; 
  color: white;
}

.tab-inactive {
  background-color: #374151; 
  color: #9ca3af; 
}

.chart-container {
  height: 8rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.25rem;
}

.reading-bar {
  background-color: #3b82f6; 
  border-top-left-radius: 0.125rem;
  border-top-right-radius: 0.125rem;
  position: relative;
  transition: background-color 0.2s;
}

.reading-bar:hover {
  background-color: #60a5fa; 
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

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280; 
  margin-top: 0.25rem;
}

.concept-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.concept-progress-item {
  font-size: 0.75rem;
}

.date-range {
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
}

.date-text, .arrow-icon {
  color: #9ca3af; 
}

.concept-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.concept-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.125rem;
}

.concept-name {
  color: #d1d5db; 
}

.progress-values {
  color: #9ca3af; 
}

.arrow-icon {
  color: #4b5563; 
  margin: 0 0.25rem;
}

.progress-improved {
  color: #10b981; 
}

.progress-container {
  position: relative;
  width: 100%;
  height: 0.25rem;
  background-color: #374151; 
  border-radius: 9999px;
}

.old-progress {
  position: absolute;
  height: 100%;
  background-color: #6b7280; 
  border-radius: 9999px;
}

.new-progress {
  position: absolute;
  height: 100%;
  background-color: #10b981; 
  border-radius: 9999px;
}
</style>