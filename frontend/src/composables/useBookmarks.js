import { ref, computed } from 'vue';
import { useBookStore } from '../store/modules/book';

export function useBookmarks() {
  const bookStore = useBookStore();
  
  // 当前页面是否已添加书签
  const isCurrentPageBookmarked = computed(() => {
    if (!bookStore.currentBook) return false;
    
    return bookStore.bookmarks.some(
      bookmark => bookmark.page === bookStore.currentPage
    );
  });
  
  // 获取当前书籍的所有书签，按页码排序
  const sortedBookmarks = computed(() => {
    return [...bookStore.bookmarks].sort((a, b) => a.page - b.page);
  });
  
  // 添加书签到当前页
  function addBookmark(text = '', color = 'blue') {
    if (!bookStore.currentBook) return null;
    
    // 检查是否已存在
    if (isCurrentPageBookmarked.value) {
      console.log('当前页面已添加书签');
      return null;
    }
    
    // 如果没有提供文本，使用页面的前100个字符作为描述
    const description = text || bookStore.currentPageContent.slice(0, 100) + '...';
    
    // 创建书签对象
    const bookmark = {
      id: `bookmark-${Date.now()}`,
      page: bookStore.currentPage,
      description,
      dateAdded: new Date().toISOString(),
      color
    };
    
    // 添加书签
    bookStore.addBookmark(bookmark);
    
    return bookmark;
  }
  
  // 添加书签到当前页，并高亮选中的文本
  function addBookmarkWithSelection(selectedText, color = 'yellow') {
    if (!selectedText || !bookStore.currentBook) return null;
    
    // 创建书签对象
    const bookmark = {
      id: `bookmark-${Date.now()}`,
      page: bookStore.currentPage,
      description: selectedText.length > 150 ? selectedText.slice(0, 150) + '...' : selectedText,
      selectedText,
      dateAdded: new Date().toISOString(),
      color
    };
    
    // 添加书签
    bookStore.addBookmark(bookmark);
    
    return bookmark;
  }
  
  // 编辑书签
  function editBookmark(bookmarkId, updates) {
    if (!bookStore.currentBook) return false;
    
    return bookStore.updateBookmark(bookmarkId, updates);
  }
  
  // 删除书签
  function removeBookmark(bookmarkId) {
    if (!bookStore.currentBook) return false;
    
    return bookStore.removeBookmark(bookmarkId);
  }
  
  // 切换当前页面的书签状态
  function toggleBookmark(color = 'blue') {
    if (isCurrentPageBookmarked.value) {
      // 找到当前页面的书签
      const bookmark = bookStore.bookmarks.find(bm => bm.page === bookStore.currentPage);
      if (bookmark) {
        return removeBookmark(bookmark.id);
      }
      return false;
    } else {
      return !!addBookmark('', color);
    }
  }
  
  // 跳转到指定书签
  async function goToBookmark(bookmarkId) {
    const bookmark = bookStore.bookmarks.find(bm => bm.id === bookmarkId);
    
    if (bookmark) {
      try {
        await bookStore.loadPage(bookmark.page);
        
        // 如果书签有选中的文本，尝试在页面上高亮显示它
        if (bookmark.selectedText) {
          setTimeout(() => {
            // 这部分可能需要DOM操作，实际实现时可能需要调整
            const contentElement = document.querySelector('.book-content');
            if (contentElement) {
              const html = contentElement.innerHTML;
              const safeText = bookmark.selectedText
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义特殊字符
              
              const replacedHtml = html.replace(
                new RegExp(`(${safeText})`, 'g'),
                `<span class="bookmark-highlight" style="background-color:${bookmark.color};">$1</span>`
              );
              
              contentElement.innerHTML = replacedHtml;
            }
          }, 100);
        }
        
        return true;
      } catch (error) {
        console.error('跳转到书签失败:', error);
        return false;
      }
    }
    
    return false;
  }
  
  // 导出书签
  function exportBookmarks() {
    if (!bookStore.currentBook || !bookStore.bookmarks.length) {
      return null;
    }
    
    const bookmarksData = {
      bookId: bookStore.currentBook.id,
      bookTitle: bookStore.currentBook.title,
      bookmarks: bookStore.bookmarks,
      exportDate: new Date().toISOString()
    };
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(bookmarksData, null, 2);
    
    // 创建Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${bookStore.currentBook.title.replace(/\s+/g, '-')}.json`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return bookmarksData;
  }
  
  // 导入书签
  function importBookmarks(jsonData) {
    try {
      let data;
      
      if (typeof jsonData === 'string') {
        // 尝试解析JSON字符串
        data = JSON.parse(jsonData);
      } else {
        // 已经是对象
        data = jsonData;
      }
      
      // 验证数据结构
      if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
        throw new Error('无效的书签数据格式');
      }
      
      // 验证书籍ID是否匹配
      if (bookStore.currentBook && data.bookId !== bookStore.currentBook.id) {
        console.warn('导入的书签可能不适用于当前书籍');
      }
      
      // 导入书签
      data.bookmarks.forEach(bookmark => {
        // 检查是否已存在相同页码的书签
        const exists = bookStore.bookmarks.some(bm => bm.page === bookmark.page);
        
        if (!exists) {
          // 添加新书签
          bookStore.addBookmark({
            ...bookmark,
            id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
        }
      });
      
      return true;
    } catch (error) {
      console.error('导入书签失败:', error);
      return false;
    }
  }
  
  return {
    isCurrentPageBookmarked,
    sortedBookmarks,
    addBookmark,
    addBookmarkWithSelection,
    editBookmark,
    removeBookmark,
    toggleBookmark,
    goToBookmark,
    exportBookmarks,
    importBookmarks
  };
}
