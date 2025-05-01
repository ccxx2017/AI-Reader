<template>
  <!-- 中间书籍显示面板 -->
  <div id="book-panel" class="book-panel">
    <div class="book-card">
      <!-- 顶部控制栏 -->
      <BookHeader 
        v-if="!isHeaderCollapsed" 
        @toggle-bookmarks="toggleBookmarks"
        @share-content="shareContent"
        @toggle-reading="toggleReading"
        @toggle-keyword-highlight="toggleKeywordHighlight"
        @toggle-notes-panel="toggleNotesPanel"
        @toggle-header="toggleHeader"
        :is-reading="isReading"
        :enable-keyword-highlight="enableKeywordHighlight"
        :show-notes-panel="showNotesPanel"
        :current-page-notes="currentPageNotes"
      />
      
      <!-- 顶部折叠控制按钮 - 折叠状态下的按钮 -->
      <button v-if="isHeaderCollapsed" @click="toggleHeader" class="header-collapse-btn-collapsed">
        <i class="fas fa-chevron-down icon-gray"></i>
      </button>
      
      <!-- 主要内容区域 -->
      <div class="content-area">
        <!-- 章节导航 -->
        <ChapterNav 
          v-if="showChapterNav" 
          :chapters="chapters"
          :current-chapter="currentChapter"
          @navigate-to-chapter="navigateToChapter"
          @navigate-to-section="navigateToSection"
          @toggle-chapter-nav="toggleChapterNav"
        />
        
        <!-- 书签面板 -->
        <BookmarksPanel 
          v-if="showBookmarks" 
          :bookmarks="bookmarks"
          @toggle-bookmarks="toggleBookmarks"
          @navigate-to-bookmark="navigateToBookmark"
          @remove-bookmark="removeBookmark"
          @add-current-page-bookmark="addCurrentPageBookmark"
        />
        
        <!-- 书籍内容部分 -->
        <BookContent 
          :display-content="displayContent"
          :page-content-ref="pageContentRef"
          @handle-text-selection="handleTextSelection"
        />
        
        <!-- 侧边笔记面板 -->
        <NotesPanel 
          :show-notes-panel="showNotesPanel"
          :current-page-notes="currentPageNotes"
          @toggle-notes-panel="toggleNotesPanel"
          @add-empty-note="addEmptyNote"
          @save-note="saveNote"
          @delete-note="deleteNote"
          @show-note-content="showNoteContent"
        />
      </div>
      
      <!-- 底部导航栏 -->
      <BookFooter 
        v-if="!isFooterCollapsed" 
        :current-page-index="currentPageIndex"
        :total-pages="demoBookContent.length"
        @previous-page="previousPage"
        @next-page="nextPage"
        @toggle-chapter-nav="toggleChapterNav"
        @adjust-font-size="adjustFontSize"
        @toggle-footer="toggleFooter"
      />
      
      <!-- 底部折叠控制按钮 - 折叠状态下的按钮 -->
      <button v-if="isFooterCollapsed" @click="toggleFooter" class="footer-collapse-btn-collapsed">
        <i class="fas fa-chevron-up icon-gray"></i>
      </button>
    </div>
  </div>
  
  <!-- 选择菜单 -->
  <SelectionMenu 
    v-if="showSelectionMenu" 
    :selection-position="selectionPosition"
    @highlight-selection="highlightSelection"
    @add-note-to-selection="addNoteToSelection"
    @search-selection="searchSelection"
    @close-menu="showSelectionMenu = false"
  />
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue';
import { marked } from 'marked';
import BookHeader from './BookHeader.vue';
import BookContent from './BookContent.vue';
import BookFooter from './BookFooter.vue';
import ChapterNav from './ChapterNav.vue';
import BookmarksPanel from './BookmarksPanel.vue';
import NotesPanel from './NotesPanel.vue';
import SelectionMenu from './SelectionMenu.vue';

// 处理OCR识别结果
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleOcrResult(text) {
  console.log('收到OCR识别结果:', text);
  // 这里可以添加处理OCR结果的逻辑
}

