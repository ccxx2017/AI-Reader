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
import { ref, onMounted } from 'vue';
import { useEventBus } from '../composables/useEventBus';

const selectionMenuRef = ref(null);
const eventBus = useEventBus();

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
  
  // 通知高亮已添加
  eventBus.emit('text-highlighted', {
    text: selection.toString(),
    element: highlightSpan
  });
}

// 添加笔记
function addNote() {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  // 获取选择的文本
  const selectedText = selection.toString();
  
  // 触发添加笔记事件
  eventBus.emit('add-note', {
    text: selectedText,
    position: getSelectionPosition()
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
      eventBus.emit('show-toast', {
        message: '已复制到剪贴板',
        type: 'success'
      });
    })
    .catch(err => {
      console.error('复制失败:', err);
      eventBus.emit('show-toast', {
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
  eventBus.emit('ask-ai', {
    text: selection.toString()
  });
  
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
