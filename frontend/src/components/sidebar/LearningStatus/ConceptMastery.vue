<template>
  <div class="concept-container">
    <div class="concept-header">
      <div class="section-title">
        <i class="fas fa-brain concept-icon"></i>概念掌握情况
      </div>
      <button class="view-all-button">
        <i class="fas fa-list-ul list-icon"></i>全部
      </button>
    </div>
    
    <div class="concept-list">
      <div 
        v-for="concept in concepts" 
        :key="concept.name"
        class="concept-item"
      >
        <div class="concept-item-header">
          <div class="concept-name-wrapper">
            <i :class="getConceptIcon(concept.level)" class="concept-level-icon"></i>
            <span class="concept-name" :class="getConceptTextColor(concept.level)">
              {{ concept.name }}
            </span>
          </div>
          <div class="concept-level" :class="getConceptLevelTextColor(concept.level)">
            <span class="level-badge" :class="getConceptLevelBgColor(concept.level)">
              {{ getLevelText(concept.level) }}
            </span>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="progress-container">
          <div 
            class="progress-bar"
            :style="{ width: `${concept.progress}%` }"
            :class="getConceptProgressColor(concept.level)"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="knowledge-map-button">
        <i class="fas fa-network-wired map-icon"></i>查看知识图谱
      </button>
      <button class="recommend-button">
        <i class="fas fa-magic magic-icon"></i>推荐练习
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  concepts: {
    type: Array,
    default: () => []
  }
});

// 获取概念图标
function getConceptIcon(level) {
  switch (level) {
    case 'expert':
      return 'fas fa-circle icon-expert';
    case 'advanced':
      return 'fas fa-circle icon-advanced';
    case 'intermediate':
      return 'fas fa-circle icon-intermediate';
    case 'beginner':
      return 'fas fa-circle icon-beginner';
    case 'novice':
      return 'fas fa-circle icon-novice';
    default:
      return 'fas fa-circle icon-default';
  }
}

// 获取概念文本颜色
function getConceptTextColor(level) {
  switch (level) {
    case 'expert':
      return 'text-expert';
    case 'advanced':
      return 'text-advanced';
    case 'intermediate':
      return 'text-intermediate';
    case 'beginner':
      return 'text-beginner';
    case 'novice':
      return 'text-novice';
    default:
      return 'text-default';
  }
}

// 获取概念等级文本颜色
function getConceptLevelTextColor(level) {
  switch (level) {
    case 'expert':
      return 'text-expert';
    case 'advanced':
      return 'text-advanced';
    case 'intermediate':
      return 'text-intermediate';
    case 'beginner':
      return 'text-beginner';
    case 'novice':
      return 'text-novice';
    default:
      return 'text-default';
  }
}

// 获取概念等级背景颜色
function getConceptLevelBgColor(level) {
  switch (level) {
    case 'expert':
      return 'bg-expert';
    case 'advanced':
      return 'bg-advanced';
    case 'intermediate':
      return 'bg-intermediate';
    case 'beginner':
      return 'bg-beginner';
    case 'novice':
      return 'bg-novice';
    default:
      return 'bg-default';
  }
}

// 获取进度条颜色
function getConceptProgressColor(level) {
  switch (level) {
    case 'expert':
      return 'progress-expert';
    case 'advanced':
      return 'progress-advanced';
    case 'intermediate':
      return 'progress-intermediate';
    case 'beginner':
      return 'progress-beginner';
    case 'novice':
      return 'progress-novice';
    default:
      return 'progress-default';
  }
}

// 获取等级文本
function getLevelText(level) {
  switch (level) {
    case 'expert':
      return '精通';
    case 'advanced':
      return '熟练';
    case 'intermediate':
      return '掌握';
    case 'beginner':
      return '入门';
    case 'novice':
      return '待学习';
    default:
      return '未知';
  }
}
</script>

<style scoped>
.concept-container {
  background-color: rgba(31, 41, 55, 0.7); /* bg-gray-800/70 */
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.concept-header {
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

.concept-icon {
  color: #c084fc; /* text-purple-400 */
  margin-right: 0.375rem;
}

.view-all-button {
  font-size: 0.75rem;
  color: #60a5fa; /* text-blue-400 */
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.view-all-button:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.list-icon {
  margin-right: 0.25rem;
}

.concept-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.concept-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.concept-name-wrapper {
  display: flex;
  align-items: center;
}

.concept-level-icon {
  margin-right: 0.375rem;
  font-size: 0.875rem;
}

.concept-name {
  font-size: 0.75rem;
  font-weight: 500;
}

.concept-level {
  font-size: 0.75rem;
}

.level-badge {
  padding: 0.125rem 0.375rem;
  border-radius: 0.125rem;
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
  transition: all 0.5s ease-out;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.knowledge-map-button, .recommend-button {
  font-size: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.knowledge-map-button {
  color: #60a5fa; /* text-blue-400 */
}

.knowledge-map-button:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.recommend-button {
  color: #c084fc; /* text-purple-400 */
}

.recommend-button:hover {
  color: #d8b4fe; /* hover:text-purple-300 */
}

.map-icon, .magic-icon {
  margin-right: 0.375rem;
}

/* 等级颜色定义 */
.icon-expert, .text-expert, .progress-expert {
  color: #10b981; /* text-green-500 */
}

.icon-advanced, .text-advanced, .progress-advanced {
  color: #3b82f6; /* text-blue-500 */
}

.icon-intermediate, .text-intermediate, .progress-intermediate {
  color: #f59e0b; /* text-yellow-500 */
}

.icon-beginner, .text-beginner, .progress-beginner {
  color: #f97316; /* text-orange-500 */
}

.icon-novice, .text-novice, .progress-novice {
  color: #ef4444; /* text-red-500 */
}

.icon-default, .text-default, .progress-default {
  color: #6b7280; /* text-gray-500 */
}

/* 进度条颜色 */
.progress-expert {
  background-color: #10b981; /* bg-green-500 */
}

.progress-advanced {
  background-color: #3b82f6; /* bg-blue-500 */
}

.progress-intermediate {
  background-color: #f59e0b; /* bg-yellow-500 */
}

.progress-beginner {
  background-color: #f97316; /* bg-orange-500 */
}

.progress-novice {
  background-color: #ef4444; /* bg-red-500 */
}

.progress-default {
  background-color: #6b7280; /* bg-gray-500 */
}

/* 等级背景颜色 */
.bg-expert {
  background-color: rgba(6, 78, 59, 0.3); /* bg-green-900/30 */
}

.bg-advanced {
  background-color: rgba(30, 58, 138, 0.3); /* bg-blue-900/30 */
}

.bg-intermediate {
  background-color: rgba(120, 53, 15, 0.3); /* bg-yellow-900/30 */
}

.bg-beginner {
  background-color: rgba(154, 52, 18, 0.3); /* bg-orange-900/30 */
}

.bg-novice {
  background-color: rgba(127, 29, 29, 0.3); /* bg-red-900/30 */
}

.bg-default {
  background-color: rgba(17, 24, 39, 0.3); /* bg-gray-900/30 */
}
</style>