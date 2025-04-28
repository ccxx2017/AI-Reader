<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-gray-800 w-11/12 max-w-md rounded-lg shadow-lg p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-medium text-gray-200">{{ isEditing ? '编辑笔记' : '新建笔记' }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-300">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-3">
        <!-- 标题输入 -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">标题</label>
          <input 
            type="text" 
            v-model="editedNote.title" 
            class="w-full bg-gray-700 text-gray-200 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="笔记标题"
          >
        </div>
        
        <!-- 内容输入 -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">内容</label>
          <textarea 
            v-model="editedNote.content" 
            class="w-full bg-gray-700 text-gray-200 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
            placeholder="笔记内容"
          ></textarea>
        </div>
        
        <!-- 页码输入 -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">页码</label>
          <input 
            type="number" 
            v-model="editedNote.pageNumber" 
            class="w-full bg-gray-700 text-gray-200 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="相关页码"
          >
        </div>
        
        <!-- 颜色选择 -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">颜色标记</label>
          <div class="flex space-x-2">
            <div 
              v-for="color in colorOptions" 
              :key="color.value"
              @click="editedNote.color = color.value"
              class="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
              :class="[
                `bg-${color.value}-500`,
                editedNote.color === color.value ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-800 transform scale-110' : ''
              ]"
              :title="color.name"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end mt-4 space-x-2">
        <button 
          @click="$emit('close')" 
          class="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-colors"
        >
          取消
        </button>
        <button 
          @click="saveNote" 
          class="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 transition-colors"
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