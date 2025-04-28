<template>
  <!-- 底部导航栏 -->
  <div class="book-footer flex items-center justify-between px-4">
    <div class="flex items-center space-x-4">
      <button @click="$emit('previous-page')" class="p-2 px-4 rounded-md bg-blue-50 hover:bg-blue-100 dark:hover:bg-blue-800 dark:bg-blue-900/30 focus:outline-none flex items-center" title="上一页">
        <i class="fas fa-chevron-left mr-1"></i>
        <span>上一页</span>
      </button>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentPageIndex + 1 }} / {{ totalPages }}</span>
      <button @click="$emit('next-page')" class="p-2 px-4 rounded-md bg-blue-50 hover:bg-blue-100 dark:hover:bg-blue-800 dark:bg-blue-900/30 focus:outline-none flex items-center" title="下一页">
        <span>下一页</span>
        <i class="fas fa-chevron-right ml-1"></i>
      </button>
    </div>
    
    <!-- 中间的提示文字 -->
    <div class="text-center">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">请将书籍放在摄像头下方</span>
    </div>
    
    <!-- 右侧功能按钮 -->
    <div class="flex items-center space-x-2">
      <button @click="$emit('toggle-chapter-nav')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="目录">
        <i class="fas fa-list"></i>
      </button>
      <button @click="$emit('adjust-font-size', 1)" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="增大字号">
        <i class="fas fa-search-plus"></i>
      </button>
      <button @click="$emit('adjust-font-size', -1)" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="减小字号">
        <i class="fas fa-search-minus"></i>
      </button>
      <button @click="$emit('toggle-footer')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="隐藏底部栏">
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
}

.dark .book-footer {
  border-top: 1px solid #374151;
  background-color: #1f2937;
}
</style>