// 模拟书籍数据
const demoBookContent = ref([
  // 在此处省略具体内容，会在实际代码中填充
]);

// 当前页面索引
const currentPageIndex = ref(0);

// 当前页面的HTML内容（经过处理的）
const displayContent = computed(() => {
  return processContent(getCurrentPageContent());
});

// 处理显示内容：结合多个处理函数
function processContent(content) {
  // 先标记术语
  let processedContent = markTechnicalTerms(content);
  
  // 处理数学公式
  processedContent = processMathFormulas(processedContent);
  
  // 根据状态添加关键词高亮
  if (enableKeywordHighlight.value) {
    processedContent = highlightKeywords(processedContent);
  }
  
  return processedContent;
}

// 获取当前页面内容
function getCurrentPageContent() {
  // 默认返回空内容
  if (!demoBookContent.value || demoBookContent.value.length === 0) {
    return '';
  }
  
  // 确保索引在有效范围内
  const index = Math.max(0, Math.min(currentPageIndex.value, demoBookContent.value.length - 1));
  
  // 将markdown转换为HTML
  try {
    return marked.parse(demoBookContent.value[index]);
  } catch (error) {
    console.error('Markdown转换错误:', error);
    return '<p>内容加载错误</p>';
  }
}

// 引用DOM元素
const pageContentRef = ref(null);

// 顶部导航栏状态
const isHeaderCollapsed = ref(false);

// 底部导航栏状态
const isFooterCollapsed = ref(false);

// 章节导航状态
const showChapterNav = ref(false);

// 书签面板状态
const showBookmarks = ref(false);

// 章节数据
const chapters = ref([
  // 在此处省略具体内容，会在实际代码中填充
]);

// 当前章节
const currentChapter = ref(0);

// 书签数据
const bookmarks = ref([
  // 在此处省略具体内容，会在实际代码中填充
]);

// 笔记系统
const showNotesPanel = ref(false);
const pageNotes = ref([
  // 在此处省略具体内容，会在实际代码中填充
]);

// 朗读功能状态
const isReading = ref(false);

// 当前页面的笔记
const currentPageNotes = computed(() => {
  return pageNotes.value.filter(note => note.page === currentPageIndex.value);
});

// 关键词高亮状态
const enableKeywordHighlight = ref(false);

// 选择菜单控制
const showSelectionMenu = ref(false);
const selectionPosition = ref({ top: 0, left: 0 });

