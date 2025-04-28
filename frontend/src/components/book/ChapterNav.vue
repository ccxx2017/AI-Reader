<template>
  <div class="chapter-nav absolute left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10 p-4 w-64 overflow-y-auto shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-medium">目录</h3>
      <button @click="$emit('toggle-chapter-nav')" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <ul class="space-y-4">
      <li v-for="(chapter, chapterIndex) in chapters" :key="chapterIndex" class="mb-3">
        <div @click="$emit('navigate-to-chapter', chapterIndex)" 
             class="flex items-center cursor-pointer py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
             :class="{'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': chapterIndex === currentChapter}">
          <span class="font-medium">{{ chapter.title }}</span>
        </div>
        <ul class="pl-4 mt-1 space-y-1">
          <li v-for="(section, sectionIndex) in chapter.sections" :key="sectionIndex">
            <div @click="$emit('navigate-to-section', chapterIndex, sectionIndex)" 
                 class="text-sm py-1 px-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                 :class="{'text-blue-500': currentChapter === chapterIndex && section.page === currentPageIndex}">
              {{ section.title }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  chapters: {
    type: Array,
    required: true
  },
  currentChapter: {
    type: Number,
    required: true
  },
  currentPageIndex: {
    type: Number,
    default: 0
  }
});

defineEmits([
  'toggle-chapter-nav',
  'navigate-to-chapter',
  'navigate-to-section'
]);
</script>

<style scoped>
.chapter-nav {
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
