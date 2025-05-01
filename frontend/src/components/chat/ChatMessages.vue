<template>
  <!-- 聊天内容区域 -->
  <div class="chat-messages-container" ref="chatContainer">
    <div class="messages-list">
      <!-- 消息列表 -->
      <div v-for="message in messages" :key="message.id">
        <!-- 系统消息 -->
        <div v-if="message.type === 'system'" class="system-message">
          <p class="message-text">
            {{ message.content }}
          </p>
        </div>
        
        <!-- 用户消息 -->
        <div v-if="message.type === 'user'" class="user-message-container">
          <div class="user-message">
            <p class="message-text">
              {{ message.content }}
            </p>
            <span class="message-time user-message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
        
        <!-- AI助手消息 - 可折叠 -->
        <div v-if="message.type === 'assistant'" class="assistant-message message-with-actions">
          <!-- 收藏按钮 -->
          <button @click="$emit('toggle-favorite')" class="favorite-button">
            <i class="far" :class="message.favorited ? 'fas fa-star favorited' : 'fa-star not-favorited'"></i>
          </button>
          
          <!-- 折叠/展开按钮 -->
          <div v-if="isLongMessage" class="message-header">
            <span class="sender-name">AI助手</span>
            <button @click="$emit('toggle-message-collapse')" class="collapse-button">
              {{ isMessageCollapsed ? '展开全部' : '折叠内容' }}
            </button>
          </div>
          
          <div :class="{'collapsed-content': isMessageCollapsed && isLongMessage}">
            <p class="message-text">
              {{ message.content }}
            </p>
          </div>
          
          <!-- 渐变遮罩，在折叠状态下显示 -->
          <div v-if="isMessageCollapsed && isLongMessage" class="gradient-mask"></div>
          
          <!-- 解释深度调节 -->
          <div class="message-actions">
            <button @click="$emit('explain-simpler')" class="action-button">
              <i class="fas fa-arrow-down icon-margin-right"></i>更简单解释
            </button>
            <button @click="$emit('explain-detailed')" class="action-button">
              <i class="fas fa-arrow-up icon-margin-right"></i>更详细解释
            </button>
          </div>
          
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      
      <!-- AI助手消息（思考中） -->
      <div v-if="isThinking" class="system-message">
        <p class="message-text thinking-dots">思考中</p>
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
.chat-messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.system-message {
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  display: inline-block;
  max-width: 85%;
}

.dark .system-message {
  background-color: #1f2937;
}

.user-message-container {
  display: flex;
  justify-content: flex-end;
}

.user-message {
  padding: 0.5rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  display: inline-block;
  max-width: 85%;
}

.user-message-time {
  color: rgba(255, 255, 255, 0.9);
}

.assistant-message {
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  display: inline-block;
  max-width: 85%;
  position: relative;
}

.dark .assistant-message {
  background-color: #1f2937;
}

.message-with-actions:hover .favorite-button {
  opacity: 1;
}

.favorite-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.favorite-button:hover {
  background-color: #e5e7eb;
}

.dark .favorite-button:hover {
  background-color: #374151;
}

.favorited {
  color: #eab308;
}

.not-favorited {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .not-favorited {
  color: #9ca3af;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.sender-name {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .sender-name {
  color: #9ca3af;
}

.collapse-button {
  font-size: 0.75rem;
  color: #3b82f6;
  background: transparent;
  border: none;
  cursor: pointer;
}

.collapse-button:hover {
  text-decoration: underline;
}

.collapsed-content {
  max-height: 7rem;
  overflow: hidden;
}

.gradient-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rem;
  background: linear-gradient(to top, #f3f4f6, transparent);
}

.dark .gradient-mask {
  background: linear-gradient(to top, #1f2937, transparent);
}

.message-actions {
  display: flex;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .message-actions {
  border-top-color: #374151;
}

.action-button {
  font-size: 0.75rem;
  color: #3b82f6;
  margin-right: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.dark .action-button {
  color: #60a5fa;
}

.action-button:hover {
  text-decoration: underline;
}

.action-button:focus {
  outline: none;
}

.icon-margin-right {
  margin-right: 0.25rem;
}

.message-text {
  font-size: 0.875rem;
  color: #374151;
  white-space: pre-line;
}

.dark .message-text {
  color: #d1d5db;
}

.message-time {
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
  margin-top: 0.25rem;
}

.dark .message-time {
  color: #9ca3af;
}

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
