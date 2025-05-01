<template>
  <div>
    <div class="panel-header">
      <h2 class="panel-title">个性化学习状态</h2>
      <button class="statistics-toggle" @click="showLearningStatistics = !showLearningStatistics">
        <i class="fas" :class="showLearningStatistics ? 'fa-chart-bar' : 'fa-chart-line'"></i>
        {{ showLearningStatistics ? '查看摘要' : '查看统计' }}
      </button>
    </div>
    
    <!-- 阅读专注度 -->
    <FocusStatus 
      :focusScore="learningState.focusScore.today"
      :trend="learningState.focusScore.trend"
      :continuousFocusTime="learningState.focusScore.continuousFocusTime"
      :maxFocusRecord="learningState.focusScore.maxFocusRecord"
    />
    
    <!-- 概念掌握情况 -->
    <ConceptMastery :concepts="conceptsMastery" />
    
    <!-- 学习目标 -->
    <LearningGoals 
      :dailyReadingGoal="learningState.goals.dailyReading"
      :weeklyPagesGoal="learningState.goals.weeklyPages"
      :completionPrediction="learningState.goals.completionPrediction"
      :achievements="learningState.achievements"
    />
    
    <!-- 社区进度对比 -->
    <CommunityComparison v-if="showLearningStatistics" :comparisonData="learningState.communityComparison" />
    
    <!-- 学习统计展开区域 -->
    <transition name="slide-fade">
      <div v-if="showLearningStatistics" class="statistics-container">
        <LearningStatistics :statisticsData="learningState.statistics" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FocusStatus from './FocusStatus.vue';
import ConceptMastery from './ConceptMastery.vue';
import LearningGoals from './LearningGoals.vue';
import CommunityComparison from './CommunityComparison.vue';
import LearningStatistics from './LearningStatistics.vue';

// 学习统计展示状态
const showLearningStatistics = ref(false);

// 学习状态数据
const learningState = ref({
  focusScore: {
    today: 85,
    trend: 'up', // 'up' 或 'down'
    continuousFocusTime: 28, // 分钟
    maxFocusRecord: 45 // 分钟
  },
  currentBook: {
    conceptsMastery: [
      { name: '量子比特', progress: 90, level: 'expert' },
      { name: '量子叠加', progress: 75, level: 'advanced' },
      { name: '量子纠缠', progress: 35, level: 'beginner' },
      { name: '量子算法', progress: 10, level: 'novice' }
    ]
  },
  goals: {
    dailyReading: {
      target: 60, // 每日阅读目标（分钟）
      current: 28 // 当前完成（分钟）
    },
    weeklyPages: {
      target: 70, // 每周阅读页数目标
      current: 25 // 当前完成页数
    },
    completionPrediction: {
      daysLeft: 12, // 预计剩余天数
      dailyIncrement: 5, // 每天增量（分钟）
      completion: 3 // 完成百分比
    }
  },
  achievements: [
    { icon: 'fa-book-reader', title: '连续学习达人', description: '连续5天学习超过30分钟' },
    { icon: 'fa-certificate', title: '首次专注学习', description: '单次专注学习超过30分钟' }
  ],
  communityComparison: {
    percentile: 65, // 超过社区用户的百分比
    position: '前35%'
  },
  statistics: {
    readingHours: {
      daily: [15, 35, 55, 30, 45, 25, 35],
      weekly: [120, 180, 150, 210, 170],
      monthly: [550, 620, 580, 700, 650, 720]
    },
    conceptProgress: {
      timeline: [
        { date: '2025-04-10', concepts: { '量子比特': 50, '量子叠加': 30 } },
        { date: '2025-04-15', concepts: { '量子比特': 65, '量子叠加': 45, '量子纠缠': 10 } },
        { date: '2025-04-20', concepts: { '量子比特': 80, '量子叠加': 60, '量子纠缠': 25 } },
        { date: '2025-04-24', concepts: { '量子比特': 90, '量子叠加': 75, '量子纠缠': 35, '量子算法': 10 } }
      ]
    }
  }
});

// 提取概念掌握数据
const conceptsMastery = computed(() => {
  return learningState.value.currentBook.conceptsMastery || [];
});
</script>

<style scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.statistics-toggle {
  font-size: 0.75rem;
  color: #60a5fa; /* text-blue-400 */
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.statistics-toggle:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.statistics-container {
  margin-top: 0.75rem;
  background-color: rgba(31, 41, 55, 0.5); /* bg-gray-800/50 */
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(55, 65, 81, 0.5); /* border border-gray-700/50 */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>