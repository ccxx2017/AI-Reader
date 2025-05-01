<template>
  <!-- 智能提问建议 - 可折叠 -->
  <div class="suggestions-container">
    <div class="suggestions-header" @click="$emit('toggle-suggestions')">
      <div class="header-title">
        <i class="fas fa-lightbulb suggestion-icon"></i>
        <span>推荐问题</span>
      </div>
      <div class="toggle-icon">
        <i :class="showSuggestions ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
    </div>
    
    <div v-if="showSuggestions" class="suggestions-content">
      <div class="suggestions-grid">
        <button 
          v-for="(suggestion, index) in questionSuggestions" 
          :key="index"
          @click="$emit('use-suggestion', suggestion.text)"
          class="suggestion-button"
          :class="[
            suggestion.level === 'basic' ? 'basic-level' : 
            suggestion.level === 'advanced' ? 'advanced-level' :
            'expert-level'
          ]"
        >
          <span v-if="suggestion.level === 'basic'" class="level-indicator basic-indicator"></span>
          <span v-if="suggestion.level === 'advanced'" class="level-indicator advanced-indicator"></span>
          <span v-if="suggestion.level === 'expert'" class="level-indicator expert-indicator"></span>
          {{ suggestion.text }}
        </button>
      </div>
      <div v-if="relatedHistoryQuestions.length > 0" class="history-container">
        <p class="history-title">之前问过：</p>
        <div class="history-grid">
          <button 
            v-for="(question, index) in relatedHistoryQuestions" 
            :key="index"
            @click="$emit('use-suggestion', question)"
            class="history-button"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showSuggestions: {
    type: Boolean,
    required: true
  },
  questionSuggestions: {
    type: Array,
    default: () => []
  },
  relatedHistoryQuestions: {
    type: Array,
    default: () => []
  }
});

defineEmits(['toggle-suggestions', 'use-suggestion']);
</script>

<style scoped>
.suggestions-container {
  border-top: 1px solid #e5e7eb;
}

.dark .suggestions-container {
  border-top-color: #374151;
}

.suggestions-header {
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

.suggestion-icon {
  margin-right: 0.5rem;
  color: #eab308;
}

.toggle-icon {
  color: #6b7280;
}

.dark .toggle-icon {
  color: #9ca3af;
}

.suggestions-content {
  padding: 0.5rem 1rem;
  border-top: 1px solid #e5e7eb;
  transition: all 0.3s;
  overflow: hidden;
}

.dark .suggestions-content {
  border-top-color: #374151;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  border: 1px solid;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-button:focus {
  outline: none;
}

.basic-level {
  border-color: #bbf7d0;
  background-color: #f0fdf4;
  color: #166534;
}

.basic-level:hover {
  background-color: #dcfce7;
}

.dark .basic-level {
  background-color: rgba(22, 101, 52, 0.2);
  color: #86efac;
  border-color: #166534;
}

.advanced-level {
  border-color: #bfdbfe;
  background-color: #eff6ff;
  color: #1e40af;
}

.advanced-level:hover {
  background-color: #dbeafe;
}

.dark .advanced-level {
  background-color: rgba(30, 58, 138, 0.2);
  color: #93c5fd;
  border-color: #1e40af;
}

.expert-level {
  border-color: #e9d5ff;
  background-color: #faf5ff;
  color: #6b21a8;
}

.expert-level:hover {
  background-color: #f3e8ff;
}

.dark .expert-level {
  background-color: rgba(107, 33, 168, 0.2);
  color: #d8b4fe;
  border-color: #6b21a8;
}

.level-indicator {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  margin-right: 0.375rem;
}

.basic-indicator {
  background-color: #22c55e;
}

.advanced-indicator {
  background-color: #3b82f6;
}

.expert-indicator {
  background-color: #a855f7;
}

.history-container {
  margin-top: 0.5rem;
}

.history-title {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.dark .history-title {
  color: #9ca3af;
}

.history-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.history-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-button:hover {
  background-color: #f3f4f6;
}

.history-button:focus {
  outline: none;
}

.dark .history-button {
  background-color: rgba(55, 65, 81, 0.3);
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .history-button:hover {
  background-color: rgba(55, 65, 81, 0.5);
}
</style>
