<template>
  <div class="reading-history-panel">
    <div class="panel-header">
      <h2 class="panel-title">阅读历史</h2>
      <!-- 视图切换按钮 -->
      <div class="view-mode-switcher">
        <button 
          @click="historyViewMode = 'list'" 
          class="view-mode-btn" 
          :class="{ 'active': historyViewMode === 'list' }"
          title="列表视图"
        >
          <i class="fas fa-list"></i>
        </button>
        <button 
          @click="historyViewMode = 'timeline'" 
          class="view-mode-btn" 
          :class="{ 'active': historyViewMode === 'timeline' }"
          title="时间线视图"
        >
          <i class="fas fa-stream"></i>
        </button>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <HistorySearch 
      v-model="searchQuery"
      @filter="updateFilter"
    />
    
    <!-- 时间线视图 -->
    <HistoryTimelineView 
      v-if="historyViewMode === 'timeline'"
      :filteredReadingHistory="filteredReadingHistory"
    />
    
    <!-- 列表视图 -->
    <HistoryListView 
      v-if="historyViewMode === 'list'"
      :filteredReadingHistory="filteredReadingHistory"
      @toggleBookHistory="toggleBookHistory"
      @continueReading="continueReading"
    />
    
    <!-- 没有历史记录时的提示 -->
    <div v-if="filteredReadingHistory.length === 0" class="empty-history">
      <i class="fas fa-search empty-icon"></i>
      <p>没有找到匹配的阅读历史记录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HistorySearch from './HistorySearch.vue';
import HistoryTimelineView from './HistoryTimelineView.vue';
import HistoryListView from './HistoryListView.vue';

// 视图模式：list 或 timeline
const historyViewMode = ref('list');

// 搜索查询
const searchQuery = ref('');

// 筛选条件
const filter = ref({
  dateRange: null,
  sortBy: 'recent'
});

// 阅读历史数据
const readingHistory = ref([
  {
    id: 'book1',
    title: '量子计算基础',
    author: 'Richard P. Feynman',
    cover: null,
    progress: 25,
    lastRead: new Date().getTime() - 30 * 60 * 1000,
    totalReadingTime: 120,
    expanded: false,
    sessions: [
      {
        date: new Date().getTime() - 30 * 60 * 1000,
        duration: 30,
        pagesRead: [24, 25],
        notes: 2
      },
      {
        date: new Date().getTime() - 24 * 60 * 60 * 1000,
        duration: 45,
        pagesRead: [22, 23, 24],
        notes: 1
      }
    ]
  },
  {
    id: 'book2',
    title: '人工智能导论',
    author: 'Stuart Russell',
    cover: null,
    progress: 45,
    lastRead: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    totalReadingTime: 280,
    expanded: false,
    sessions: [
      {
        date: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
        duration: 40,
        pagesRead: [44, 45, 46],
        notes: 3
      }
    ]
  }
]);

// 过滤阅读历史
const filteredReadingHistory = computed(() => {
  let result = [...readingHistory.value];
  
  // 根据搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    );
  }
  
  // 根据日期范围筛选
  if (filter.value.dateRange) {
    // 实现日期范围筛选逻辑
  }
  
  // 排序
  if (filter.value.sortBy === 'recent') {
    result.sort((a, b) => b.lastRead - a.lastRead);
  } else if (filter.value.sortBy === 'progress') {
    result.sort((a, b) => b.progress - a.progress);
  } else if (filter.value.sortBy === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return result;
});

// 更新筛选条件
function updateFilter(newFilter) {
  filter.value = { ...filter.value, ...newFilter };
}

// 切换书籍历史记录展开/折叠状态
function toggleBookHistory(bookId) {
  const index = readingHistory.value.findIndex(book => book.id === bookId);
  if (index !== -1) {
    readingHistory.value[index].expanded = !readingHistory.value[index].expanded;
  }
}

// 继续阅读指定书籍
function continueReading(book) {
  console.log('继续阅读:', book.title);
  // 实现继续阅读功能
}
</script>

<style scoped>
.reading-history-panel {
  margin-bottom: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.view-mode-switcher {
  display: flex;
  align-items: center;
}

.view-mode-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af; /* text-gray-400 */
  transition: color 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.view-mode-btn:hover {
  color: #60a5fa; /* hover:text-blue-400 */
}

.view-mode-btn.active {
  color: #3b82f6; /* text-blue-500 */
}

.empty-history {
  padding: 2rem 0;
  text-align: center;
  color: #9ca3af; /* text-gray-400 */
}

.empty-icon {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}
</style>