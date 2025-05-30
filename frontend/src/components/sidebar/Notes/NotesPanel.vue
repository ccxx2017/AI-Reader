<template>
  <div>
    <div class="panel-header">
      <h2 class="panel-title">我的笔记</h2>
      <div class="action-buttons">
        <button 
          @click="createNewNote" 
          class="new-note-button"
        >
          <i class="fas fa-plus-circle plus-icon"></i>
          新建笔记
        </button>
      </div>
    </div>
    
    <!-- 笔记列表 -->
    <div class="notes-list">
      <NoteItem 
        v-for="note in notes" 
        :key="note.id" 
        :note="note"
        @view="viewNote"
        @edit="editNote"
        @delete="deleteNote"
      />
    </div>
    
    <!-- 没有笔记时的提示 -->
    <div v-if="notes.length === 0" class="empty-notes-message">
      <i class="fas fa-sticky-note empty-icon"></i>
      <p>暂无笔记</p>
      <button 
        @click="createNewNote" 
        class="create-note-button"
      >
        开始记录笔记
      </button>
    </div>
    
    <!-- 笔记编辑对话框 -->
    <NoteEditor 
      v-if="showNoteEditor"
      :note="editingNote"
      @close="closeNoteEditor"
      @save="saveNote"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NoteItem from './NoteItem.vue';
import NoteEditor from './NoteEditor.vue';

// 笔记列表
const notes = ref([
  {
    id: '1',
    title: '关于量子叠加态',
    content: '量子比特可以同时处于多个状态，这与经典比特不同...',
    color: 'amber',
    pageNumber: 42,
    createdAt: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: new Date().getTime() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: '2',
    title: '量子计算优势',
    content: '量子计算机可以通过量子加速原理，可以同时处理多个状态...',
    color: 'green',
    pageNumber: 43,
    createdAt: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: new Date().getTime() - 1 * 24 * 60 * 60 * 1000
  }
]);

// 笔记编辑器状态
const showNoteEditor = ref(false);
const editingNote = ref(null);

// 查看笔记
function viewNote(note) {
  console.log('查看笔记:', note);
  // 实现查看笔记的功能
}

// 编辑笔记
function editNote(note) {
  console.log('编辑笔记:', note);
  editingNote.value = { ...note };
  showNoteEditor.value = true;
}

// 删除笔记
function deleteNote(noteId) {
  console.log('删除笔记:', noteId);
  const index = notes.value.findIndex(note => note.id === noteId);
  if (index !== -1) {
    notes.value.splice(index, 1);
  }
}

// 创建新笔记
function createNewNote() {
  console.log('创建新笔记');
  editingNote.value = {
    id: `note-${Date.now()}`,
    title: '',
    content: '',
    color: 'blue',
    pageNumber: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  showNoteEditor.value = true;
}

// 保存笔记
function saveNote(updatedNote) {
  console.log('保存笔记:', updatedNote);
  
  // 如果是编辑现有笔记
  const index = notes.value.findIndex(note => note.id === updatedNote.id);
  if (index !== -1) {
    notes.value[index] = { ...updatedNote, updatedAt: Date.now() };
  } else {
    // 如果是新笔记
    notes.value.push({ ...updatedNote, updatedAt: Date.now() });
  }
  
  closeNoteEditor();
}

// 关闭笔记编辑器
function closeNoteEditor() {
  showNoteEditor.value = false;
  editingNote.value = null;
}
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

.action-buttons {
  display: flex;
  align-items: center;
}

.new-note-button {
  font-size: 0.75rem;
  color: #60a5fa; /* text-blue-400 */
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.new-note-button:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}

.plus-icon {
  margin-right: 0.25rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-notes-message {
  padding: 2rem 0;
  text-align: center;
  color: #9ca3af; /* text-gray-400 */
}

.empty-icon {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.create-note-button {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #60a5fa; /* text-blue-400 */
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.create-note-button:hover {
  color: #93c5fd; /* hover:text-blue-300 */
}
</style>