<template>
  <!-- 底部输入区域 -->
  <div class="p-4 border-t border-gray-200 dark:border-gray-700">
    <div class="relative">
      <textarea 
        :value="userInput"
        @input="$emit('update:userInput', $event.target.value)"
        class="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200"
        placeholder="输入你的问题..."
        rows="2"
        @keydown.enter.prevent="$emit('send-message')"
      ></textarea>
      <button 
        @click="$emit('send-message')"
        class="absolute right-2 bottom-2 p-2 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
    <div class="flex items-center justify-between mt-2">
      <div class="flex items-center space-x-2">
        <!-- 多模态输入选项 -->
        <button 
          @click="$emit('open-file-upload')"
          class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          title="上传文件"
        >
          <i class="fas fa-file-upload"></i>
        </button>
        <button 
          @click="$emit('toggle-voice-input')"
          class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          :class="{'text-red-500': isVoiceInputActive}"
          title="语音输入"
        >
          <i class="fas fa-microphone"></i>
        </button>
        <button 
          @click="$emit('open-drawing-tool')"
          class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          title="绘图工具"
        >
          <i class="fas fa-paint-brush"></i>
        </button>
        <button 
          @click="$emit('open-camera-upload')"
          class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          title="拍照上传"
        >
          <i class="fas fa-camera"></i>
        </button>
        <input type="file" id="file-upload" class="hidden" @change="handleFileUpload" />
      </div>
      
      <div class="text-xs text-gray-400 dark:text-gray-500">
        <span v-if="isVoiceInputActive" class="text-red-500">
          <i class="fas fa-circle animate-pulse mr-1"></i>录音中...
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
