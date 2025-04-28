<template>
  <div class="bookmarks-panel absolute right-0 top-0 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-10 p-4 w-64 overflow-y-auto shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-medium">书签</h3>
      <button @click="$emit('toggle-bookmarks')" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div v-if="bookmarks.length === 0" class="text-center text-gray-500 py-4">
      <i class="fas fa-bookmark text-gray-300 text-4xl mb-2"></i>
      <p>暂无书签</p>
    </div>
    <ul v-else class="space-y-3">
      <li v-for="(bookmark, index) in bookmarks" :key="index" class="border-b border-gray-100 dark:border-gray-700 pb-2">
        <div class="flex justify-between">
          <a href="#" @click.prevent="$emit('navigate-to-bookmark', bookmark)" class="text-sm hover:text-blue-500 dark:hover:text-blue-400">
            {{ bookmark.title }}
          </a>
          <button @click="$emit('remove-bookmark', index)" class="text-xs text-gray-400 hover:text-red-500">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1 truncate">{{ bookmark.preview }}</p>
      </li>
    </ul>
    <div class="mt-4">
      <button @click="$emit('add-current-page-bookmark')" class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
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
