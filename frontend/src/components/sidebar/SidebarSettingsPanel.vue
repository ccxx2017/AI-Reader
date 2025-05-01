<template>
  <div class="settings-panel">
    <div class="settings-title">
      <i class="fas fa-columns icon-columns"></i>
      <span>界面设置</span>
    </div>
    
    <div class="settings-section">
      <div class="section-label">主题</div>
      <div class="theme-buttons">
        <button 
          class="theme-button"
          :class="{'active': currentTheme === '默认'}"
          @click="$emit('update:currentTheme', '默认')"
        >
          默认
        </button>
        <button 
          class="theme-button"
          :class="{'active': currentTheme === '深色'}"
          @click="$emit('update:currentTheme', '深色')"
        >
          深色
        </button>
        <button 
          class="theme-button"
          :class="{'active': currentTheme === '柔和'}"
          @click="$emit('update:currentTheme', '柔和')"
        >
          柔和
        </button>
      </div>
    </div>
    
    <div class="settings-section">
      <div class="section-label">边栏区域</div>
      <div class="section-list">
        <div v-for="(section, key) in sidebarSections" :key="key" class="section-item">
          <div class="section-checkbox">
            <input 
              type="checkbox" 
              :id="`section-${key}`" 
              v-model="section.visible" 
              class="checkbox"
            >
            <label :for="`section-${key}`" class="checkbox-label">{{ section.label }}</label>
          </div>
          <div class="section-controls">
            <button 
              @click="$emit('move-section-up', key)" 
              class="control-button"
              :disabled="section.order <= 1"
              :class="{ 'disabled': section.order <= 1 }"
            >
              <i class="fas fa-arrow-up"></i>
            </button>
            <button 
              @click="$emit('move-section-down', key)" 
              class="control-button"
              :disabled="section.order >= Object.keys(sidebarSections).length"
              :class="{ 'disabled': section.order >= Object.keys(sidebarSections).length }"
            >
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="action-buttons">
      <button 
        @click="$emit('close')" 
        class="cancel-button"
      >
        取消
      </button>
      <button 
        @click="$emit('save-settings')" 
        class="save-button"
      >
        保存设置
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sidebarSections: {
    type: Object,
    required: true
  },
  currentTheme: {
    type: String,
    default: '默认'
  }
});

defineEmits(['close', 'save-settings', 'move-section-up', 'move-section-down', 'update:currentTheme']);
</script>

<style scoped>
.settings-panel {
  margin-bottom: 1rem;
  background-color: rgba(31, 41, 55, 0.8); /* bg-gray-800/80 */
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(55, 65, 81, 0.5); /* border-gray-700/50 */
}

.settings-title {
  font-size: 0.875rem;
  color: #93c5fd; /* text-blue-300 */
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.icon-columns {
  color: #60a5fa; /* text-blue-400 */
  margin-right: 0.375rem;
}

.settings-section {
  margin-bottom: 0.75rem;
}

.section-label {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.375rem;
}

.theme-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-button {
  padding: 0 0.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #374151; /* border-gray-700 */
  background-color: #1f2937; /* bg-gray-800 */
  color: #d1d5db; /* text-gray-300 */
  transition: background-color 0.2s;
}

.theme-button:hover {
  background-color: #374151; /* hover:bg-gray-700 */
}

.theme-button:focus {
  outline: none;
}

.theme-button.active {
  background-color: #2563eb; /* bg-blue-600 */
  color: white; /* text-white */
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem;
  background-color: rgba(55, 65, 81, 0.5); /* bg-gray-700/50 */
  border-radius: 0.25rem;
}

.section-checkbox {
  display: flex;
  align-items: center;
}

.checkbox {
  height: 0.75rem;
  width: 0.75rem;
  color: #3b82f6; /* text-blue-500 */
  border-radius: 0.25rem;
  border-color: #4b5563; /* border-gray-600 */
}

.checkbox:focus {
  box-shadow: none;
}

.checkbox-label {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.control-button {
  padding: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  background: transparent;
  border: none;
}

.control-button:hover {
  color: #60a5fa; /* hover:text-blue-400 */
}

.control-button:focus {
  outline: none;
}

.control-button.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.cancel-button {
  padding: 0 0.75rem;
  height: 1.75rem;
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
  border: 1px solid #374151; /* border-gray-700 */
  border-radius: 0.25rem;
  background: transparent;
}

.cancel-button:hover {
  background-color: #374151; /* hover:bg-gray-700 */
}

.cancel-button:focus {
  outline: none;
}

.save-button {
  padding: 0 0.75rem;
  height: 1.75rem;
  font-size: 0.75rem;
  color: white;
  background-color: #2563eb; /* bg-blue-600 */
  border-radius: 0.25rem;
  border: none;
}

.save-button:hover {
  background-color: #3b82f6; /* hover:bg-blue-500 */
}

.save-button:focus {
  outline: none;
}
</style>
