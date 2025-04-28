import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useReadingStore = defineStore('reading', () => {
  // 阅读历史数据
  const readingHistory = ref([
    {
      id: '1',
      title: '深度学习基础',
      author: '张三',
      cover: 'book1.jpg',
      lastReadTime: Date.now() - 86400000 * 2, // 2天前
      totalPages: 320,
      currentPage: 45,
      progress: 14.06,
      genre: '计算机科学',
      favorite: true,
      sessions: [
        {
          id: 's1',
          date: Date.now() - 86400000 * 2,
          startPage: 38,
          endPage: 45,
          duration: 32, // 分钟
          notes: 2,
        }
      ]
    },
    {
      id: '2',
      title: '量子计算入门',
      author: '李四',
      cover: 'book2.jpg',
      lastReadTime: Date.now() - 86400000 * 5, // 5天前
      totalPages: 280,
      currentPage: 152,
      progress: 54.28,
      genre: '物理学',
      favorite: false,
      sessions: [
        {
          id: 's2',
          date: Date.now() - 86400000 * 5,
          startPage: 145,
          endPage: 152,
          duration: 45, // 分钟
          notes: 3,
        },
        {
          id: 's3',
          date: Date.now() - 86400000 * 7,
          startPage: 130,
          endPage: 145,
          duration: 50, // 分钟
          notes: 5,
        }
      ]
    }
  ]);
  
  // 阅读历史过滤设置
  const historyFilter = ref({
    searchQuery: '',
    dateFilter: 'all', // 'all', 'today', 'week', 'month'
    genreFilter: 'all', // 'all' 或特定类型
  });
  
  // 阅读历史视图模式
  const historyViewMode = ref('list'); // 'list' 或 'timeline'
  
  // 展开的书籍ID（用于列表视图）
  const expandedBookId = ref(null);
  
  // 阅读会话记录
  const currentReadingSession = ref(null);
  
  // 过滤后的阅读历史
  const filteredReadingHistory = computed(() => {
    let filtered = [...readingHistory.value];
    
    // 根据搜索查询过滤
    if (historyFilter.value.searchQuery) {
      const query = historyFilter.value.searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
      );
    }
    
    // 根据日期过滤
    if (historyFilter.value.dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const dayInMs = 86400000;
      
      switch (historyFilter.value.dateFilter) {
        case 'today':
          filtered = filtered.filter(book => book.lastReadTime >= today);
          break;
        case 'week':
          filtered = filtered.filter(book => book.lastReadTime >= today - dayInMs * 7);
          break;
        case 'month':
          filtered = filtered.filter(book => book.lastReadTime >= today - dayInMs * 30);
          break;
      }
    }
    
    // 根据类型过滤
    if (historyFilter.value.genreFilter !== 'all') {
      filtered = filtered.filter(book => book.genre === historyFilter.value.genreFilter);
    }
    
    // 根据最后阅读时间排序（最近的在前）
    return filtered.sort((a, b) => b.lastReadTime - a.lastReadTime);
  });
  
  // 切换历史记录视图模式
  function toggleHistoryViewMode() {
    historyViewMode.value = historyViewMode.value === 'list' ? 'timeline' : 'list';
  }
  
  // 切换书籍历史展开/折叠状态
  function toggleBookHistory(bookId) {
    if (expandedBookId.value === bookId) {
      expandedBookId.value = null;
    } else {
      expandedBookId.value = bookId;
    }
  }
  
  // 更新历史过滤设置
  function updateHistoryFilter(filters) {
    historyFilter.value = { ...historyFilter.value, ...filters };
  }
  
  // 开始新的阅读会话
  function startReadingSession(bookId, startPage) {
    // 查找书籍
    const book = readingHistory.value.find(b => b.id === bookId);
    if (!book) return null;
    
    // 创建新会话
    currentReadingSession.value = {
      id: `s${Date.now()}`,
      date: Date.now(),
      startPage,
      endPage: startPage,
      startTime: Date.now(),
      duration: 0,
      notes: 0,
      bookId
    };
    
    return currentReadingSession.value;
  }
  
  // 更新当前阅读会话
  function updateReadingSession(endPage, notesCount) {
    if (!currentReadingSession.value) return null;
    
    // 更新会话数据
    currentReadingSession.value.endPage = endPage;
    currentReadingSession.value.notes = notesCount;
    
    // 计算持续时间（分钟）
    const durationMs = Date.now() - currentReadingSession.value.startTime;
    currentReadingSession.value.duration = Math.round(durationMs / 60000);
    
    return currentReadingSession.value;
  }
  
  // 结束当前阅读会话
  function endReadingSession(endPage, notesCount) {
    if (!currentReadingSession.value) return null;
    
    // 更新会话数据
    updateReadingSession(endPage, notesCount);
    
    // 查找书籍
    const bookIndex = readingHistory.value.findIndex(b => b.id === currentReadingSession.value.bookId);
    if (bookIndex >= 0) {
      const book = readingHistory.value[bookIndex];
      
      // 添加会话到书籍记录
      book.sessions.push({ ...currentReadingSession.value });
      
      // 更新书籍进度
      book.currentPage = endPage;
      book.progress = (endPage / book.totalPages) * 100;
      book.lastReadTime = Date.now();
      
      // 创建书籍的副本以触发响应式更新
      readingHistory.value[bookIndex] = { ...book };
    }
    
    // 保存阅读历史
    saveReadingHistory();
    
    // 清除当前会话
    const completedSession = { ...currentReadingSession.value };
    currentReadingSession.value = null;
    
    return completedSession;
  }
  
  // 添加新书到阅读历史
  function addBookToHistory(book) {
    // 检查是否已存在
    const existingBook = readingHistory.value.find(b => b.id === book.id);
    if (existingBook) return existingBook;
    
    // 添加书籍
    const newBook = {
      id: book.id || `book-${Date.now()}`,
      title: book.title || '未命名书籍',
      author: book.author || '未知作者',
      cover: book.cover || 'default-cover.jpg',
      lastReadTime: Date.now(),
      totalPages: book.totalPages || 100,
      currentPage: book.currentPage || 1,
      progress: book.currentPage ? (book.currentPage / book.totalPages) * 100 : 1,
      genre: book.genre || '未分类',
      favorite: book.favorite || false,
      sessions: []
    };
    
    readingHistory.value.push(newBook);
    
    // 保存阅读历史
    saveReadingHistory();
    
    return newBook;
  }
  
  // 更新书籍信息
  function updateBookInfo(bookId, info) {
    // 查找书籍
    const bookIndex = readingHistory.value.findIndex(b => b.id === bookId);
    if (bookIndex < 0) return null;
    
    // 更新信息
    readingHistory.value[bookIndex] = {
      ...readingHistory.value[bookIndex],
      ...info,
      lastReadTime: info.lastReadTime || Date.now()
    };
    
    // 如果更新了当前页码，重新计算进度
    if (info.currentPage) {
      readingHistory.value[bookIndex].progress = 
        (info.currentPage / readingHistory.value[bookIndex].totalPages) * 100;
    }
    
    // 保存阅读历史
    saveReadingHistory();
    
    return readingHistory.value[bookIndex];
  }
  
  // 切换收藏状态
  function toggleFavorite(bookId) {
    // 查找书籍
    const bookIndex = readingHistory.value.findIndex(b => b.id === bookId);
    if (bookIndex < 0) return null;
    
    // 切换收藏状态
    readingHistory.value[bookIndex].favorite = !readingHistory.value[bookIndex].favorite;
    
    // 保存阅读历史
    saveReadingHistory();
    
    return readingHistory.value[bookIndex];
  }
  
  // 从历史记录中删除
  function removeFromHistory(bookId) {
    // 查找书籍索引
    const bookIndex = readingHistory.value.findIndex(b => b.id === bookId);
    if (bookIndex < 0) return null;
    
    // 移除书籍
    const removedBook = readingHistory.value.splice(bookIndex, 1)[0];
    
    // 保存阅读历史
    saveReadingHistory();
    
    return removedBook;
  }
  
  // 继续阅读指定书籍
  function continueReading(bookId) {
    // 查找书籍
    const book = readingHistory.value.find(b => b.id === bookId);
    if (!book) return null;
    
    // 更新最后阅读时间
    book.lastReadTime = Date.now();
    
    // 保存阅读历史
    saveReadingHistory();
    
    return book;
  }
  
  // 获取阅读统计数据
  function getReadingStats() {
    // 阅读数据统计
    const totalBooks = readingHistory.value.length;
    const completedBooks = readingHistory.value.filter(b => b.progress >= 99).length;
    const inProgressBooks = totalBooks - completedBooks;
    
    // 总阅读时间（分钟）
    let totalReadingTime = 0;
    let totalPages = 0;
    
    readingHistory.value.forEach(book => {
      book.sessions.forEach(session => {
        totalReadingTime += session.duration;
        totalPages += (session.endPage - session.startPage);
      });
    });
    
    // 计算平均每日阅读时间（过去30天）
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    
    let recentSessions = [];
    readingHistory.value.forEach(book => {
      book.sessions.forEach(session => {
        if (session.date >= thirtyDaysAgo.getTime()) {
          recentSessions.push(session);
        }
      });
    });
    
    // 按日期分组
    const readingByDay = {};
    recentSessions.forEach(session => {
      const day = new Date(session.date).toISOString().split('T')[0];
      if (!readingByDay[day]) {
        readingByDay[day] = 0;
      }
      readingByDay[day] += session.duration;
    });
    
    // 计算平均值（有阅读记录的天数）
    const daysWithReadingActivity = Object.keys(readingByDay).length;
    const averageDailyReading = daysWithReadingActivity 
      ? Math.round(Object.values(readingByDay).reduce((sum, time) => sum + time, 0) / daysWithReadingActivity)
      : 0;
    
    return {
      totalBooks,
      completedBooks,
      inProgressBooks,
      totalReadingTime,
      totalPages,
      averageDailyReading,
      readingByDay,
      recentSessions: recentSessions.sort((a, b) => b.date - a.date).slice(0, 10)
    };
  }
  
  // 保存阅读历史到本地存储
  function saveReadingHistory() {
    localStorage.setItem('readingHistory', JSON.stringify(readingHistory.value));
  }
  
  // 从本地存储加载阅读历史
  function loadReadingHistory() {
    const savedHistory = localStorage.getItem('readingHistory');
    if (savedHistory) {
      try {
        readingHistory.value = JSON.parse(savedHistory);
      } catch (error) {
        console.error('加载阅读历史失败:', error);
      }
    }
  }
  
  // 初始化
  function init() {
    loadReadingHistory();
  }
  
  return {
    readingHistory,
    historyFilter,
    historyViewMode,
    expandedBookId,
    currentReadingSession,
    filteredReadingHistory,
    toggleHistoryViewMode,
    toggleBookHistory,
    updateHistoryFilter,
    startReadingSession,
    updateReadingSession,
    endReadingSession,
    addBookToHistory,
    updateBookInfo,
    toggleFavorite,
    removeFromHistory,
    continueReading,
    getReadingStats,
    init
  };
});
