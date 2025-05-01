<template>
  <!-- 顶部控制栏 -->
  <div class="book-header">
    <div class="title-container">
      <div class="book-title">书籍视图</div>
      <div class="book-subtitle">《深度学习基础》</div>
    </div>
    <div class="controls-container">
      <!-- 书签按钮 -->
      <button @click="$emit('toggle-bookmarks')" class="control-button" title="书签">
        <i class="fas fa-bookmark icon-gray"></i>
      </button>
      <!-- 分享按钮 -->
      <button @click="$emit('share-content')" class="control-button" title="分享">
        <i class="fas fa-share-alt icon-gray"></i>
      </button>
      <!-- 朗读按钮 -->
      <button @click="$emit('toggle-reading')" class="control-button" :class="{'active-blue': isReading}" title="朗读">
        <i class="fas" :class="isReading ? 'fa-pause' : 'fa-play'"></i>
      </button>
      <!-- 关键词高亮切换按钮 -->
      <button @click="$emit('toggle-keyword-highlight')" 
              class="control-button" 
              :class="{'active-yellow': enableKeywordHighlight}" 
              title="切换关键词高亮">
        <i class="fas fa-highlighter"></i>
      </button>
      <!-- 笔记按钮 -->
      <button @click="$emit('toggle-notes-panel')" class="control-button position-relative" :class="{'active-blue': showNotesPanel}" title="笔记">
        <i class="fas fa-sticky-note"></i>
        <span v-if="!showNotesPanel && currentPageNotes.length > 0" class="notes-badge">{{ currentPageNotes.length }}</span>
      </button>
      
      <!-- 顶部折叠控制按钮 -->
      <button @click="$emit('toggle-header')" class="control-button" title="折叠顶部栏">
        <i class="fas fa-chevron-up icon-gray"></i>
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

<style scoped>
.book-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .book-header {
  border-bottom-color: #374151;
}

.title-container {
  display: flex;
  align-items: center;
}

.book-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-right: 0.75rem;
}

.book-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.dark .book-subtitle {
  color: #9ca3af;
}

.controls-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.control-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.control-button:hover {
  background-color: #f3f4f6;
}

.dark .control-button:hover {
  background-color: #1f2937;
}

.control-button:focus {
  outline: none;
}

.icon-gray {
  color: #4b5563;
}

.dark .icon-gray {
  color: #d1d5db;
}

.active-blue {
  color: #3b82f6;
}

.active-yellow {
  color: #eab308;
}

.position-relative {
  position: relative;
}

.notes-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
