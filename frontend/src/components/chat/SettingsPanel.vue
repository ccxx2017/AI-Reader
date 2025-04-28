<template>
  <!-- 个性化设置面板 -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-full">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium">个性化设置</h3>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="p-4 max-h-[70vh] overflow-y-auto">
        <!-- 回复长度 -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">回复长度</label>
          <div class="flex space-x-2">
            <button 
              @click="localSettings.responseLength = 'concise'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.responseLength === 'concise' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              精简
            </button>
            <button 
              @click="localSettings.responseLength = 'balanced'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.responseLength === 'balanced' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              平衡
            </button>
            <button 
              @click="localSettings.responseLength = 'detailed'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.responseLength === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              详细
            </button>
          </div>
        </div>
        
        <!-- 语气风格 -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">语气风格</label>
          <div class="flex space-x-2">
            <button 
              @click="localSettings.tonality = 'friendly'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.tonality === 'friendly' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              友好
            </button>
            <button 
              @click="localSettings.tonality = 'professional'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.tonality === 'professional' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              专业
            </button>
            <button 
              @click="localSettings.tonality = 'academic'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.tonality === 'academic' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              学术
            </button>
          </div>
        </div>
        
        <!-- 引用和参考 -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">引用和参考</label>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="includeCitations" 
              v-model="localSettings.includeCitations"
              class="rounded border-gray-300 text-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label for="includeCitations" class="ml-2 text-sm">包含引用和页码参考</label>
          </div>
        </div>
        
        <!-- 自动建议和通知 -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">自动建议和通知</label>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="autoSuggestQuestions" 
              v-model="localSettings.autoSuggestQuestions"
              class="rounded border-gray-300 text-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label for="autoSuggestQuestions" class="ml-2 text-sm">显示推荐问题</label>
          </div>
          <div class="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="notifyBookmarkReferences" 
              v-model="localSettings.notifyBookmarkReferences"
              class="rounded border-gray-300 text-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label for="notifyBookmarkReferences" class="ml-2 text-sm">提示相关书签引用</label>
          </div>
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="notifyNoteReferences" 
              v-model="localSettings.notifyNoteReferences"
              class="rounded border-gray-300 text-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label for="notifyNoteReferences" class="ml-2 text-sm">提示相关笔记引用</label>
          </div>
        </div>
        
        <!-- 主题设置 -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">界面主题</label>
          <div class="flex space-x-2">
            <button 
              @click="localSettings.theme = 'light'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              浅色
            </button>
            <button 
              @click="localSettings.theme = 'dark'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              深色
            </button>
            <button 
              @click="localSettings.theme = 'auto'" 
              class="flex-1 px-3 py-2 rounded-md text-sm text-center focus:outline-none transition-colors"
              :class="localSettings.theme === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            >
              自动
            </button>
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
        <button @click="$emit('close')" class="px-4 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors">
          取消
        </button>
        <button @click="saveAndClose" class="px-4 py-2 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none transition-colors">
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
