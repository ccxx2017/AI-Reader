<template>
  <div class="history-timeline mt-3">
    <div class="relative pl-6 border-l-2 border-gray-700">
      <div v-for="(book, index) in filteredReadingHistory" :key="`timeline-${book.id}`" class="mb-4 relative">
        <!-- 时间线节点 -->
        <div class="timeline-node absolute top-0 left-0 transform -translate-x-4 w-6 h-6 bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center">
          <i class="fas fa-book text-blue-500 text-xs"></i>
        </div>
        
        <!-- 时间线内容 -->
        <div class="timeline-content pb-2">
          <div class="text-xs text-gray-400 mb-1">
            {{ formatTimestamp(book.lastRead) }}
          </div>
          
          <!-- 书籍卡片 -->
          <div class="book-card bg-gray-800/60 rounded-lg overflow-hidden hover:bg-gray-700/40 transition-colors duration-200">
            <div class="p-2 flex items-center">
              <!-- 书籍封面 -->
              <div class="w-10 h-14 bg-gray-700 rounded-sm overflow-hidden mr-2 flex-shrink-0 flex items-center justify-center">
                <i class="fas fa-book text-blue-400"></i>
              </div>
              
              <!-- 书籍信息 -->
              <div class="flex-grow">
                <div class="text-sm font-medium text-blue-300 mb-0.5">{{ book.title }}</div>
                <div class="text-xs text-gray-300 mb-1">{{ book.author }}</div>
                <div class="flex text-xs text-gray-400">
                  <span>进度: {{ book.progress }}%</span>
                  <span class="mx-1.5">|</span>
                  <span>已读: {{ book.totalReadingTime }}分钟</span>
                </div>
              </div>
              
              <!-- 继续阅读按钮 -->
              <div>
                <button @click="$emit('continueReading', book)" class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors">
                  继续阅读
                </button>
              </div>
            </div>
            
            <!-- 会话历史 -->
            <div v-if="book.sessions && book.sessions.length > 0" class="px-2 pb-2">
              <div class="text-xs text-gray-400 mb-1">阅读会话</div>
              <div class="pl-2 border-l border-gray-700 space-y-1.5">
                <div 
                  v-for="(session, sessionIndex) in book.sessions" 
                  :key="`session-${book.id}-${sessionIndex}`"
                  class="text-xs text-gray-300"
                >
                  <div class="flex justify-between">
                    <span>{{ formatTimestamp(session.date) }}</span>
                    <span>{{ session.duration }}分钟</span>
                  </div>
                  <div class="text-xs text-gray-400">
                    阅读了 {{ session.pagesRead.length }} 页，添加了 {{ session.notes }} 条笔记
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  filteredReadingHistory: {
    type: Array,
    default: () => []
  }
});

// 格式化时间戳显示
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date >= today) return '今天';
  if (date >= yesterday) return '昨天';
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}天前`;
  
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.timeline-node {
  z-index: 1;
}

.timeline-node::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: 12px;
  height: 1px;
  background-color: rgba(59, 130, 246, 0.5);
}

.timeline-content {
  position: relative;
  z-index: 0;
}
</style>