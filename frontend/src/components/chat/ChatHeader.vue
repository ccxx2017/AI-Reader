<template>
  <!-- 顶部控制栏 -->
  <div class="chat-header">
    <div class="header-title">AI 助手</div>
    <div class="header-controls">
      <!-- 个性化设置 -->
      <button @click="$emit('open-settings')" class="control-button" title="个性化设置">
        <i class="fas fa-sliders-h icon-gray"></i>
      </button>
      <button class="control-button" title="聊天记录">
        <i class="fas fa-history icon-gray"></i>
      </button>
      <button class="control-button" title="设置">
        <i class="fas fa-cog icon-gray"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['open-settings']);
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .chat-header {
  border-bottom-color: #374151;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.header-controls {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.control-button:hover {
  background-color: #f3f4f6;
}

.dark .control-button:hover {
  background-color: #1f2937;
}

.control-button:focus {
  outline: none;
}

.icon-gray {
  color: #4b5563;
}

.dark .icon-gray {
  color: #d1d5db;
}
</style>
