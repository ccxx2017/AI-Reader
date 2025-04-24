<template>
  <div 
    class="note-item p-2.5 rounded-lg transition-all duration-200 hover:bg-gray-700/20"
    :class="[`bg-${note.color}-500/10`]"
  >
    <div class="flex items-start">
      <!-- 笔记颜色标记 -->
      <div 
        class="w-1 h-full rounded-full flex-shrink-0 mr-2 self-stretch"
        :class="[`bg-${note.color}-500`]"
      ></div>
      
      <!-- 笔记内容 -->
      <div class="flex-grow">
        <h3 class="text-sm font-medium text-gray-200 mb-1">{{ note.title }}</h3>
        <p class="text-xs text-gray-400 line-clamp-2 mb-1.5">{{ note.content }}</p>
        <div class="flex justify-between items-center text-xs text-gray-500">
          <span>页码: {{ note.pageNumber }}</span>
          <span>{{ formatDate(note.updatedAt) }}</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click.stop="$emit('view', note)" 
          class="note-action-btn text-xs text-gray-400 hover:text-blue-400"
          title="查看"
        >
          <i class="fas fa-eye"></i>
        </button>
        <button 
          @click.stop="$emit('edit', note)" 
          class="note-action-btn text-xs text-gray-400 hover:text-green-400"
          title="编辑"
        >
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button 
          @click.stop="confirmDelete" 
          class="note-action-btn text-xs text-gray-400 hover:text-red-400"
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
}

.note-item:hover .note-action-btn {
  opacity: 1;
}

.note-action-btn {
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>