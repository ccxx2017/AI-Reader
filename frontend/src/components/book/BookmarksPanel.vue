<template>
  <div class="bookmarks-panel">
    <div class="panel-header">
      <h3 class="panel-title">书签</h3>
      <button @click="$emit('toggle-bookmarks')" class="close-button">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div v-if="bookmarks.length === 0" class="empty-bookmarks">
      <i class="fas fa-bookmark bookmark-icon"></i>
      <p>暂无书签</p>
    </div>
    <ul v-else class="bookmarks-list">
      <li v-for="(bookmark, index) in bookmarks" :key="index" class="bookmark-item">
        <div class="bookmark-header">
          <a href="#" @click.prevent="$emit('navigate-to-bookmark', bookmark)" class="bookmark-link">
            {{ bookmark.title }}
          </a>
          <button @click="$emit('remove-bookmark', index)" class="delete-button">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <p class="bookmark-preview">{{ bookmark.preview }}</p>
      </li>
    </ul>
    <div class="add-bookmark-container">
      <button @click="$emit('add-current-page-bookmark')" class="add-bookmark-button">
        添加当前页为书签
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bookmarks: {
    type: Array,
    default: () => []
  }
});

defineEmits([
  'toggle-bookmarks',
  'navigate-to-bookmark',
  'remove-bookmark',
  'add-current-page-bookmark'
]);
</script>

<style scoped>
.bookmarks-panel {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  background-color: white;
  border-left: 1px solid #e5e7eb;
  z-index: 10;
  padding: 1rem;
  width: 16rem;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dark .bookmarks-panel {
  background-color: #1f2937;
  border-left-color: #374151;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.panel-title {
  font-weight: 500;
}

.close-button {
  padding: 0.25rem;
  border-radius: 9999px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  background-color: #f3f4f6;
}

.dark .close-button:hover {
  background-color: #374151;
}

.close-button:focus {
  outline: none;
}

.empty-bookmarks {
  text-align: center;
  color: #6b7280;
  padding: 1rem 0;
}

.bookmark-icon {
  color: #d1d5db;
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bookmark-item {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.5rem;
}

.dark .bookmark-item {
  border-bottom-color: #374151;
}

.bookmark-header {
  display: flex;
  justify-content: space-between;
}

.bookmark-link {
  font-size: 0.875rem;
  color: inherit;
  text-decoration: none;
}

.bookmark-link:hover {
  color: #3b82f6;
}

.dark .bookmark-link:hover {
  color: #60a5fa;
}

.delete-button {
  font-size: 0.75rem;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-button:hover {
  color: #ef4444;
}

.bookmark-preview {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.add-bookmark-container {
  margin-top: 1rem;
}

.add-bookmark-button {
  width: 100%;
  padding: 0.5rem 0;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.add-bookmark-button:hover {
  background-color: #2563eb;
}

.bookmarks-panel {
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
