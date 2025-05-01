<template>
  <div 
    class="note-item"
    :class="[`note-color-${note.color}`]"
  >
    <div class="note-content-wrapper">
      <!-- 笔记颜色标记 -->
      <div 
        class="color-marker"
        :class="[`marker-${note.color}`]"
      ></div>
      
      <!-- 笔记内容 -->
      <div class="note-content">
        <h3 class="note-title">{{ note.title }}</h3>
        <p class="note-text">{{ note.content }}</p>
        <div class="note-meta">
          <span>页码: {{ note.pageNumber }}</span>
          <span>{{ formatDate(note.updatedAt) }}</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="note-actions">
        <button 
          @click.stop="$emit('view', note)" 
          class="action-button view-button"
          title="查看"
        >
          <i class="fas fa-eye"></i>
        </button>
        <button 
          @click.stop="$emit('edit', note)" 
          class="action-button edit-button"
          title="编辑"
        >
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button 
          @click.stop="confirmDelete" 
          class="action-button delete-button"
          title="删除"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view', 'edit', 'delete']);

// 格式化日期
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 确认删除
function confirmDelete(event) {
  event.stopPropagation();
  
  if (confirm('确定要删除这条笔记吗？')) {
    emit('delete', props.note.id);
  }
}
</script>

<style scoped>
.note-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  padding: 0.625rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.note-item:hover {
  background-color: rgba(55, 65, 81, 0.2); /* hover:bg-gray-700/20 */
}

/* 笔记颜色背景 */
.note-color-amber {
  background-color: rgba(245, 158, 11, 0.1); /* bg-amber-500/10 */
}

.note-color-blue {
  background-color: rgba(59, 130, 246, 0.1); /* bg-blue-500/10 */
}

.note-color-green {
  background-color: rgba(16, 185, 129, 0.1); /* bg-green-500/10 */
}

.note-color-red {
  background-color: rgba(239, 68, 68, 0.1); /* bg-red-500/10 */
}

.note-color-purple {
  background-color: rgba(139, 92, 246, 0.1); /* bg-purple-500/10 */
}

.note-content-wrapper {
  display: flex;
  align-items: flex-start;
}

.color-marker {
  width: 0.25rem;
  height: 100%;
  border-radius: 9999px;
  flex-shrink: 0;
  margin-right: 0.5rem;
  align-self: stretch;
}

/* 笔记颜色标记 */
.marker-amber {
  background-color: #f59e0b; /* bg-amber-500 */
}

.marker-blue {
  background-color: #3b82f6; /* bg-blue-500 */
}

.marker-green {
  background-color: #10b981; /* bg-green-500 */
}

.marker-red {
  background-color: #ef4444; /* bg-red-500 */
}

.marker-purple {
  background-color: #8b5cf6; /* bg-purple-500 */
}

.note-content {
  flex-grow: 1;
}

.note-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e5e7eb; /* text-gray-200 */
  margin-bottom: 0.25rem;
}

.note-text {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280; /* text-gray-500 */
}

.note-actions {
  display: flex;
  margin-left: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.note-item:hover .note-actions {
  opacity: 1;
}

.action-button {
  padding: 4px;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.view-button:hover {
  color: #60a5fa; /* hover:text-blue-400 */
}

.edit-button:hover {
  color: #34d399; /* hover:text-green-400 */
}

.delete-button:hover {
  color: #f87171; /* hover:text-red-400 */
}
</style>