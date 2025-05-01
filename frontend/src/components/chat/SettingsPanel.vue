<template>
  <!-- 个性化设置面板 -->
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-panel">
      <div class="panel-header">
        <h3 class="panel-title">个性化设置</h3>
        <button @click="$emit('close')" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="panel-content">
        <!-- 回复长度 -->
        <div class="setting-section">
          <label class="setting-label">回复长度</label>
          <div class="button-group">
            <button 
              @click="localSettings.responseLength = 'concise'" 
              class="option-button"
              :class="{'option-selected': localSettings.responseLength === 'concise'}"
            >
              精简
            </button>
            <button 
              @click="localSettings.responseLength = 'balanced'" 
              class="option-button"
              :class="{'option-selected': localSettings.responseLength === 'balanced'}"
            >
              平衡
            </button>
            <button 
              @click="localSettings.responseLength = 'detailed'" 
              class="option-button"
              :class="{'option-selected': localSettings.responseLength === 'detailed'}"
            >
              详细
            </button>
          </div>
        </div>
        
        <!-- 语气风格 -->
        <div class="setting-section">
          <label class="setting-label">语气风格</label>
          <div class="button-group">
            <button 
              @click="localSettings.tonality = 'friendly'" 
              class="option-button"
              :class="{'option-selected': localSettings.tonality === 'friendly'}"
            >
              友好
            </button>
            <button 
              @click="localSettings.tonality = 'professional'" 
              class="option-button"
              :class="{'option-selected': localSettings.tonality === 'professional'}"
            >
              专业
            </button>
            <button 
              @click="localSettings.tonality = 'academic'" 
              class="option-button"
              :class="{'option-selected': localSettings.tonality === 'academic'}"
            >
              学术
            </button>
          </div>
        </div>
        
        <!-- 引用和参考 -->
        <div class="setting-section">
          <label class="setting-label">引用和参考</label>
          <div class="checkbox-item">
            <input 
              type="checkbox" 
              id="includeCitations" 
              v-model="localSettings.includeCitations"
              class="checkbox-input"
            />
            <label for="includeCitations" class="checkbox-label">包含引用和页码参考</label>
          </div>
        </div>
        
        <!-- 自动建议和通知 -->
        <div class="setting-section">
          <label class="setting-label">自动建议和通知</label>
          <div class="checkbox-item">
            <input 
              type="checkbox" 
              id="autoSuggestQuestions" 
              v-model="localSettings.autoSuggestQuestions"
              class="checkbox-input"
            />
            <label for="autoSuggestQuestions" class="checkbox-label">显示推荐问题</label>
          </div>
          <div class="checkbox-item">
            <input 
              type="checkbox" 
              id="notifyBookmarkReferences" 
              v-model="localSettings.notifyBookmarkReferences"
              class="checkbox-input"
            />
            <label for="notifyBookmarkReferences" class="checkbox-label">提示相关书签引用</label>
          </div>
          <div class="checkbox-item">
            <input 
              type="checkbox" 
              id="notifyNoteReferences" 
              v-model="localSettings.notifyNoteReferences"
              class="checkbox-input"
            />
            <label for="notifyNoteReferences" class="checkbox-label">提示相关笔记引用</label>
          </div>
        </div>
        
        <!-- 主题设置 -->
        <div class="setting-section">
          <label class="setting-label">界面主题</label>
          <div class="button-group">
            <button 
              @click="localSettings.theme = 'light'" 
              class="option-button"
              :class="{'option-selected': localSettings.theme === 'light'}"
            >
              浅色
            </button>
            <button 
              @click="localSettings.theme = 'dark'" 
              class="option-button"
              :class="{'option-selected': localSettings.theme === 'dark'}"
            >
              深色
            </button>
            <button 
              @click="localSettings.theme = 'auto'" 
              class="option-button"
              :class="{'option-selected': localSettings.theme === 'auto'}"
            >
              自动
            </button>
          </div>
        </div>
      </div>
      
      <div class="panel-footer">
        <button @click="$emit('close')" class="cancel-button">
          取消
        </button>
        <button @click="saveAndClose" class="save-button">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

// 创建本地设置状态副本
const localSettings = ref({...props.settings});

// 保存并关闭
function saveAndClose() {
  emit('save', localSettings.value);
}

onMounted(() => {
  // 克隆设置对象以避免直接修改props
  localSettings.value = JSON.parse(JSON.stringify(props.settings));
});
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.settings-panel {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 24rem;
  max-width: 100%;
}

.dark .settings-panel {
  background-color: #1f2937;
}

.panel-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .panel-header {
  border-bottom-color: #374151;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.close-button {
  padding: 0.5rem;
  border-radius: 9999px;
  background: transparent;
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

.panel-content {
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.setting-section {
  margin-bottom: 1rem;
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.option-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.dark .option-button {
  background-color: #374151;
  color: #d1d5db;
}

.option-button:hover {
  background-color: #e5e7eb;
}

.dark .option-button:hover {
  background-color: #4b5563;
}

.option-button:focus {
  outline: none;
}

.option-selected {
  background-color: #3b82f6;
  color: white;
}

.option-selected:hover {
  background-color: #2563eb;
}

.dark .option-selected {
  background-color: #3b82f6;
  color: white;
}

.dark .option-selected:hover {
  background-color: #2563eb;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox-item:last-child {
  margin-bottom: 0;
}

.checkbox-input {
  border-radius: 0.25rem;
  border-color: #d1d5db;
  color: #3b82f6;
}

.checkbox-input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.checkbox-label {
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

.panel-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dark .panel-footer {
  border-top-color: #374151;
}

.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark .cancel-button {
  background-color: #374151;
  color: #d1d5db;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.dark .cancel-button:hover {
  background-color: #4b5563;
}

.save-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #2563eb;
}
</style>
