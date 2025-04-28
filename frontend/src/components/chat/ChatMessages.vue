<template>
  <!-- 聊天内容区域 -->
  <div class="flex-grow overflow-y-auto p-4" ref="chatContainer">
    <div class="space-y-4">
      <!-- 消息列表 -->
      <div v-for="message in messages" :key="message.id">
        <!-- 系统消息 -->
        <div v-if="message.type === 'system'" class="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block max-w-[85%]">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ message.content }}
          </p>
        </div>
        
        <!-- 用户消息 -->
        <div v-if="message.type === 'user'" class="flex justify-end">
          <div class="py-2 px-3 bg-primary text-white rounded-lg inline-block max-w-[85%]">
            <p class="text-sm">
              {{ message.content }}
            </p>
            <span class="text-xs text-gray-200 mt-1 block text-right">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
        
        <!-- AI助手消息 - 可折叠 -->
        <div v-if="message.type === 'assistant'" class="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block max-w-[85%] relative group">
          <!-- 收藏按钮 -->
          <button @click="$emit('toggle-favorite')" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
            <i class="far" :class="message.favorited ? 'fas fa-star text-yellow-500' : 'fa-star text-xs text-gray-500 dark:text-gray-400'"></i>
          </button>
          
          <!-- 折叠/展开按钮 -->
          <div v-if="isLongMessage" class="flex justify-between items-center mb-1">
            <span class="text-xs text-gray-500 dark:text-gray-400">AI助手</span>
            <button @click="$emit('toggle-message-collapse')" class="text-xs text-blue-500 hover:underline focus:outline-none">
              {{ isMessageCollapsed ? '展开全部' : '折叠内容' }}
            </button>
          </div>
          
          <div :class="{'max-h-28 overflow-hidden': isMessageCollapsed && isLongMessage}">
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {{ message.content }}
            </p>
          </div>
          
          <!-- 渐变遮罩，在折叠状态下显示 -->
          <div v-if="isMessageCollapsed && isLongMessage" class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent"></div>
          
          <!-- 解释深度调节 -->
          <div class="flex mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button @click="$emit('explain-simpler')" class="text-xs text-blue-500 hover:underline mr-3 focus:outline-none">
              <i class="fas fa-arrow-down mr-1"></i>更简单解释
            </button>
            <button @click="$emit('explain-detailed')" class="text-xs text-blue-500 hover:underline focus:outline-none">
              <i class="fas fa-arrow-up mr-1"></i>更详细解释
            </button>
          </div>
          
          <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      
      <!-- AI助手消息（思考中） -->
      <div v-if="isThinking" class="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
        <p class="text-sm text-gray-700 dark:text-gray-300 thinking-dots">思考中</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  messages: {
    type: Array,
    required: true
  },
  isThinking: {
    type: Boolean,
    default: false
  },
  isMessageCollapsed: {
    type: Boolean,
    default: true
  },
  isLongMessage: {
    type: Boolean,
    default: true
  }
});

defineEmits([
  'toggle-message-collapse',
  'toggle-favorite', 
  'explain-simpler',
  'explain-detailed'
]);

// 格式化时间显示
function formatTime(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffMinutes = Math.floor((now - messageTime) / (1000 * 60));
  
  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}天前`;
  
  // 对于更早的消息，显示具体日期
  return messageTime.toLocaleDateString();
}
</script>

<style scoped>
.thinking-dots::after {
  content: '...';
  display: inline-block;
  animation: thinking 1.5s infinite;
  width: 15px;
  text-align: left;
}

@keyframes thinking {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
  100% { content: '.'; }
}
</style>
