import { ref, computed } from 'vue';
import { useBookStore } from '../store/modules/book';

export function useBookNavigation() {
  const bookStore = useBookStore();
  
  // 当前页面的加载状态
  const isPageLoading = ref(false);
  
  // 滚动位置
  const scrollPosition = ref(0);
  
  // 计算当前进度百分比
  const progressPercentage = computed(() => {
    if (!bookStore.currentBook || bookStore.totalPages === 0) return 0;
    return (bookStore.currentPage / bookStore.totalPages) * 100;
  });
  
  // 计算当前章节
  const currentChapter = computed(() => {
    if (!bookStore.currentBook || !bookStore.chapters.length) return null;
    
    // 查找当前页所在的章节
    for (let i = bookStore.chapters.length - 1; i >= 0; i--) {
      if (bookStore.currentPage >= bookStore.chapters[i].startPage) {
        return bookStore.chapters[i];
      }
    }
    
    // 如果没有找到，默认返回第一章
    return bookStore.chapters[0];
  });
  
  // 切换到指定页面
  async function goToPage(pageNumber) {
    if (pageNumber === bookStore.currentPage) return;
    
    // 验证页码是否有效
    if (pageNumber < 1 || pageNumber > bookStore.totalPages) {
      console.error('页码无效:', pageNumber);
      return;
    }
    
    try {
      isPageLoading.value = true;
      await bookStore.loadPage(pageNumber);
      // 重置滚动位置
      scrollPosition.value = 0;
    } catch (error) {
      console.error('加载页面失败:', error);
    } finally {
      isPageLoading.value = false;
    }
  }
  
  // 前往上一页
  async function goToPreviousPage() {
    if (bookStore.currentPage > 1) {
      await goToPage(bookStore.currentPage - 1);
    }
  }
  
  // 前往下一页
  async function goToNextPage() {
    if (bookStore.currentPage < bookStore.totalPages) {
      await goToPage(bookStore.currentPage + 1);
    }
  }
  
  // 前往指定章节
  async function goToChapter(chapterId) {
    const chapter = bookStore.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      await goToPage(chapter.startPage);
    }
  }
  
  // 更新滚动位置
  function updateScrollPosition(position) {
    scrollPosition.value = position;
  }
  
  // 切换章节导航面板
  function toggleChapterNavPanel() {
    bookStore.toggleChapterPanel();
  }
  
  // 跳转到书籍的第一页
  async function goToFirstPage() {
    await goToPage(1);
  }
  
  // 跳转到书籍的最后一页
  async function goToLastPage() {
    await goToPage(bookStore.totalPages);
  }
  
  // 搜索特定内容并跳转到对应页面
  async function searchAndNavigate(searchText) {
    if (!searchText || !searchText.trim()) return null;
    
    try {
      isPageLoading.value = true;
      const result = await bookStore.searchInBook(searchText);
      
      if (result.matches.length > 0) {
        // 导航到第一个匹配项所在的页面
        await goToPage(result.matches[0].page);
        return result;
      }
      
      return result;
    } catch (error) {
      console.error('搜索失败:', error);
      return { matches: [] };
    } finally {
      isPageLoading.value = false;
    }
  }
  
  return {
    isPageLoading,
    scrollPosition,
    progressPercentage,
    currentChapter,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    goToChapter,
    updateScrollPosition,
    toggleChapterNavPanel,
    goToFirstPage,
    goToLastPage,
    searchAndNavigate
  };
}
