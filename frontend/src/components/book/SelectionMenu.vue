<template>
  <!-- 文本选择菜单 -->
  <div id="selection-menu" class="selection-menu hidden" ref="selectionMenuRef">
    <button @click="highlightSelection" title="高亮标记">
      <i class="fas fa-highlighter text-yellow-500"></i>
    </button>
    <button @click="addNote" title="添加笔记">
      <i class="fas fa-sticky-note text-blue-500"></i>
    </button>
    <button @click="copyText" title="复制文本">
      <i class="fas fa-copy text-gray-500"></i>
    </button>
    <button @click="askAI" title="询问AI">
      <i class="fas fa-robot text-primary"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useBookStore } from '../../store/modules/book';
import { useNotesStore } from '../../store/modules/notes';
import { useChatStore } from '../../store/modules/chat';

// 获取Store
const bookStore = useBookStore();
const notesStore = useNotesStore();
const chatStore = useChatStore();

const selectionMenuRef = ref(null);

// 高亮选中文本
function highlightSelection() {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  // 获取选择范围
  const range = selection.getRangeAt(0);
  
  // 创建高亮元素
  const highlightSpan = document.createElement('span');
  highlightSpan.className = 'highlighted-text';
  
  // 将选择的内容包装在高亮元素中
  range.surroundContents(highlightSpan);
  
  // 隐藏菜单
  hideSelectionMenu();
  
  // 保存高亮信息到store
  bookStore.addHighlight({
    id: Date.now().toString(),
    text: selection.toString(),
    bookId: bookStore.currentBook?.id,
    chapterId: bookStore.currentChapter?.id,
    timestamp: new Date().toISOString()
  });
}

// 添加笔记
function addNote() {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  // 获取选择的文本
  const selectedText = selection.toString();
  
  // 添加笔记到store
  notesStore.addNote({
    id: Date.now().toString(),
    text: selectedText,
    bookId: bookStore.currentBook?.id,
    chapterId: bookStore.currentChapter?.id,
    content: '',
    position: getSelectionPosition(),
    timestamp: new Date().toISOString()
  });
  
  // 隐藏菜单
  hideSelectionMenu();
}

// 获取选择位置
function getSelectionPosition() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right
  };
}

// 复制文本
function copyText() {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  // 复制到剪贴板
  navigator.clipboard.writeText(selection.toString())
    .then(() => {
      // 显示复制成功提示
      bookStore.showToast({
        message: '已复制到剪贴板',
        type: 'success'
      });
    })
    .catch(err => {
      console.error('复制失败:', err);
      bookStore.showToast({
        message: '复制失败',
        type: 'error'
      });
    });
  
  // 隐藏菜单
  hideSelectionMenu();
}

// 向AI提问
function askAI() {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  // 发送选中文本到AI聊天
  chatStore.askQuestion(selection.toString());
  
  // 隐藏菜单
  hideSelectionMenu();
}

// 隐藏选择菜单
function hideSelectionMenu() {
  if (selectionMenuRef.value) {
    selectionMenuRef.value.classList.add('hidden');
  }
}

onMounted(() => {
  // 点击其他区域隐藏菜单
  document.addEventListener('click', (event) => {
    if (selectionMenuRef.value && !selectionMenuRef.value.contains(event.target)) {
      hideSelectionMenu();
    }
  });
});
</script>

<style scoped>
.selection-menu {
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 6px;
  z-index: 1000;
}

.selection-menu button {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  margin: 0 2px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.selection-menu button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.selection-menu.hidden {
  display: none;
}

/* 深色模式适配 */
:root.dark .selection-menu {
  background-color: #1f2937;
}

:root.dark .selection-menu button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root.dark .selection-menu i.fa-copy {
  color: #d1d5db;
}
</style>
