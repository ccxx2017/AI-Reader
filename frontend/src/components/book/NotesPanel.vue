<template>
  <!-- 侧边笔记面板 -->
  <div class="side-notes-panel" :class="{'expanded': showNotesPanel}">
    <div class="notes-toggle-button" @click="$emit('toggle-notes-panel')">
      <i :class="showNotesPanel ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </div>
    
    <!-- 笔记内容 -->
    <div class="notes-content" v-if="showNotesPanel">
      <div class="notes-header">
        <h3><i class="fas fa-sticky-note"></i> 页面笔记 ({{ currentPageNotes.length }})</h3>
        <button @click="$emit('add-empty-note')" class="add-note-btn">
          <i class="fas fa-plus"></i> 添加笔记
        </button>
      </div>
      
      <div class="notes-list">
        <div v-if="currentPageNotes.length === 0" class="empty-notes">
          <i class="far fa-sticky-note"></i>
          <p>当前页面没有笔记</p>
          <p class="help-text">选择文本后点击<i class="fas fa-sticky-note"></i>图标添加笔记，或使用上方的添加按钮</p>
        </div>
        
        <div v-for="(note, index) in currentPageNotes" :key="note.id" class="note-item" :class="{ 'active': note.active }">
          <div class="note-source-text" v-if="note.sourceText">{{ note.sourceText }}</div>
          <div class="note-content" v-if="!note.editing">{{ note.text }}</div>
          <textarea v-else class="w-full p-2 border rounded" v-model="note.text" rows="3"></textarea>
          
          <div class="note-actions">
            <button v-if="!note.editing" @click="$emit('show-note-content', note, index)" class="note-action-btn">
              <i class="fas fa-edit"></i> 编辑
            </button>
            <button v-if="note.editing" @click="$emit('save-note', note, index)" class="note-action-btn">
              <i class="fas fa-save"></i> 保存
            </button>
            <button @click="$emit('delete-note', index)" class="note-action-btn delete">
              <i class="fas fa-trash"></i> 删除
            </button>
          </div>
          <div class="note-timestamp" v-if="note.timestamp">{{ note.timestamp }}</div>
        </div>
      </div>
      
      <div class="note-instructions" v-if="currentPageNotes.length > 0">
        <i class="fas fa-info-circle"></i> 提示：选中文本后可直接添加笔记
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showNotesPanel: {
    type: Boolean,
    required: true
  },
  currentPageNotes: {
    type: Array,
    default: () => []
  }
});

defineEmits([
  'toggle-notes-panel',
  'add-empty-note',
  'show-note-content',
  'save-note',
  'delete-note'
]);
</script>

<style scoped>
.side-notes-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background-color: white;
  z-index: 10;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.dark .side-notes-panel {
  background-color: #1f2937;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
}

.side-notes-panel.expanded {
  width: 300px;
  border-left: 1px solid #e5e7eb;
}

.dark .side-notes-panel.expanded {
  border-left: 1px solid #374151;
}

.notes-toggle-button {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
}

.dark .notes-toggle-button {
  background-color: #1f2937;
  border-color: #374151;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
}

.notes-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .notes-header {
  border-bottom: 1px solid #374151;
}

.notes-header h3 {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.notes-header h3 i {
  margin-right: 0.5rem;
  color: #3b82f6;
}

.add-note-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-note-btn:hover {
  background-color: #2563eb;
}

.notes-list {
  flex-grow: 1;
  overflow-y: auto;
}

.empty-notes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  text-align: center;
}

.empty-notes i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-notes .help-text {
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.note-item {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  position: relative;
}

.dark .note-item {
  background-color: #374151;
}

.note-item.active {
  border: 2px solid #3b82f6;
}

.note-source-text {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: #6b7280;
}

.dark .note-source-text {
  background-color: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
}

.note-content {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.note-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.note-action-btn {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #3b82f6;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.note-action-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.note-action-btn.delete {
  color: #ef4444;
}

.note-action-btn.delete:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.note-timestamp {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  text-align: right;
}

.note-instructions {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.5rem 0;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
}

.dark .note-instructions {
  color: #9ca3af;
  border-top: 1px solid #374151;
}
</style>
