import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBookStore = defineStore('book', () => {
  // 书籍数据
  const bookPages = ref([
    '# 深度学习基础简介\n\n深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程。通过处理大量数据，深度学习系统能够自动发现模式和特征，用于解决各种复杂的问题。\n\n## 主要应用领域\n\n* 计算机视觉\n* 自然语言处理\n* 语音识别\n* 游戏\n* 医疗诊断',
    '# 第二章：神经网络基础\n\n神经网络是深度学习的核心组件，它由多个相互连接的神经元层组成。每个神经元接收输入，对其进行加权求和，然后通过激活函数产生输出。\n\n## 激活函数\n\n激活函数为神经网络引入非线性特性，常见的激活函数包括：\n\n* ReLU (Rectified Linear Unit)\n* Sigmoid\n* Tanh'
    // 更多页面内容...
  ]);
  
  // 当前页面索引
  const currentPageIndex = ref(0);
  
  // 章节数据
  const chapters = ref([
    {
      title: '第一章：深度学习简介',
      sections: [
        { title: '1.1 什么是深度学习', page: 0 },
        { title: '1.2 应用领域', page: 0 }
      ]
    },
    {
      title: '第二章：神经网络基础',
      sections: [
        { title: '2.1 神经元模型', page: 1 },
        { title: '2.2 激活函数', page: 1 }
      ]
    }
    // 更多章节...
  ]);
  
  // 当前章节
  const currentChapter = ref(0);
  
  // 书签数据
  const bookmarks = ref([]);
  
  // 页面字体大小
  const fontSize = ref(16);
  
  // 计算当前页面内容
  const currentPageContent = computed(() => {
    if (!bookPages.value || bookPages.value.length === 0) {
      return '';
    }
    
    // 确保索引在有效范围内
    const index = Math.max(0, Math.min(currentPageIndex.value, bookPages.value.length - 1));
    return bookPages.value[index];
  });
  
  // 变更页面
  function navigatePage(pageIndex) {
    if (pageIndex >= 0 && pageIndex < bookPages.value.length) {
      currentPageIndex.value = pageIndex;
      updateCurrentChapter();
    }
  }
  
  // 下一页
  function nextPage() {
    if (currentPageIndex.value < bookPages.value.length - 1) {
      currentPageIndex.value++;
      updateCurrentChapter();
    }
  }
  
  // 上一页
  function previousPage() {
    if (currentPageIndex.value > 0) {
      currentPageIndex.value--;
      updateCurrentChapter();
    }
  }
  
  // 更新当前章节
  function updateCurrentChapter() {
    // 根据当前页码确定所在章节
    for (let i = 0; i < chapters.value.length; i++) {
      const chapter = chapters.value[i];
      
      // 遍历章节中的每个小节
      for (let j = 0; j < chapter.sections.length; j++) {
        const section = chapter.sections[j];
        
        // 查找章节范围
        const nextSectionIndex = j + 1;
        const isLastSection = nextSectionIndex >= chapter.sections.length;
        const nextSection = !isLastSection ? chapter.sections[nextSectionIndex] : null;
        const nextChapter = i + 1 < chapters.value.length ? chapters.value[i + 1] : null;
        const nextChapterFirstSection = nextChapter && nextChapter.sections.length > 0 ? nextChapter.sections[0] : null;
        
        const endPage = nextSection ? nextSection.page : 
                      nextChapterFirstSection ? nextChapterFirstSection.page : 
                      bookPages.value.length;
        
        if (currentPageIndex.value >= section.page && currentPageIndex.value < endPage) {
          currentChapter.value = i;
          return;
        }
      }
    }
  }
  
  // 导航到指定章节
  function navigateToChapter(chapterIndex) {
    // 先判断章节索引是否有效
    if (chapterIndex >= 0 && chapterIndex < chapters.value.length) {
      // 获取章节的第一页
      const firstPage = chapters.value[chapterIndex].sections[0].page;
      
      // 跳转到该页
      currentPageIndex.value = firstPage;
      currentChapter.value = chapterIndex;
      
      return true;
    }
    return false;
  }
  
  // 导航到指定小节
  function navigateToSection(chapterIndex, sectionIndex) {
    // 检查章节和小节索引是否有效
    if (chapterIndex >= 0 && chapterIndex < chapters.value.length &&
        sectionIndex >= 0 && sectionIndex < chapters.value[chapterIndex].sections.length) {
      
      // 获取该小节的页码
      const page = chapters.value[chapterIndex].sections[sectionIndex].page;
      
      // 跳转到该页
      currentPageIndex.value = page;
      currentChapter.value = chapterIndex;
      
      return true;
    }
    return false;
  }
  
  // 添加书签
  function addBookmark(title, preview) {
    bookmarks.value.push({
      id: Date.now().toString(),
      title: title || `第${currentPageIndex.value + 1}页书签`,
      page: currentPageIndex.value,
      preview: preview || '这是一个新的书签，点击可以跳转到相应页面。'
    });
    
    // 保存到本地存储
    saveBookmarksToStorage();
    
    return bookmarks.value[bookmarks.value.length - 1];
  }
  
  // 删除书签
  function removeBookmark(index) {
    if (index >= 0 && index < bookmarks.value.length) {
      const removed = bookmarks.value.splice(index, 1)[0];
      saveBookmarksToStorage();
      return removed;
    }
    return null;
  }
  
  // 跳转到书签页面
  function navigateToBookmark(bookmark) {
    if (bookmark && typeof bookmark.page === 'number') {
      currentPageIndex.value = bookmark.page;
      updateCurrentChapter();
      return true;
    }
    return false;
  }
  
  // 保存书签到本地存储
  function saveBookmarksToStorage() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
  }
  
  // 加载本地存储的书签
  function loadBookmarksFromStorage() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        bookmarks.value = JSON.parse(savedBookmarks);
      } catch (error) {
        console.error('加载书签失败:', error);
      }
    }
  }
  
  // 调整字体大小
  function adjustFontSize(delta) {
    fontSize.value = Math.max(12, Math.min(24, fontSize.value + delta));
    return fontSize.value;
  }
  
  // 初始化
  function init() {
    loadBookmarksFromStorage();
    updateCurrentChapter();
  }
  
  return {
    bookPages,
    currentPageIndex,
    chapters,
    currentChapter,
    bookmarks,
    fontSize,
    currentPageContent,
    navigatePage,
    nextPage,
    previousPage,
    updateCurrentChapter,
    navigateToChapter,
    navigateToSection,
    addBookmark,
    removeBookmark,
    navigateToBookmark,
    adjustFontSize,
    init
  };
});
