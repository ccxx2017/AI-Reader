<template>
  <div class="note-editor-overlay" @click.self="$emit('close')">
    <div class="note-editor-modal">
      <div class="modal-header">
        <h3 class="modal-title">{{ isEditing ? '编辑笔记' : '新建笔记' }}</h3>
        <button @click="$emit('close')" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="form-container">
        <!-- 标题输入 -->
        <div class="form-field">
          <label class="field-label">标题</label>
          <input 
            type="text" 
            v-model="editedNote.title" 
            class="text-input"
            placeholder="笔记标题"
          >
        </div>
        
        <!-- 内容输入 -->
        <div class="form-field">
          <label class="field-label">内容</label>
          <textarea 
            v-model="editedNote.content" 
            class="textarea-input"
            placeholder="笔记内容"
          ></textarea>
        </div>
        
        <!-- 页码输入 -->
        <div class="form-field">
          <label class="field-label">页码</label>
          <input 
            type="number" 
            v-model="editedNote.pageNumber" 
            class="text-input"
            placeholder="相关页码"
          >
        </div>
        
        <!-- 颜色选择 -->
        <div class="form-field">
          <label class="field-label">颜色标记</label>
          <div class="color-selector">
            <div 
              v-for="color in colorOptions" 
              :key="color.value"
              @click="editedNote.color = color.value"
              class="color-option"
              :class="[
                `color-${color.value}`,
                editedNote.color === color.value ? 'color-selected' : ''
              ]"
              :title="color.name"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          @click="$emit('close')" 
          class="cancel-button"
        >
          取消
        </button>
        <button 
          @click="saveNote" 
          class="save-button"
          :disabled="!isValid"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  note: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

// 颜色选项
const colorOptions = [
  { value: 'blue', name: '蓝色' },
  { value: 'green', name: '绿色' },
  { value: 'yellow', name: '黄色' },
  { value: 'red', name: '红色' },
  { value: 'purple', name: '紫色' },
  { value: 'amber', name: '琥珀色' }
];

// 编辑的笔记数据
const editedNote = ref(props.note ? { ...props.note } : {
  id: `note-${Date.now()}`,
  title: '',
  content: '',
  color: 'blue',
  pageNumber: '',
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// 判断是否是编辑模式
const isEditing = computed(() => {
  return editedNote.value && editedNote.value.id && editedNote.value.id.toString().indexOf('note-') !== 0;
});

// 验证表单有效性
const isValid = computed(() => {
  return editedNote.value.title.trim() !== '' && editedNote.value.content.trim() !== '';
});

// 保存笔记
function saveNote() {
  if (!isValid.value) return;
  
  // 确保页码是数字
  if (editedNote.value.pageNumber) {
    editedNote.value.pageNumber = parseInt(editedNote.value.pageNumber);
  }
  
  emit('save', { ...editedNote.value, updatedAt: Date.now() });
}
</script>

<style scoped>
.note-editor-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.note-editor-modal {
  background-color: #1f2937; /* bg-gray-800 */
  width: 91.666667%; /* w-11/12 */
  max-width: 28rem; /* max-w-md */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  padding: 1rem; /* p-4 */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem; /* mb-3 */
}

.modal-title {
  font-size: 1rem; /* text-base */
  font-weight: 500; /* font-medium */
  color: #e5e7eb; /* text-gray-200 */
}

.close-button {
  color: #9ca3af; /* text-gray-400 */
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: #d1d5db; /* hover:text-gray-300 */
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* space-y-3 */
}

.form-field {
  margin-bottom: 0.5rem;
}

.field-label {
  display: block;
  font-size: 0.75rem; /* text-xs */
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.25rem; /* mb-1 */
}

.text-input, .textarea-input {
  width: 100%;
  background-color: #374151; /* bg-gray-700 */
  color: #e5e7eb; /* text-gray-200 */
  padding: 0.5rem; /* p-2 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
  border: none;
  outline: none;
}

.text-input:focus, .textarea-input:focus {
  outline: none;
  box-shadow: 0 0 0 1px #3b82f6; /* focus:ring-1 focus:ring-blue-500 */
}

.textarea-input {
  min-height: 100px; /* min-h-[100px] */
  resize: vertical;
}

.color-selector {
  display: flex;
  gap: 0.5rem; /* space-x-2 */
}

.color-option {
  width: 1.5rem; /* w-6 */
  height: 1.5rem; /* h-6 */
  border-radius: 9999px; /* rounded-full */
  cursor: pointer;
  transition: transform 0.2s; /* transition-transform */
}

.color-option:hover {
  transform: scale(1.1); /* hover:scale-110 */
}

.color-selected {
  border: 2px solid white;
  box-shadow: 0 0 0 1px #1f2937;
  transform: scale(1.1); /* transform scale-110 */
}

/* 颜色选项 */
.color-blue {
  background-color: #3b82f6; /* bg-blue-500 */
}

.color-green {
  background-color: #10b981; /* bg-green-500 */
}

.color-yellow {
  background-color: #eab308; /* bg-yellow-500 */
}

.color-red {
  background-color: #ef4444; /* bg-red-500 */
}

.color-purple {
  background-color: #8b5cf6; /* bg-purple-500 */
}

.color-amber {
  background-color: #f59e0b; /* bg-amber-500 */
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem; /* mt-4 */
  gap: 0.5rem; /* space-x-2 */
}

.cancel-button {
  padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
  background-color: #374151; /* bg-gray-700 */
  color: #d1d5db; /* text-gray-300 */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
  border: none;
  cursor: pointer;
  transition: background-color 0.2s; /* transition-colors */
}

.cancel-button:hover {
  background-color: #4b5563; /* hover:bg-gray-600 */
}

.save-button {
  padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
  background-color: #2563eb; /* bg-blue-600 */
  color: white; /* text-white */
  border-radius: 0.25rem; /* rounded */
  font-size: 0.875rem; /* text-sm */
  border: none;
  cursor: pointer;
  transition: background-color 0.2s; /* transition-colors */
}

.save-button:hover {
  background-color: #3b82f6; /* hover:bg-blue-500 */
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>