<template>
  <!-- 书籍内容部分 -->
  <div class="book-content-wrapper">
    <div class="book">
      <div class="book-content">
        <!-- 主内容区 -->
        <div class="page" 
             @mouseup="$emit('handle-text-selection')" 
             @contextmenu.prevent
             :ref="el => { if(el) pageContentRef = el }">
          <div v-html="displayContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  displayContent: {
    type: String,
    required: true
  },
  pageContentRef: {
    type: Object,
    required: true
  }
});

defineEmits(['handle-text-selection']);

// 监听内容变化，添加术语点击事件处理
watch(() => props.displayContent, () => {
  // 在下一个DOM更新周期添加事件监听
  setTimeout(() => {
    const terms = document.querySelectorAll('.technical-term');
    terms.forEach(term => {
      term.addEventListener('click', (e) => {
        const definition = e.target.getAttribute('data-definition');
        if (definition) {
          alert(definition);
        }
      });
    });
  }, 0);
}, { immediate: true });
</script>

<style scoped>
.book-content-wrapper {
  flex-grow: 1;
  overflow: hidden;
}

.book {
  height: 100%;
}

.book-content {
  height: 100%;
}

.page {
  height: 100%;
  overflow-y: auto;
  position: relative;
  background-color: white;
  padding: 2rem;
  line-height: 1.6;
  color: #111827;
}

.dark .page {
  background-color: #111827;
  color: #e5e7eb;
}

:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.dark :deep(h1), .dark :deep(h2), .dark :deep(h3), 
.dark :deep(h4), .dark :deep(h5), .dark :deep(h6) {
  color: #f3f4f6;
}

:deep(p) {
  margin-bottom: 1rem;
}

:deep(ul), :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(code) {
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

.dark :deep(code) {
  background-color: #1e293b;
  color: #e2e8f0;
}

:deep(.highlight-keyword) {
  background-color: rgba(255, 255, 0, 0.3);
  border-radius: 2px;
  padding: 0 2px;
}

.dark :deep(.highlight-keyword) {
  background-color: rgba(255, 255, 0, 0.2);
  color: #fef08a;
}

:deep(.technical-term) {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
}

.dark :deep(.technical-term) {
  color: #60a5fa;
}

:deep(.math-formula) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.dark :deep(.math-formula) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.highlight-yellow) {
  background-color: rgba(255, 255, 0, 0.3);
  padding: 0 2px;
  border-radius: 2px;
}

:deep(.highlight-green) {
  background-color: rgba(0, 255, 0, 0.2);
  padding: 0 2px;
  border-radius: 2px;
}

:deep(.highlight-blue) {
  background-color: rgba(0, 0, 255, 0.1);
  padding: 0 2px;
  border-radius: 2px;
}

:deep(.highlight-red) {
  background-color: rgba(255, 0, 0, 0.1);
  padding: 0 2px;
  border-radius: 2px;
}
</style>
