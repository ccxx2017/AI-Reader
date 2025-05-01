<template>
  <div class="history-list">
    <div 
      v-for="book in filteredReadingHistory" 
      :key="book.id" 
      class="book-item"
    >
      <!-- 书籍标题栏 - 可点击展开/折叠 -->
      <div 
        @click="toggleBookHistory(book.id)"
        class="book-header"
      >
        <!-- 书籍封面 -->
        <div class="book-cover">
          <i class="fas fa-book book-icon"></i>
        </div>
        
        <!-- 书籍信息 -->
        <div class="book-info">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-author">{{ book.author }}</div>
          <div class="book-meta">
            <span>上次阅读: {{ formatRelativeTime(book.lastRead) }}</span>
            <span class="meta-divider">|</span>
            <span>进度: {{ book.progress }}%</span>
          </div>
        </div>
        
        <!-- 展开/折叠指示器 -->
        <div class="expand-indicator">
          <i class="fas fa-chevron-down chevron-icon"
             :class="{ 'rotate-icon': book.expanded }"></i>
        </div>
        
        <!-- 继续阅读按钮 -->
        <button 
          @click.stop="$emit('continueReading', book)" 
          class="continue-button"
        >
          继续阅读
        </button>
      </div>
      
      <!-- 展开的详细信息 -->
      <div 
        v-if="book.expanded" 
        class="book-details"
      >
        <!-- 会话记录标题 -->
        <div class="sessions-header">
          <div class="sessions-title">阅读会话记录</div>
          <span class="sessions-count">
            共 {{ book.sessions ? book.sessions.length : 0 }} 次会话
          </span>
        </div>
        
        <!-- 会话记录列表 -->
        <div v-if="book.sessions && book.sessions.length > 0" class="sessions-list">
          <div 
            v-for="(session, sessionIndex) in book.sessions" 
            :key="`session-${book.id}-${sessionIndex}`"
            class="session-item"
          >
            <div class="session-header">
              <span class="session-date">{{ formatTimestamp(session.date) }}</span>
              <span class="session-duration">阅读时长: {{ session.duration }}分钟</span>
            </div>
            <div class="session-pages">
              阅读了 {{ session.pagesRead.join(', ') }} 页
            </div>
            <div v-if="session.notes > 0" class="session-notes">
              添加了 {{ session.notes }} 条笔记
            </div>
          </div>
        </div>
        
        <!-- 没有会话记录时的提示 -->
        <div v-else class="no-sessions">
          <i class="fas fa-info-circle info-icon"></i> 暂无详细会话记录
        </div>
        
        <!-- 书籍统计信息 -->
        <div class="book-stats">
          <span>总阅读时长: {{ book.totalReadingTime }}分钟</span>
          <span>首次阅读: {{ formatTimestamp(book.sessions && book.sessions.length > 0 ? book.sessions[book.sessions.length - 1].date : book.lastRead) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  filteredReadingHistory: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['toggleBookHistory', 'continueReading']);

// 切换书籍展开/折叠状态
function toggleBookHistory(bookId) {
  emit('toggleBookHistory', bookId);
}

// 格式化相对时间（例如：今天、昨天、3天前）
function formatRelativeTime(timestamp) {
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

// 格式化时间戳为更详细的显示
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
  
  const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  if (isToday) {
    return `今天 ${timeStr}`;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() && 
                      date.getMonth() === yesterday.getMonth() && 
                      date.getFullYear() === yesterday.getFullYear();
  
  if (isYesterday) {
    return `昨天 ${timeStr}`;
  }
  
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${timeStr}`;
}
</script>

<style scoped>
.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-item {
  background-color: rgba(31, 41, 55, 0.6); /* bg-gray-800/60 */
  border-radius: 0.5rem;
  overflow: hidden;
}

.book-header {
  padding: 0.625rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.book-header:hover {
  background-color: rgba(55, 65, 81, 0.4); /* hover:bg-gray-700/40 */
}

.book-cover {
  width: 2.5rem;
  height: 3.5rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.125rem;
  overflow: hidden;
  margin-right: 0.75rem;
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

.expand-indicator {
  margin-right: 0.5rem;
}

.chevron-icon {
  color: #9ca3af; /* text-gray-400 */
  transition: transform 0.2s;
}

.book-header:hover .chevron-icon {
  color: #d1d5db; /* group-hover:text-gray-300 */
}

.rotate-icon {
  transform: rotate(180deg);
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

.book-details {
  border-top: 1px solid #374151; /* border-gray-700 */
  padding: 0.625rem;
  font-size: 0.875rem;
}

.sessions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.sessions-title {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.sessions-count {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: rgba(30, 58, 138, 0.7); /* bg-blue-900/70 */
  color: #93c5fd; /* text-blue-300 */
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.session-item {
  font-size: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(55, 65, 81, 0.4); /* bg-gray-700/40 */
  border-radius: 0.25rem;
}

.session-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.session-date {
  color: #d1d5db; /* text-gray-300 */
}

.session-duration {
  color: #9ca3af; /* text-gray-400 */
}

.session-pages, .session-notes {
  color: #9ca3af; /* text-gray-400 */
}

.no-sessions {
  text-align: center;
  padding: 0.5rem 0;
  color: #6b7280; /* text-gray-500 */
  font-size: 0.75rem;
}

.info-icon {
  margin-right: 0.25rem;
}

.book-stats {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #374151; /* border-gray-700 */
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}
</style>