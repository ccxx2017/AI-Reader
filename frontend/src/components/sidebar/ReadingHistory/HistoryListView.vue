<template>
  <div class="space-y-2">
    <div 
      v-for="book in filteredReadingHistory" 
      :key="book.id" 
      class="bg-gray-800/60 rounded-lg overflow-hidden"
    >
      <!-- 书籍标题栏 - 可点击展开/折叠 -->
      <div 
        @click="toggleBookHistory(book.id)"
        class="p-2.5 flex items-center cursor-pointer hover:bg-gray-700/40 transition-colors duration-200 group"
      >
        <!-- 书籍封面 -->
        <div class="w-10 h-14 bg-gray-700 rounded-sm overflow-hidden mr-3 flex-shrink-0 flex items-center justify-center">
          <i class="fas fa-book text-blue-400"></i>
        </div>
        
        <!-- 书籍信息 -->
        <div class="flex-grow">
          <div class="text-sm font-medium text-blue-300 mb-0.5">{{ book.title }}</div>
          <div class="text-xs text-gray-300 mb-1">{{ book.author }}</div>
          <div class="flex text-xs text-gray-400">
            <span>上次阅读: {{ formatRelativeTime(book.lastRead) }}</span>
            <span class="mx-1.5">|</span>
            <span>进度: {{ book.progress }}%</span>
          </div>
        </div>
        
        <!-- 展开/折叠指示器 -->
        <div class="mr-2">
          <i class="fas fa-chevron-down text-gray-400 group-hover:text-gray-300 transition-transform duration-200"
             :class="{ 'transform rotate-180': book.expanded }"></i>
        </div>
        
        <!-- 继续阅读按钮 -->
        <button 
          @click.stop="$emit('continueReading', book)" 
          class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors"
        >
          继续阅读
        </button>
      </div>
      
      <!-- 展开的详细信息 -->
      <div 
        v-if="book.expanded" 
        class="border-t border-gray-700 p-2.5 text-sm"
      >
        <!-- 会话记录标题 -->
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs text-gray-300">阅读会话记录</div>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/70 text-blue-300">
            共 {{ book.sessions ? book.sessions.length : 0 }} 次会话
          </span>
        </div>
        
        <!-- 会话记录列表 -->
        <div v-if="book.sessions && book.sessions.length > 0" class="space-y-2">
          <div 
            v-for="(session, sessionIndex) in book.sessions" 
            :key="`session-${book.id}-${sessionIndex}`"
            class="text-xs p-2 bg-gray-700/40 rounded"
          >
            <div class="flex justify-between mb-1">
              <span class="text-gray-300">{{ formatTimestamp(session.date) }}</span>
              <span class="text-gray-400">阅读时长: {{ session.duration }}分钟</span>
            </div>
            <div class="text-gray-400">
              阅读了 {{ session.pagesRead.join(', ') }} 页
            </div>
            <div v-if="session.notes > 0" class="text-gray-400">
              添加了 {{ session.notes }} 条笔记
            </div>
          </div>
        </div>
        
        <!-- 没有会话记录时的提示 -->
        <div v-else class="text-center py-2 text-gray-500 text-xs">
          <i class="fas fa-info-circle mr-1"></i> 暂无详细会话记录
        </div>
        
        <!-- 书籍统计信息 -->
        <div class="mt-2 pt-2 border-t border-gray-700 flex justify-between text-xs text-gray-400">
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