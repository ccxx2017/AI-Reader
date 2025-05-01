<template>
  <!-- 学习辅助工具 - 可折叠 -->
  <div class="tools-container">
    <div class="tools-header" @click="$emit('toggle-tools')">
      <div class="header-title">
        <i class="fas fa-tools tools-icon"></i>
        <span>学习工具</span>
      </div>
      <div class="toggle-icon">
        <i :class="showTools ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
    </div>
    
    <div v-if="showTools" class="tools-content">
      <button @click="$emit('generate-concept-map')" class="tool-button">
        <i class="fas fa-project-diagram tool-icon"></i>
        <span class="tool-name">概念图谱</span>
      </button>
      <button @click="$emit('generate-study-cards')" class="tool-button">
        <i class="fas fa-clone tool-icon"></i>
        <span class="tool-name">学习卡片</span>
      </button>
      <button @click="$emit('generate-summary')" class="tool-button">
        <i class="fas fa-file-alt tool-icon"></i>
        <span class="tool-name">学习概要</span>
      </button>
      <button @click="$emit('show-progress-stats')" class="tool-button">
        <i class="fas fa-chart-line tool-icon"></i>
        <span class="tool-name">学习统计</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showTools: {
    type: Boolean,
    required: true
  }
});

defineEmits([
  'toggle-tools',
  'generate-concept-map',
  'generate-study-cards',
  'generate-summary',
  'show-progress-stats'
]);
</script>

<style scoped>
.tools-container {
  border-top: 1px solid #e5e7eb;
}

.dark .tools-container {
  border-top-color: #374151;
}

.tools-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.header-title {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.dark .header-title {
  color: #d1d5db;
}

.tools-icon {
  margin-right: 0.5rem;
  color: #3b82f6;
}

.toggle-icon {
  color: #6b7280;
}

.dark .toggle-icon {
  color: #9ca3af;
}

.tools-content {
  padding: 0.5rem 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  overflow-x: auto;
  transition: all 0.3s;
  overflow: hidden;
}

.dark .tools-content {
  border-top-color: #374151;
}

.tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin-right: 1rem;
  color: #4b5563;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.dark .tool-button {
  color: #d1d5db;
}

.tool-button:last-child {
  margin-right: 0;
}

.tool-button:hover {
  color: #3b82f6;
}

.dark .tool-button:hover {
  color: #60a5fa;
}

.tool-button:focus {
  outline: none;
}

.tool-icon {
  font-size: 1.125rem;
}

.tool-name {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>
