<template>
  <!-- 顶部控制栏 -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="text-lg font-medium">AI 助手</div>
    <div class="flex space-x-2">
      <!-- 个性化设置 -->
      <button @click="$emit('open-settings')" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="个性化设置">
        <i class="fas fa-sliders-h text-gray-600 dark:text-gray-300"></i>
      </button>
      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="聊天记录">
        <i class="fas fa-history text-gray-600 dark:text-gray-300"></i>
      </button>
      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="设置">
        <i class="fas fa-cog text-gray-600 dark:text-gray-300"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['open-settings']);
</script>
