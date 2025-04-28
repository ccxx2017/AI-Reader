<template>
  <!-- 学习辅助工具 - 可折叠 -->
  <div class="border-t border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center px-4 py-2 cursor-pointer" @click="$emit('toggle-tools')">
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
        <i class="fas fa-tools mr-2 text-blue-500"></i>
        <span>学习工具</span>
      </div>
      <div class="text-gray-500">
        <i :class="showTools ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
    </div>
    
    <div v-if="showTools" class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex overflow-x-auto transition-all duration-300 overflow-hidden">
      <button @click="$emit('generate-concept-map')" class="flex flex-col items-center justify-center p-2 mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
        <i class="fas fa-project-diagram text-lg"></i>
        <span class="text-xs mt-1">概念图谱</span>
      </button>
      <button @click="$emit('generate-study-cards')" class="flex flex-col items-center justify-center p-2 mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
        <i class="fas fa-clone text-lg"></i>
        <span class="text-xs mt-1">学习卡片</span>
      </button>
      <button @click="$emit('generate-summary')" class="flex flex-col items-center justify-center p-2 mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
        <i class="fas fa-file-alt text-lg"></i>
        <span class="text-xs mt-1">学习概要</span>
      </button>
      <button @click="$emit('show-progress-stats')" class="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
        <i class="fas fa-chart-line text-lg"></i>
        <span class="text-xs mt-1">学习统计</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showTools: {
    type: Boolean,
    required: true
  }
});

defineEmits([
  'toggle-tools',
  'generate-concept-map',
  'generate-study-cards',
  'generate-summary',
  'show-progress-stats'
]);
</script>
