<template>
  <!-- 底部输入区域 -->
  <div class="chat-input-container">
    <div class="input-wrapper">
      <textarea 
        :value="userInput"
        @input="$emit('update:userInput', $event.target.value)"
        class="chat-textarea"
        placeholder="输入你的问题..."
        rows="2"
        @keydown.enter.prevent="$emit('send-message')"
      ></textarea>
      <button 
        @click="$emit('send-message')"
        class="send-button"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    <div class="controls-container">
      <div class="input-options">
        <!-- 多模态输入选项 -->
        <button 
          @click="$emit('open-file-upload')"
          class="option-button"
          title="上传文件"
        >
          <i class="fas fa-file-upload"></i>
        </button>
        <button 
          @click="$emit('toggle-voice-input')"
          class="option-button"
          :class="{'voice-active': isVoiceInputActive}"
          title="语音输入"
        >
          <i class="fas fa-microphone"></i>
        </button>
        <button 
          @click="$emit('open-drawing-tool')"
          class="option-button"
          title="绘图工具"
        >
          <i class="fas fa-paint-brush"></i>
        </button>
        <button 
          @click="$emit('open-camera-upload')"
          class="option-button"
          title="拍照上传"
        >
          <i class="fas fa-camera"></i>
        </button>
        <input type="file" id="file-upload" class="hidden-input" @change="handleFileUpload" />
      </div>
      
      <div class="hint-text">
        <span v-if="isVoiceInputActive" class="recording-text">
          <i class="fas fa-circle recording-icon"></i>录音中...
        </span>
        <span v-else>按 Enter 发送</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userInput: {
    type: String,
    required: true
  },
  isVoiceInputActive: {
    type: Boolean,
    default: false
  }
});

defineEmits([
  'update:userInput',
  'send-message',
  'open-file-upload',
  'toggle-voice-input',
  'open-drawing-tool',
  'open-camera-upload'
]);

function handleFileUpload(event) {
  // 触发父组件的文件处理逻辑
  console.log('文件已选择');
}
</script>

<style scoped>
.chat-input-container {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dark .chat-input-container {
  border-top-color: #374151;
}

.input-wrapper {
  position: relative;
}

.chat-textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  padding-right: 3rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  resize: none;
}

.chat-textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.dark .chat-textarea {
  border-color: #4b5563;
  background-color: #1f2937;
  color: #e5e7eb;
}

.send-button {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #3b82f6;
  background: transparent;
  border: none;
  cursor: pointer;
}

.send-button:hover {
  background-color: #f3f4f6;
}

.dark .send-button:hover {
  background-color: #374151;
}

.send-button:focus {
  outline: none;
}

.controls-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.input-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-button {
  padding: 0.375rem;
  border-radius: 0.375rem;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.option-button:hover {
  background-color: #f3f4f6;
}

.dark .option-button {
  color: #9ca3af;
}

.dark .option-button:hover {
  background-color: #374151;
}

.option-button:focus {
  outline: none;
}

.voice-active {
  color: #ef4444;
}

.hidden-input {
  display: none;
}

.hint-text {
  font-size: 0.75rem;
  color: #9ca3af;
}

.dark .hint-text {
  color: #6b7280;
}

.recording-text {
  color: #ef4444;
}

.recording-icon {
  margin-right: 0.25rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
