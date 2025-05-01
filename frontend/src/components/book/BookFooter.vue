<template>
  <!-- 底部导航栏 -->
  <div class="book-footer">
    <div class="navigation-buttons">
      <button @click="$emit('previous-page')" class="page-nav-button" title="上一页">
        <i class="fas fa-chevron-left icon-margin-right"></i>
        <span>上一页</span>
      </button>
      <span class="page-indicator">{{ currentPageIndex + 1 }} / {{ totalPages }}</span>
      <button @click="$emit('next-page')" class="page-nav-button" title="下一页">
        <span>下一页</span>
        <i class="fas fa-chevron-right icon-margin-left"></i>
      </button>
    </div>
    
    <!-- 中间的提示文字 -->
    <div class="center-hint">
      <span class="hint-text">请将书籍放在摄像头下方</span>
    </div>
    
    <!-- 右侧功能按钮 -->
    <div class="action-buttons">
      <button @click="$emit('toggle-chapter-nav')" class="action-button" title="目录">
        <i class="fas fa-list"></i>
      </button>
      <button @click="$emit('adjust-font-size', 1)" class="action-button" title="增大字号">
        <i class="fas fa-search-plus"></i>
      </button>
      <button @click="$emit('adjust-font-size', -1)" class="action-button" title="减小字号">
        <i class="fas fa-search-minus"></i>
      </button>
      <button @click="$emit('toggle-footer')" class="action-button" title="隐藏底部栏">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPageIndex: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

defineEmits([
  'previous-page',
  'next-page',
  'toggle-chapter-nav',
  'adjust-font-size',
  'toggle-footer'
]);
</script>

<style scoped>
.book-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark .book-footer {
  border-top: 1px solid #374151;
  background-color: #1f2937;
}

.navigation-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-nav-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: #eff6ff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.page-nav-button:hover {
  background-color: #dbeafe;
}

.dark .page-nav-button {
  background-color: rgba(30, 58, 138, 0.3);
}

.dark .page-nav-button:hover {
  background-color: #1e40af;
}

.page-nav-button:focus {
  outline: none;
}

.icon-margin-right {
  margin-right: 0.25rem;
}

.icon-margin-left {
  margin-left: 0.25rem;
}

.page-indicator {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .page-indicator {
  color: #9ca3af;
}

.center-hint {
  text-align: center;
}

.hint-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.dark .hint-text {
  color: #d1d5db;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #4b5563;
}

.action-button:hover {
  background-color: #f3f4f6;
}

.dark .action-button {
  color: #d1d5db;
}

.dark .action-button:hover {
  background-color: #1f2937;
}

.action-button:focus {
  outline: none;
}
</style>
