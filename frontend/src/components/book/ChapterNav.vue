<template>
  <div class="chapter-nav">
    <div class="chapter-header">
      <h3 class="chapter-title">目录</h3>
      <button @click="$emit('toggle-chapter-nav')" class="close-button">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <ul class="chapter-list">
      <li v-for="(chapter, chapterIndex) in chapters" :key="chapterIndex" class="chapter-item">
        <div @click="$emit('navigate-to-chapter', chapterIndex)" 
             class="chapter-heading"
             :class="{'chapter-active': chapterIndex === currentChapter}">
          <span class="chapter-heading-text">{{ chapter.title }}</span>
        </div>
        <ul class="section-list">
          <li v-for="(section, sectionIndex) in chapter.sections" :key="sectionIndex">
            <div @click="$emit('navigate-to-section', chapterIndex, sectionIndex)" 
                 class="section-item"
                 :class="{'section-active': currentChapter === chapterIndex && section.page === currentPageIndex}">
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
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  z-index: 10;
  padding: 1rem;
  width: 16rem;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dark .chapter-nav {
  background-color: #1f2937;
  border-right-color: #374151;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chapter-title {
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

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chapter-item {
  margin-bottom: 0.75rem;
}

.chapter-heading {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.chapter-heading:hover {
  background-color: #f3f4f6;
}

.dark .chapter-heading:hover {
  background-color: #374151;
}

.chapter-heading-text {
  font-weight: 500;
}

.chapter-active {
  background-color: #ebf5ff;
  color: #2563eb;
}

.dark .chapter-active {
  background-color: rgba(30, 58, 138, 0.3);
  color: #93c5fd;
}

.section-list {
  padding-left: 1rem;
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-item {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
}

.section-item:hover {
  background-color: #f3f4f6;
}

.dark .section-item:hover {
  background-color: #374151;
}

.section-active {
  color: #3b82f6;
}

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
