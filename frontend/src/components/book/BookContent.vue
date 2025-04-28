<template>
  <!-- 书籍内容部分 -->
  <div class="book-content-wrapper flex-grow overflow-hidden">
    <div class="book h-full">
      <div class="book-content h-full">
        <!-- 主内容区 -->
        <div class="page h-full overflow-y-auto relative bg-white dark:bg-gray-900" 
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
.page {
  padding: 2rem;
  line-height: 1.6;
}

:deep(.highlight-keyword) {
  background-color: rgba(255, 255, 0, 0.3);
  border-radius: 2px;
  padding: 0 2px;
}

:deep(.technical-term) {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
}

:deep(.math-formula) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
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
