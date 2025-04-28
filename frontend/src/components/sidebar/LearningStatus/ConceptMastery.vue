<template>
  <div class="bg-gray-800/70 p-3 rounded-lg mb-3">
    <div class="flex items-center justify-between mb-2">
      <div class="text-sm text-blue-300 font-medium flex items-center">
        <i class="fas fa-brain text-purple-400 mr-1.5"></i>概念掌握情况
      </div>
      <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
        <i class="fas fa-list-ul mr-1"></i>全部
      </button>
    </div>
    
    <div class="space-y-2">
      <div 
        v-for="concept in concepts" 
        :key="concept.name"
        class="concept-item"
      >
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center">
            <i :class="getConceptIcon(concept.level)" class="mr-1.5 text-sm"></i>
            <span class="text-xs font-medium" :class="getConceptTextColor(concept.level)">
              {{ concept.name }}
            </span>
          </div>
          <div class="text-xs" :class="getConceptLevelTextColor(concept.level)">
            <span class="px-1.5 py-0.5 rounded-sm" :class="getConceptLevelBgColor(concept.level)">
              {{ getLevelText(concept.level) }}
            </span>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${concept.progress}%` }"
            :class="getConceptProgressColor(concept.level)"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex justify-between mt-3">
      <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center">
        <i class="fas fa-network-wired mr-1.5"></i>查看知识图谱
      </button>
      <button class="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center">
        <i class="fas fa-magic mr-1.5"></i>推荐练习
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
      return 'fas fa-circle text-green-500';
    case 'advanced':
      return 'fas fa-circle text-blue-500';
    case 'intermediate':
      return 'fas fa-circle text-yellow-500';
    case 'beginner':
      return 'fas fa-circle text-orange-500';
    case 'novice':
      return 'fas fa-circle text-red-500';
    default:
      return 'fas fa-circle text-gray-500';
  }
}

// 获取概念文本颜色
function getConceptTextColor(level) {
  switch (level) {
    case 'expert':
      return 'text-green-400';
    case 'advanced':
      return 'text-blue-400';
    case 'intermediate':
      return 'text-yellow-400';
    case 'beginner':
      return 'text-orange-400';
    case 'novice':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

// 获取概念等级文本颜色
function getConceptLevelTextColor(level) {
  switch (level) {
    case 'expert':
      return 'text-green-400';
    case 'advanced':
      return 'text-blue-400';
    case 'intermediate':
      return 'text-yellow-400';
    case 'beginner':
      return 'text-orange-400';
    case 'novice':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

// 获取概念等级背景颜色
function getConceptLevelBgColor(level) {
  switch (level) {
    case 'expert':
      return 'bg-green-900/30';
    case 'advanced':
      return 'bg-blue-900/30';
    case 'intermediate':
      return 'bg-yellow-900/30';
    case 'beginner':
      return 'bg-orange-900/30';
    case 'novice':
      return 'bg-red-900/30';
    default:
      return 'bg-gray-900/30';
  }
}

// 获取进度条颜色
function getConceptProgressColor(level) {
  switch (level) {
    case 'expert':
      return 'bg-green-500';
    case 'advanced':
      return 'bg-blue-500';
    case 'intermediate':
      return 'bg-yellow-500';
    case 'beginner':
      return 'bg-orange-500';
    case 'novice':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
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