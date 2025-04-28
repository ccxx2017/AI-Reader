<template>
  <div>
    <h3 class="text-base font-medium text-blue-400 mb-1">{{ title }}</h3>
    <div class="text-sm text-gray-300 mb-2">
      <span>作者: {{ author }}</span>
    </div>
    <div class="flex justify-between text-sm text-gray-400 mb-2">
      <span>阅读进度: {{ progress }}%</span>
      <span>第25/102页</span>
    </div>
    <div class="text-xs text-gray-500 mb-1.5">
      <span>今日: <span class="text-green-400">30分钟</span></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  }
});
</script>