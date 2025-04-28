<template>
  <!-- 顶部控制栏 -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center">
      <div class="text-lg font-medium mr-3">书籍视图</div>
      <div class="text-sm font-medium text-gray-600 dark:text-gray-400">《深度学习基础》</div>
    </div>
    <div class="flex space-x-2 items-center">
      <!-- 书签按钮 -->
      <button @click="$emit('toggle-bookmarks')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="书签">
        <i class="fas fa-bookmark text-gray-600 dark:text-gray-300"></i>
      </button>
      <!-- 分享按钮 -->
      <button @click="$emit('share-content')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="分享">
        <i class="fas fa-share-alt text-gray-600 dark:text-gray-300"></i>
      </button>
      <!-- 朗读按钮 -->
      <button @click="$emit('toggle-reading')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" :class="{'text-blue-500': isReading}" title="朗读">
        <i class="fas" :class="isReading ? 'fa-pause' : 'fa-play'"></i>
      </button>
      <!-- 关键词高亮切换按钮 -->
      <button @click="$emit('toggle-keyword-highlight')" 
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" 
              :class="{'text-yellow-500': enableKeywordHighlight}" 
              title="切换关键词高亮">
        <i class="fas fa-highlighter"></i>
      </button>
      <!-- 笔记按钮 -->
      <button @click="$emit('toggle-notes-panel')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative" :class="{'text-blue-500': showNotesPanel}" title="笔记">
        <i class="fas fa-sticky-note"></i>
        <span v-if="!showNotesPanel && currentPageNotes.length > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{{ currentPageNotes.length }}</span>
      </button>
      
      <!-- 顶部折叠控制按钮 -->
      <button @click="$emit('toggle-header')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="折叠顶部栏">
        <i class="fas fa-chevron-up text-gray-600 dark:text-gray-300"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isReading: {
    type: Boolean,
    default: false
  },
  enableKeywordHighlight: {
    type: Boolean,
    default: false
  },
  showNotesPanel: {
    type: Boolean,
    default: false
  },
  currentPageNotes: {
    type: Array,
    default: () => []
  }
});

defineEmits([
  'toggle-bookmarks',
  'share-content',
  'toggle-reading',
  'toggle-keyword-highlight',
  'toggle-notes-panel',
  'toggle-header'
]);
</script>
