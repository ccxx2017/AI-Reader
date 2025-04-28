<template>
  <div class="mb-4 bg-gray-800/80 p-3 rounded-lg border border-gray-700/50">
    <div class="text-sm text-blue-300 font-medium mb-2 flex items-center">
      <i class="fas fa-columns text-blue-400 mr-1.5"></i>
      <span>界面设置</span>
    </div>
    
    <div class="mb-3">
      <div class="text-xs text-gray-400 mb-1.5">主题</div>
      <div class="flex items-center space-x-2">
        <button 
          class="px-2 py-1 text-xs rounded border border-gray-700 focus:outline-none transition-colors"
          :class="currentTheme === '默认' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          @click="$emit('update:currentTheme', '默认')"
        >
          默认
        </button>
        <button 
          class="px-2 py-1 text-xs rounded border border-gray-700 focus:outline-none transition-colors"
          :class="currentTheme === '深色' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          @click="$emit('update:currentTheme', '深色')"
        >
          深色
        </button>
        <button 
          class="px-2 py-1 text-xs rounded border border-gray-700 focus:outline-none transition-colors"
          :class="currentTheme === '柔和' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
          @click="$emit('update:currentTheme', '柔和')"
        >
          柔和
        </button>
      </div>
    </div>
    
    <div class="mb-3">
      <div class="text-xs text-gray-400 mb-1.5">边栏区域</div>
      <div class="space-y-2">
        <div v-for="(section, key) in sidebarSections" :key="key" class="flex items-center justify-between p-1.5 bg-gray-700/50 rounded">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              :id="`section-${key}`" 
              v-model="section.visible" 
              class="form-checkbox h-3 w-3 text-blue-500 rounded border-gray-600 focus:ring-0 focus:ring-offset-0"
            >
            <label :for="`section-${key}`" class="ml-2 text-xs text-gray-300">{{ section.label }}</label>
          </div>
          <div class="flex items-center space-x-1">
            <button 
              @click="$emit('move-section-up', key)" 
              class="p-1 text-xs text-gray-400 hover:text-blue-400 focus:outline-none"
              :disabled="section.order <= 1"
              :class="{ 'opacity-30 cursor-not-allowed': section.order <= 1 }"
            >
              <i class="fas fa-arrow-up"></i>
            </button>
            <button 
              @click="$emit('move-section-down', key)" 
              class="p-1 text-xs text-gray-400 hover:text-blue-400 focus:outline-none"
              :disabled="section.order >= Object.keys(sidebarSections).length"
              :class="{ 'opacity-30 cursor-not-allowed': section.order >= Object.keys(sidebarSections).length }"
            >
              <i class="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end space-x-2">
      <button 
        @click="$emit('close')" 
        class="px-3 py-1 text-xs text-gray-300 border border-gray-700 rounded hover:bg-gray-700 focus:outline-none"
      >
        取消
      </button>
      <button 
        @click="$emit('save-settings')" 
        class="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-500 focus:outline-none"
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
