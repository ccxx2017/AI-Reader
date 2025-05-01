<template>
  <div class="history-timeline">
    <div class="timeline-container">
      <div v-for="(book, index) in filteredReadingHistory" :key="`timeline-${book.id}`" class="timeline-item">
        <!-- 时间线节点 -->
        <div class="timeline-node">
          <i class="fas fa-book node-icon"></i>
        </div>
        
        <!-- 时间线内容 -->
        <div class="timeline-content">
          <div class="timestamp">
            {{ formatTimestamp(book.lastRead) }}
          </div>
          
          <!-- 书籍卡片 -->
          <div class="book-card">
            <div class="book-header">
              <!-- 书籍封面 -->
              <div class="book-cover">
                <i class="fas fa-book book-icon"></i>
              </div>
              
              <!-- 书籍信息 -->
              <div class="book-info">
                <div class="book-title">{{ book.title }}</div>
                <div class="book-author">{{ book.author }}</div>
                <div class="book-meta">
                  <span>进度: {{ book.progress }}%</span>
                  <span class="meta-divider">|</span>
                  <span>已读: {{ book.totalReadingTime }}分钟</span>
                </div>
              </div>
              
              <!-- 继续阅读按钮 -->
              <div>
                <button @click="$emit('continueReading', book)" class="continue-button">
                  继续阅读
                </button>
              </div>
            </div>
            
            <!-- 会话历史 -->
            <div v-if="book.sessions && book.sessions.length > 0" class="sessions-container">
              <div class="sessions-title">阅读会话</div>
              <div class="sessions-list">
                <div 
                  v-for="(session, sessionIndex) in book.sessions" 
                  :key="`session-${book.id}-${sessionIndex}`"
                  class="session-item"
                >
                  <div class="session-header">
                    <span>{{ formatTimestamp(session.date) }}</span>
                    <span>{{ session.duration }}分钟</span>
                  </div>
                  <div class="session-details">
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
.history-timeline {
  margin-top: 0.75rem;
}

.timeline-container {
  position: relative;
  padding-left: 1.5rem;
  border-left: 2px solid #374151; /* border-gray-700 */
}

.timeline-item {
  margin-bottom: 1rem;
  position: relative;
}

.timeline-node {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(-1rem);
  width: 1.5rem;
  height: 1.5rem;
  background-color: #1f2937; /* bg-gray-800 */
  border: 2px solid #3b82f6; /* border-blue-500 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.node-icon {
  color: #3b82f6; /* text-blue-500 */
  font-size: 0.75rem;
}

.timeline-content {
  position: relative;
  z-index: 0;
  padding-bottom: 0.5rem;
}

.timestamp {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.25rem;
}

.book-card {
  background-color: rgba(31, 41, 55, 0.6); /* bg-gray-800/60 */
  border-radius: 0.5rem;
  overflow: hidden;
  transition: background-color 0.2s;
}

.book-card:hover {
  background-color: rgba(55, 65, 81, 0.4); /* hover:bg-gray-700/40 */
}

.book-header {
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.book-cover {
  width: 2.5rem;
  height: 3.5rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.125rem;
  overflow: hidden;
  margin-right: 0.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-icon {
  color: #60a5fa; /* text-blue-400 */
}

.book-info {
  flex-grow: 1;
}

.book-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #93c5fd; /* text-blue-300 */
  margin-bottom: 0.125rem;
}

.book-author {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
  margin-bottom: 0.25rem;
}

.book-meta {
  display: flex;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

.meta-divider {
  margin: 0 0.375rem;
}

.continue-button {
  font-size: 0.75rem;
  background-color: #2563eb; /* bg-blue-600 */
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: none;
  transition: background-color 0.2s;
  cursor: pointer;
}

.continue-button:hover {
  background-color: #3b82f6; /* hover:bg-blue-500 */
}

.sessions-container {
  padding: 0 0.5rem 0.5rem 0.5rem;
}

.sessions-title {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
  margin-bottom: 0.25rem;
}

.sessions-list {
  padding-left: 0.5rem;
  border-left: 1px solid #374151; /* border-gray-700 */
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.session-item {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.session-header {
  display: flex;
  justify-content: space-between;
}

.session-details {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}
</style>