// 关键词高亮处理函数
function highlightKeywords(content) {
  // 这里是关键词高亮的逻辑
  // 如果没有关键词列表，就直接返回原内容
  if (!content) return '';
  
  // 模拟关键词列表
  const keywords = [
    '深度学习', '神经网络', '人工智能', '机器学习',
    '卷积神经网络', '循环神经网络', '强化学习', '自然语言处理',
    '计算机视觉', '图像识别', '语音识别', '迁移学习'
  ];
  
  // 为每个关键词添加高亮样式
  let highlightedContent = content;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})(?![^<]*>|[^<>]*</)`, 'gi');
    highlightedContent = highlightedContent.replace(regex, '<span class="highlight-keyword">$1</span>');
  });
  
  return highlightedContent;
}

// 处理文本选择
function handleTextSelection() {
  const selection = window.getSelection();
  if (!selection.toString().trim()) {
    showSelectionMenu.value = false;
    return;
  }
  
  // 计算选择菜单的位置
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  selectionPosition.value = {
    top: rect.bottom + window.scrollY + 10,
    left: rect.left + window.scrollX + (rect.width / 2) - 75 // 水平居中
  };
  
  showSelectionMenu.value = true;
}

// 添加当前页为书签
function addCurrentPageBookmark() {
  // 实现添加书签的逻辑
  const newBookmark = {
    id: Date.now().toString(),
    title: `第${currentPageIndex.value + 1}页书签`,
    page: currentPageIndex.value,
    preview: '这是一个新的书签，点击可以跳转到相应页面。'
  };
  
  bookmarks.value.push(newBookmark);
}

// 删除书签
function removeBookmark(index) {
  bookmarks.value.splice(index, 1);
}

// 跳转到书签页面
function navigateToBookmark(bookmark) {
  if (bookmark && typeof bookmark.page === 'number') {
    currentPageIndex.value = bookmark.page;
    showBookmarks.value = false;
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
    
    // 关闭章节导航
    showChapterNav.value = false;
  }
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
    
    // 关闭章节导航
    showChapterNav.value = false;
  }
}

// 下一页
function nextPage() {
  if (currentPageIndex.value < demoBookContent.value.length - 1) {
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
                    demoBookContent.value.length;
      
      if (currentPageIndex.value >= section.page && currentPageIndex.value < endPage) {
        currentChapter.value = i;
        return;
      }
    }
  }
}

// 高亮选中的文本
function highlightSelection(color) {
  const selection = window.getSelection();
  if (!selection.toString().trim()) return;
  
  const range = selection.getRangeAt(0);
  
  // 创建span元素并设置类名
  const span = document.createElement('span');
  span.className = `highlight-${color}`;
  
  // 将选中内容包装在span中
  range.surroundContents(span);
  
  // 清除选择并关闭菜单
  selection.removeAllRanges();
  showSelectionMenu.value = false;
}

// 为选中文本添加笔记
function addNoteToSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (!selectedText) return;
  
  // 创建新笔记
  const newNote = {
    id: `note-${Date.now()}`,
    page: currentPageIndex.value,
    sourceText: selectedText,
    text: '', // 初始为空
    timestamp: new Date().toLocaleString(),
    editing: true, // 自动进入编辑模式
    active: true
  };
  
  // 添加到笔记列表
  pageNotes.value.push(newNote);
  
  // 打开笔记面板
  showNotesPanel.value = true;
  
  // 清除选择并关闭菜单
  selection.removeAllRanges();
  showSelectionMenu.value = false;
}

// 搜索选中的文本
function searchSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (!selectedText) return;
  
  // 在这里实现搜索功能
  console.log('搜索选中的文本:', selectedText);
  
  // 清除选择并关闭菜单
  selection.removeAllRanges();
  showSelectionMenu.value = false;
}

// 添加空白笔记
function addEmptyNote() {
  // 创建新笔记
  const newNote = {
    id: `note-${Date.now()}`,
    page: currentPageIndex.value,
    sourceText: '',
    text: '', // 初始为空
    timestamp: new Date().toLocaleString(),
    editing: true, // 自动进入编辑模式
    active: true
  };
  
  // 添加到笔记列表
  pageNotes.value.push(newNote);
  
  // 把旧笔记设为非激活状态
  pageNotes.value.forEach(note => {
    if (note.id !== newNote.id) {
      note.active = false;
    }
  });
}

// 显示笔记内容进行编辑
function showNoteContent(note, index) {
  // 设置当前笔记为编辑状态
  pageNotes.value[index].editing = true;
  
  // 激活当前笔记，其他笔记设为非激活
  pageNotes.value.forEach((n, i) => {
    n.active = i === index;
  });
}

// 保存笔记
function saveNote(note, index) {
  // 验证笔记索引是否有效
  if (index >= 0 && index < pageNotes.value.length) {
    // 退出编辑模式
    pageNotes.value[index].editing = false;
    
    // 更新时间戳
    pageNotes.value[index].timestamp = new Date().toLocaleString() + ' (已编辑)';
    
    // 如果笔记内容为空，则删除该笔记
    if (!pageNotes.value[index].text.trim()) {
      pageNotes.value.splice(index, 1);
    } else {
      // 保存到本地存储
      saveNotesToLocalStorage();
    }
  }
}

// 删除笔记
function deleteNote(index) {
  // 验证笔记索引是否有效
  if (index >= 0 && index < pageNotes.value.length) {
    // 确认删除
    if (confirm('确定要删除这条笔记吗？')) {
      // 从数组中移除
      pageNotes.value.splice(index, 1);
      
      // 更新本地存储
      saveNotesToLocalStorage();
    }
  }
}

// 切换笔记面板显示/隐藏
function toggleNotesPanel() {
  showNotesPanel.value = !showNotesPanel.value;
  
  // 关闭所有笔记的编辑状态
  if (!showNotesPanel.value) {
    closeNoteEditor();
  }
}

// 关闭笔记编辑框
function closeNoteEditor() {
  pageNotes.value.forEach(note => {
    note.editing = false;
  });
}

// 保存笔记到本地存储
function saveNotesToLocalStorage() {
  localStorage.setItem('pageNotes', JSON.stringify(pageNotes.value));
}

// 切换章节导航显示/隐藏
function toggleChapterNav() {
  showChapterNav.value = !showChapterNav.value;
  
  // 如果显示章节导航，则关闭书签面板
  if (showChapterNav.value && showBookmarks.value) {
    showBookmarks.value = false;
  }
}

// 切换书签面板显示/隐藏
function toggleBookmarks() {
  showBookmarks.value = !showBookmarks.value;
  
  // 如果显示书签面板，则关闭章节导航
  if (showBookmarks.value && showChapterNav.value) {
    showChapterNav.value = false;
  }
}

// 术语标记处理
function markTechnicalTerms(content) {
  if (!content) return '';
  
  // 模拟术语库
  const terms = [
    { term: '深度学习', definition: '一种机器学习方法，使用多层神经网络进行特征学习和模式识别。' },
    { term: '神经网络', definition: '一种模拟生物神经网络的计算模型，由多个相互连接的神经元层组成。' },
    { term: '卷积神经网络', definition: '一种专门用于处理网格结构数据的神经网络，广泛应用于图像处理。' }
    // 更多术语...
  ];
  
  // 为每个术语添加标记
  let markedContent = content;
  terms.forEach(item => {
    const regex = new RegExp(`(${item.term})(?![^<]*>|[^<>]*</)`, 'gi');
    markedContent = markedContent.replace(regex, '<span class="technical-term" data-definition="' + item.definition + '">$1</span>');
  });
  
  return markedContent;
}

// 调整字体大小
function adjustFontSize(delta) {
  // 获取内容容器
  const pageContent = pageContentRef.value;
  if (!pageContent) return;
  
  // 获取当前字体大小
  const currentSize = parseFloat(window.getComputedStyle(pageContent).fontSize);
  
  // 计算新的字体大小（限制最小和最大值）
  let newSize = currentSize + delta;
  newSize = Math.max(12, Math.min(24, newSize)); // 字体大小范围：12px-24px
  
  // 应用新的字体大小
  pageContent.style.fontSize = `${newSize}px`;
  
  // 可以添加UI提示
  const sizeLabel = delta > 0 ? '增大' : '减小';
  console.log(`字体大小${sizeLabel}到 ${newSize}px`);
}

// 切换顶部导航栏显示/隐藏
function toggleHeader() {
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
}

// 切换底部导航栏显示/隐藏
function toggleFooter() {
  isFooterCollapsed.value = !isFooterCollapsed.value;
}

// 数学公式处理函数
function processMathFormulas(content) {
  if (!content) return '';
  
  // 这里可以集成MathJax或KaTeX等数学公式库
  // 简单示例：将$$包围的内容标记为数学公式
  const mathRegex = /\$\$(.*?)\$\$/g;
  return content.replace(mathRegex, '<div class="math-formula">$1</div>');
}

// 朗读功能
function toggleReading() {
  if (isReading.value) {
    stopReading();
  } else {
    startReading();
  }
}

// 开始朗读
function startReading() {
  // 检查浏览器是否支持语音合成
  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持语音合成功能');
    return;
  }
  
  // 获取当前页面的纯文本内容
  const pageContent = pageContentRef.value;
  if (!pageContent) return;
  
  // 提取文本内容（去除HTML标签）
  const textToRead = pageContent.innerText;
  
  if (!textToRead.trim()) {
    alert('当前页面没有可朗读的内容');
    return;
  }
  
  // 创建语音合成实例
  const utterance = new SpeechSynthesisUtterance(textToRead);
  
  // 设置语音属性（可根据需要调整）
  utterance.lang = 'zh-CN'; // 中文
  utterance.volume = 1; // 音量，范围0-1
  utterance.rate = 1; // 语速，范围0.1-10
  utterance.pitch = 1; // 音调，范围0-2
  
  // 开始朗读
  window.speechSynthesis.speak(utterance);
  
  // 更新状态
  isReading.value = true;
  
  // 添加结束事件监听
  utterance.onend = () => {
    isReading.value = false;
  };
}

// 停止朗读
function stopReading() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isReading.value = false;
  }
}

// 关键词高亮状态更新时重新渲染内容
function toggleKeywordHighlight() {
  enableKeywordHighlight.value = !enableKeywordHighlight.value;
}

// 分享功能实现
function shareContent() {
  // 检查是否支持网页分享API
  if (navigator.share) {
    // 获取当前页面内容
    const title = '分享阅读内容';
    const text = `我正在阅读《深度学习基础》第${currentPageIndex.value + 1}页`;
    const url = window.location.href;
    
    navigator.share({
      title,
      text,
      url
    })
    .then(() => console.log('分享成功'))
    .catch((error) => console.log('分享失败:', error));
  } else {
    // 回退方案：提供复制链接选项
    const pageLink = `${window.location.origin}${window.location.pathname}?page=${currentPageIndex.value}`;
    
    // 创建临时输入框用于复制
    const tempInput = document.createElement('input');
    tempInput.value = pageLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
      document.execCommand('copy');
      alert('链接已复制到剪贴板，您可以将其分享给好友');
    } catch (err) {
      alert('复制失败，请手动复制链接: ' + pageLink);
    }
    
    document.body.removeChild(tempInput);
  }
}

onMounted(() => {
  // 初始化：从URL参数中获取页码
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  if (pageParam && !isNaN(parseInt(pageParam))) {
    currentPageIndex.value = parseInt(pageParam);
  }
  
  // 初始化页面内容
  // 模拟数据：这里简化示例，实际应用中可能需要从API获取
  demoBookContent.value = [
    '# 深度学习基础简介\n\n深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程。通过处理大量数据，深度学习系统能够自动发现模式和特征，用于解决各种复杂的问题。\n\n## 主要应用领域\n\n* 计算机视觉\n* 自然语言处理\n* 语音识别\n* 游戏\n* 医疗诊断',
    '# 第二章：神经网络基础\n\n神经网络是深度学习的核心组件，它由多个相互连接的神经元层组成。每个神经元接收输入，对其进行加权求和，然后通过激活函数产生输出。\n\n## 激活函数\n\n激活函数为神经网络引入非线性特性，常见的激活函数包括：\n\n* ReLU (Rectified Linear Unit)\n* Sigmoid\n* Tanh'
    // 更多页面内容...
  ];
  
  // 初始化章节数据
  chapters.value = [
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
  ];
  
  // 更新当前章节
  updateCurrentChapter();
  
  // 从本地存储加载笔记
  const savedNotes = localStorage.getItem('pageNotes');
  if (savedNotes) {
    try {
      pageNotes.value = JSON.parse(savedNotes);
    } catch (error) {
      console.error('加载笔记失败:', error);
    }
  }
});
</script>

<style scoped>
/* 引入必要的样式 */
.book-panel {
  width: 40%;
  min-width: 300px;
  transition: width 0.3s ease-in-out;
}

.book-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.dark .book-card {
  background-color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  color: #e5e7eb;
}

.header-collapse-btn-collapsed {
  z-index: 20;
  position: absolute;
  background-color: white;
  padding: 0.25rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  top: 0.5rem;
  right: 0.5rem;
}

.dark .header-collapse-btn-collapsed {
  background-color: #1e293b;
}

.footer-collapse-btn-collapsed {
  z-index: 20;
  position: absolute;
  background-color: white;
  padding: 0.25rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  bottom: 0.5rem;
  right: 0.5rem;
}

.dark .footer-collapse-btn-collapsed {
  background-color: #1e293b;
}

.icon-gray {
  color: #4b5563;
}

.dark .icon-gray {
  color: #d1d5db;
}

.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 其他样式将在子组件中定义 */
</style>
