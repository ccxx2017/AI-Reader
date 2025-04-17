<template>
  <!-- 中间书籍显示面板 -->
  <div id="book-panel" class="panel-container panel-container-transition w-2/5 min-w-[300px]">
    <div class="card h-full overflow-hidden flex flex-col relative">
      <!-- 顶部控制栏 - 融合图1和图2的优点 -->
      <div v-if="!isHeaderCollapsed" class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="text-lg font-medium mr-3">书籍视图</div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">《深度学习基础》</div>
        </div>
        <div class="flex space-x-2 items-center">
          <!-- 书签按钮 -->
          <button @click="toggleBookmarks" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="书签">
            <i class="fas fa-bookmark text-gray-600 dark:text-gray-300"></i>
          </button>
          <!-- 分享按钮 -->
          <button @click="shareContent" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="分享">
            <i class="fas fa-share-alt text-gray-600 dark:text-gray-300"></i>
          </button>
          <!-- 朗读按钮 - 保留自图1 -->
          <button @click="toggleReading" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" :class="{'text-blue-500': isReading}" title="朗读">
            <i class="fas" :class="isReading ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <!-- 关键词高亮切换按钮 - 保留自图1 -->
          <button @click="toggleKeywordHighlight" 
                  class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" 
                  :class="{'text-yellow-500': enableKeywordHighlight}" 
                  title="切换关键词高亮">
            <i class="fas fa-highlighter"></i>
          </button>
          <!-- 笔记按钮 -->
          <button @click="toggleNotesPanel" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative" :class="{'text-blue-500': showNotesPanel}" title="笔记">
            <i class="fas fa-sticky-note"></i>
            <span v-if="!showNotesPanel && currentPageNotes.length > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{{ currentPageNotes.length }}</span>
          </button>
          
          <!-- 顶部折叠控制按钮 - 移到按钮组内部，与其他按钮对齐 -->
          <button @click="toggleHeader" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="折叠顶部栏">
            <i class="fas fa-chevron-up text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
      </div>
      
      <!-- 顶部折叠控制按钮 - 折叠状态下的按钮 -->
      <button v-if="isHeaderCollapsed" @click="toggleHeader" class="header-collapse-btn-collapsed absolute bg-white dark:bg-gray-800 p-1 rounded-full shadow-md z-20 top-2 right-2">
        <i class="fas fa-chevron-down text-gray-600"></i>
      </button>
      
      <!-- 主要内容区域 -->
      <div class="flex-grow flex flex-col overflow-hidden">
        <!-- 章节导航 - 在章节按钮点击时显示 -->
        <div v-if="showChapterNav" class="chapter-nav absolute left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10 p-4 w-64 overflow-y-auto shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium">目录</h3>
            <button @click="toggleChapterNav" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <ul class="space-y-4">
            <li v-for="(chapter, chapterIndex) in chapters" :key="chapterIndex" class="mb-3">
              <div @click="navigateToChapter(chapterIndex)" 
                   class="flex items-center cursor-pointer py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                   :class="{'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': chapterIndex === currentChapter}">
                <span class="font-medium">{{ chapter.title }}</span>
              </div>
              <ul class="pl-4 mt-1 space-y-1">
                <li v-for="(section, sectionIndex) in chapter.sections" :key="sectionIndex">
                  <div @click="navigateToSection(chapterIndex, sectionIndex)" 
                       class="text-sm py-1 px-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                       :class="{'text-blue-500': currentChapter === chapterIndex && section.page === currentPageIndex}">
                    {{ section.title }}
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        
        <!-- 书签面板 -->
        <div v-if="showBookmarks" class="bookmarks-panel absolute right-0 top-0 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-10 p-4 w-64 overflow-y-auto shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium">书签</h3>
            <button @click="toggleBookmarks" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="bookmarks.length === 0" class="text-center text-gray-500 py-4">
            <i class="fas fa-bookmark text-gray-300 text-4xl mb-2"></i>
            <p>暂无书签</p>
          </div>
          <ul v-else class="space-y-3">
            <li v-for="(bookmark, index) in bookmarks" :key="index" class="border-b border-gray-100 dark:border-gray-700 pb-2">
              <div class="flex justify-between">
                <a href="#" @click.prevent="navigateToBookmark(bookmark)" class="text-sm hover:text-blue-500 dark:hover:text-blue-400">
                  {{ bookmark.title }}
                </a>
                <button @click="removeBookmark(index)" class="text-xs text-gray-400 hover:text-red-500">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1 truncate">{{ bookmark.preview }}</p>
            </li>
          </ul>
          <div class="mt-4">
            <button @click="addCurrentPageBookmark" class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
              添加当前页为书签
            </button>
          </div>
        </div>
        
        <!-- 笔记系统 -->
        <div class="book-content-wrapper flex-grow overflow-hidden">
          <div class="book h-full">
            <div class="book-content h-full">
              <!-- 仅保留主内容区，彻底移除CameraOCR相关内容 -->
              <div class="page h-full overflow-y-auto relative bg-white dark:bg-gray-900" 
                   @mouseup="handleTextSelection" 
                   @contextmenu.prevent
                   ref="pageContentRef">
                <div v-html="displayContent"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 侧边笔记面板（优化设计） -->
        <div class="side-notes-panel" :class="{'expanded': showNotesPanel}">
          <div class="notes-toggle-button" @click="toggleNotesPanel">
            <i :class="showNotesPanel ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
          </div>
          
          <!-- 笔记内容 -->
          <div class="notes-content" v-if="showNotesPanel">
            <div class="notes-header">
              <h3><i class="fas fa-sticky-note"></i> 页面笔记 ({{ currentPageNotes.length }})</h3>
              <button @click="addEmptyNote" class="add-note-btn">
                <i class="fas fa-plus"></i> 添加笔记
              </button>
            </div>
            
            <div class="notes-list">
              <div v-if="currentPageNotes.length === 0" class="empty-notes">
                <i class="far fa-sticky-note"></i>
                <p>当前页面没有笔记</p>
                <p class="help-text">选择文本后点击<i class="fas fa-sticky-note"></i>图标添加笔记，或使用上方的添加按钮</p>
              </div>
              
              <div v-for="(note, index) in currentPageNotes" :key="note.id" class="note-item" :class="{ 'active': note.active }">
                <div class="note-source-text" v-if="note.sourceText">{{ note.sourceText }}</div>
                <div class="note-content" v-if="!note.editing">{{ note.text }}</div>
                <textarea v-else class="w-full p-2 border rounded" v-model="note.text" rows="3"></textarea>
                
                <div class="note-actions">
                  <button v-if="!note.editing" @click="showNoteContent(note, index)" class="note-action-btn">
                    <i class="fas fa-edit"></i> 编辑
                  </button>
                  <button v-if="note.editing" @click="saveNote(note, index)" class="note-action-btn">
                    <i class="fas fa-save"></i> 保存
                  </button>
                  <button @click="deleteNote(index)" class="note-action-btn delete">
                    <i class="fas fa-trash"></i> 删除
                  </button>
                </div>
                <div class="note-timestamp" v-if="note.timestamp">{{ note.timestamp }}</div>
              </div>
            </div>
            
            <div class="note-instructions" v-if="currentPageNotes.length > 0">
              <i class="fas fa-info-circle"></i> 提示：选中文本后可直接添加笔记
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部导航栏 - 确保正确位置和样式 -->
      <div v-if="!isFooterCollapsed" class="book-footer flex items-center justify-between px-4">
        <div class="flex items-center space-x-4">
          <button @click="previousPage" class="p-2 px-4 rounded-md bg-blue-50 hover:bg-blue-100 dark:hover:bg-blue-800 dark:bg-blue-900/30 focus:outline-none flex items-center" title="上一页">
            <i class="fas fa-chevron-left mr-1"></i>
            <span>上一页</span>
          </button>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentPageIndex + 1 }} / {{ demoBookContent.length }}</span>
          <button @click="nextPage" class="p-2 px-4 rounded-md bg-blue-50 hover:bg-blue-100 dark:hover:bg-blue-800 dark:bg-blue-900/30 focus:outline-none flex items-center" title="下一页">
            <span>下一页</span>
            <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
        
        <!-- 中间的提示文字 -->
        <div class="text-center">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">请将书籍放在摄像头下方</span>
        </div>
        
        <!-- 右侧功能按钮 - 向左移动避免被折叠按钮挡住 -->
        <div class="flex items-center space-x-2">
          <button @click="toggleChapterNav" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="目录">
            <i class="fas fa-list"></i>
          </button>
          <button @click="adjustFontSize(1)" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="增大字号">
            <i class="fas fa-search-plus"></i>
          </button>
          <button @click="adjustFontSize(-1)" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="减小字号">
            <i class="fas fa-search-minus"></i>
          </button>
          <button @click="adjustFontSize(-2)" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none text-gray-600 dark:text-gray-300" title="缩小字号">
            <i class="fas fa-font text-sm"></i>
          </button>
        </div>
      </div>
      
      <!-- 底部折叠控制按钮 - 放在卡片内部但独立于底部导航栏，确保折叠后仍然可见 -->
      <button v-if="!isFooterCollapsed" @click="toggleFooter" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none absolute right-2 bottom-2 bg-white dark:bg-gray-800 shadow-md z-20" title="折叠底部栏">
        <i class="fas fa-chevron-down text-gray-600 dark:text-gray-300"></i>
      </button>
      
      <!-- 底部折叠按钮 - 折叠状态下的按钮 -->
      <button v-if="isFooterCollapsed" @click="toggleFooter" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none absolute right-2 bottom-2 bg-white dark:bg-gray-800 shadow-md z-20" title="展开底部栏">
        <i class="fas fa-chevron-up text-gray-600 dark:text-gray-300"></i>
      </button>
    </div>
  </div>
  
  <!-- 选择菜单 -->
  <div v-if="showSelectionMenu" class="selection-menu absolute bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-md z-30 p-1 flex border dark:border-gray-700"
       :style="`top: ${selectionPosition.top}px; left: ${selectionPosition.left}px;`">
    <button @click="highlightSelection('yellow')" class="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded" title="高亮">
      <i class="fas fa-highlighter text-yellow-500 dark:text-yellow-400"></i>
    </button>
    <button @click="addNoteToSelection" class="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded" title="添加笔记">
      <i class="fas fa-sticky-note text-blue-500 dark:text-blue-400"></i>
    </button>
    <button @click="askAboutSelection" class="p-2 hover:bg-green-100 dark:hover:bg-green-800 rounded" title="询问此处">
      <i class="fas fa-question-circle text-green-500 dark:text-green-400"></i>
    </button>
  </div>
  
  <!-- 笔记编辑框 -->
  <div v-if="showNoteEditor" class="note-editor fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-md z-30 p-4 w-96">
    <div class="flex justify-between items-center mb-2">
      <h4 class="font-medium text-sm">添加笔记</h4>
      <button @click="closeNoteEditor" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <textarea v-model="noteContent" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" rows="3"></textarea>
    <div class="flex justify-end mt-2">
      <button @click="saveNoteFromEditor" class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
        保存
      </button>
    </div>
  </div>
  
  <!-- 术语解释弹窗 -->
  <div v-if="showTermDefinition" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" @click.self="closeTermDefinition">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
      <!-- 弹窗标题 -->
      <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ currentTerm.term }}</h3>
        <button @click="closeTermDefinition" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <!-- 弹窗内容 -->
      <div class="px-4 py-3">
        <p class="text-gray-600 dark:text-gray-300 mb-3">{{ currentTerm.definition }}</p>
        
        <div v-if="currentTerm.examples && currentTerm.examples.length" class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">示例:</h4>
          <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li v-for="(example, i) in currentTerm.examples" :key="i">{{ example }}</li>
          </ul>
        </div>
      </div>
      <!-- 弹窗底部 -->
      <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between border-t border-gray-200 dark:border-gray-600">
        <button @click="askMoreAboutTerm" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium focus:outline-none">
          向AI助手提问
        </button>
        <button @click="closeTermDefinition" class="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-gray-700 dark:text-gray-200 text-sm focus:outline-none">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, inject, computed } from 'vue';
  import { marked } from 'marked';

  // 添加页面内容引用
  const pageContentRef = ref(null);

  // 从上层组件注入书籍数据
  const { bookPages, currentPageIndex } = inject('bookData');

  // OCR识别结果内容
  const ocrContent = ref('');

  // 处理OCR识别结果
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleOcrResult(_) {
    // ...
  }

  // 模拟书籍数据
  const demoBookContent = ref([
    // ...
  ]);

  // 当前所在章节
  const currentChapter = ref(0);

  // 模拟章节数据
  const chapters = ref([
    // ...
  ]);

  // 书签数据
  const bookmarks = ref([]);

  // 页面笔记
  const pageNotes = ref([]);

  // 笔记ID计数器
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noteIdCounter = ref(1);

  // 状态控制变量
  const showChapterNav = ref(false);
  const showBookmarks = ref(false);
  const showSelectionMenu = ref(false);
  const showNoteEditor = ref(false);
  const showTermDefinition = ref(false);
  const isReading = ref(false);
  const showNotesPanel = ref(false); // 控制笔记面板显示/隐藏

  // 位置信息
  const selectionPosition = ref({ top: 0, left: 0 });
  const currentTerm = ref({ term: '', definition: '' });

  // 当前选中的文本内容
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectedText = ref('');

  // 笔记内容
  const noteContent = ref('');

  // 计算当前显示内容（优先显示OCR识别结果，其次显示原书籍内容）
  const displayContent = computed(() => {
    if (ocrContent.value) {
      return ocrContent.value.replace(/\n/g, '<br>');
    }
    
    return getCurrentPageContent();
  });

  // 获取当前页面内容
  function getCurrentPageContent() {
    // 如果有书籍页面数据，则使用书籍页面数据
    if (bookPages.value && bookPages.value.length > 0 && currentPageIndex.value < bookPages.value.length) {
      let content = bookPages.value[currentPageIndex.value];
      
      // 处理Markdown内容
      content = marked(content);
      
      // 如果启用了关键词高亮，应用高亮处理
      if (enableKeywordHighlight.value) {
        content = highlightKeywords(content);
      }
      
      // 标记专业术语
      content = markTechnicalTerms(content);
      
      // 处理数学公式
      content = processMathFormulas(content);
      
      return content;
    }
    
    // 如果没有书籍页面数据，则使用演示内容
    if (demoBookContent.value && demoBookContent.value.length > 0 && currentPageIndex.value < demoBookContent.value.length) {
      return demoBookContent.value[currentPageIndex.value];
    }
    
    return '<p class="text-center text-gray-500 mt-10">暂无内容</p>';
  }

  // 关键词高亮处理函数
  function highlightKeywords(content) {
    if (!content) return '';
    
    const keywords = [
      '深度学习', '神经网络', '机器学习', '人工智能', 'AI', '卷积神经网络', 'CNN', 
      '循环神经网络', 'RNN', '强化学习', '自然语言处理', 'NLP', '计算机视觉',
      '反向传播', '梯度下降', '过拟合', '欠拟合', '正则化', '激活函数', '损失函数'
    ];
    
    let processedContent = content;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})(?![^<]*>)`, 'gi');
      processedContent = processedContent.replace(regex, '<span class="keyword-highlight">$1</span>');
    });
    
    return processedContent;
  }

  // 处理文本选择
  function handleTextSelection() {
    // ...
  }

  // 添加当前页为书签
  function addCurrentPageBookmark() {
    // ...
  }

  // 删除书签
  function removeBookmark(index) {
    if (index >= 0 && index < bookmarks.value.length) {
      bookmarks.value.splice(index, 1);
      // 保存到本地存储
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
    }
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
    if (chapterIndex >= 0 && chapterIndex < chapters.value.length) {
      // 如果章节有页面信息，直接导航到该页面
      if (chapters.value[chapterIndex].page !== undefined) {
        currentPageIndex.value = chapters.value[chapterIndex].page;
      }
      // 如果章节有小节，导航到第一个小节
      else if (chapters.value[chapterIndex].sections && chapters.value[chapterIndex].sections.length > 0) {
        currentPageIndex.value = chapters.value[chapterIndex].sections[0].page;
      }
      
      currentChapter.value = chapterIndex;
      showChapterNav.value = false;
    }
  }

  // 导航到指定小节
  function navigateToSection(chapterIndex, sectionIndex) {
    if (
      chapterIndex >= 0 && 
      chapterIndex < chapters.value.length && 
      sectionIndex >= 0 && 
      chapters.value[chapterIndex].sections && 
      sectionIndex < chapters.value[chapterIndex].sections.length
    ) {
      const section = chapters.value[chapterIndex].sections[sectionIndex];
      if (section.page !== undefined) {
        currentPageIndex.value = section.page;
        currentChapter.value = chapterIndex;
        showChapterNav.value = false;
      }
    }
  }

  // 跳转到指定页面
  function nextPage() {
    // ...
  }

  function previousPage() {
    // ...
  }

  // 更新当前章节
  function updateCurrentChapter() {
    // 根据当前页码确定当前章节
    for (let i = 0; i < chapters.value.length; i++) {
      const chapter = chapters.value[i];
      
      // 检查当前页是否在章节范围内
      if (chapter.page === currentPageIndex.value) {
        currentChapter.value = i;
        return;
      }
      
      // 检查当前页是否在章节的小节范围内
      if (chapter.sections) {
        for (const section of chapter.sections) {
          if (section.page === currentPageIndex.value) {
            currentChapter.value = i;
            return;
          }
        }
      }
    }
  }

  // 高亮选中的文本
  function highlightSelection(color) {
    // 获取选中的文本
    const selection = window.getSelection();
    if (!selection.toString()) return;
    
    // 创建高亮元素
    const span = document.createElement('span');
    span.className = `highlight-${color}`;
    span.textContent = selection.toString();
    
    // 替换选中的文本
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);
    
    // 清除选择
    selection.removeAllRanges();
    
    // 隐藏选择菜单
    showSelectionMenu.value = false;
  }

  // 为选中文本添加笔记
  function addNoteToSelection() {
    const selection = window.getSelection();
    if (!selection.toString()) return;
    
    // 打开笔记编辑框
    showNoteEditor.value = true;
    selectedText.value = selection.toString();
    
    // 清除选择
    window.getSelection().removeAllRanges();
    showSelectionMenu.value = false;
  }

  // 计算当前页面的笔记
  const currentPageNotes = computed(() => {
    return pageNotes.value.filter(note => note.page === currentPageIndex.value);
  });

  // 添加空白笔记
  function addEmptyNote() {
    const newNote = {
      id: Date.now(),
      text: '',
      sourceText: '',
      timestamp: new Date().toLocaleString(),
      page: currentPageIndex.value,
      editing: true,
      active: true
    };
    
    // 添加到所有笔记（而不是直接修改计算属性）
    pageNotes.value.push(newNote);
    
    // 保存到本地存储
    saveNotesToLocalStorage();
  }

  // 显示笔记内容进行编辑
  function showNoteContent(note, index) {
    // 找到原始笔记在所有笔记中的索引
    const allNotesIndex = pageNotes.value.findIndex(n => n.id === note.id);
    if (allNotesIndex !== -1) {
      // 设置当前笔记为编辑状态
      pageNotes.value[allNotesIndex].editing = true;
    }
  }

  // 保存笔记
  function saveNote(note, index) {
    // 找到原始笔记在所有笔记中的索引
    const allNotesIndex = pageNotes.value.findIndex(n => n.id === note.id);
    if (allNotesIndex !== -1) {
      // 退出编辑状态
      pageNotes.value[allNotesIndex].editing = false;
      
      // 更新时间戳
      pageNotes.value[allNotesIndex].timestamp = new Date().toLocaleString();
      
      // 更新文本内容（如果有变化）
      pageNotes.value[allNotesIndex].text = note.text;
    }
    
    // 保存到本地存储
    saveNotesToLocalStorage();
  }

  // 删除笔记
  function deleteNote(index) {
    // 获取当前页面的笔记
    const currentNotes = currentPageNotes.value;
    if (index >= 0 && index < currentNotes.length) {
      const noteId = currentNotes[index].id;
      
      // 从所有笔记中删除
      const allNotesIndex = pageNotes.value.findIndex(n => n.id === noteId);
      if (allNotesIndex !== -1) {
        pageNotes.value.splice(allNotesIndex, 1);
      }
      
      // 保存到本地存储
      saveNotesToLocalStorage();
    }
  }

  // 切换笔记面板显示/隐藏
  function toggleNotesPanel() {
    showNotesPanel.value = !showNotesPanel.value;
    // 如果打开笔记面板，则关闭其他面板
    if (showNotesPanel.value) {
      showBookmarks.value = false;
      showChapterNav.value = false;
    }
  }

  // 关闭笔记编辑框
  function closeNoteEditor() {
    showNoteEditor.value = false;
    noteContent.value = '';
  }

  // 保存笔记到本地存储
  function saveNotesToLocalStorage() {
    localStorage.setItem('pageNotes', JSON.stringify(pageNotes.value));
  }

  // 保存选中文本的笔记
  function saveNoteFromEditor() {
    if (!noteContent.value.trim()) {
      closeNoteEditor();
      return;
    }
    
    const newNote = {
      id: Date.now(),
      text: noteContent.value,
      sourceText: selectedText.value,
      timestamp: new Date().toLocaleString(),
      page: currentPageIndex.value,
      editing: false,
      active: true
    };
    
    // 添加到所有笔记
    pageNotes.value.push(newNote);
    
    // 保存到本地存储
    saveNotesToLocalStorage();
    
    // 关闭编辑框
    closeNoteEditor();
    
    // 打开笔记面板
    showNotesPanel.value = true;
  }

  // 切换章节导航显示/隐藏
  function toggleChapterNav() {
    showChapterNav.value = !showChapterNav.value;
    // 如果打开章节导航，则关闭其他面板
    if (showChapterNav.value) {
      showBookmarks.value = false;
      showNotesPanel.value = false;
    }
  }

  // 切换书签面板显示/隐藏
  function toggleBookmarks() {
    showBookmarks.value = !showBookmarks.value;
    // 如果打开书签面板，则关闭其他面板
    if (showBookmarks.value) {
      showChapterNav.value = false;
      showNotesPanel.value = false;
    }
  }

  // 术语点击处理 - 在组件挂载后添加事件监听
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const technicalTerms = ref([
    // ...
  ]);

  // 术语标记处理
  function markTechnicalTerms(content) {
    if (!content) return '';
    
    const terms = technicalTerms.value;
    let processedContent = content;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term.term})(?![^<]*>)`, 'gi');
      processedContent = processedContent.replace(regex, 
        `<span class="technical-term" data-term="${term.term}" data-definition="${term.definition}">$1</span>`);
    });
    
    return processedContent;
  }

  // 调整字体大小
  function adjustFontSize(delta) {
    const contentContainer = document.querySelector('.book-content');
    if (!contentContainer) return;
    
    // 获取当前字体大小
    const currentSize = parseInt(window.getComputedStyle(contentContainer).fontSize);
    
    // 计算新的字体大小，确保在合理范围内
    const newSize = Math.max(12, Math.min(24, currentSize + delta));
    
    // 应用新的字体大小
    contentContainer.style.fontSize = `${newSize}px`;
    
    // 保存字体大小设置到本地存储
    localStorage.setItem('bookFontSize', newSize);
  }

  // 切换顶部导航栏显示/隐藏
  const isHeaderCollapsed = ref(false);
  function toggleHeader() {
    isHeaderCollapsed.value = !isHeaderCollapsed.value;
    // 保存用户偏好
    localStorage.setItem('headerCollapsed', isHeaderCollapsed.value);
  }

  // 切换底部导航栏显示/隐藏
  const isFooterCollapsed = ref(false);
  function toggleFooter() {
    isFooterCollapsed.value = !isFooterCollapsed.value;
    // 保存用户偏好
    localStorage.setItem('footerCollapsed', isFooterCollapsed.value);
  }

  // 增加数学公式处理函数
  function processMathFormulas(content) {
    if (!content) return '';
    
    // 处理行内公式 $...$
    let processedContent = content.replace(/\$([^\$]+)\$/g, '<span class="math-formula inline-formula">$1</span>');
    
    // 处理块级公式 $$...$$
    processedContent = processedContent.replace(/\$\$([^\$]+)\$\$/g, '<div class="math-formula block-formula">$1</div>');
    
    return processedContent;
  }

  // 朗读功能
  function toggleReading() {
    isReading.value = !isReading.value;
    
    if (isReading.value) {
      startReading();
    } else {
      stopReading();
    }
  }

  // 开始朗读
  function startReading() {
    if (!window.speechSynthesis) {
      console.error('浏览器不支持语音合成API');
      isReading.value = false;
      return;
    }
    
    // 获取当前页面内容的纯文本
    const contentElement = document.querySelector('.book-content');
    if (!contentElement) return;
    
    const textContent = contentElement.textContent || '';
    
    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(textContent);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    
    // 朗读结束时更新状态
    utterance.onend = () => {
      isReading.value = false;
    };
    
    // 开始朗读
    window.speechSynthesis.speak(utterance);
    
    // 保存当前朗读实例以便停止
    currentUtterance.value = utterance;
  }

  // 停止朗读
  function stopReading() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    isReading.value = false;
  }

  // 关键词高亮状态更新时重新渲染内容
  const enableKeywordHighlight = ref(false);
  function toggleKeywordHighlight() {
    enableKeywordHighlight.value = !enableKeywordHighlight.value;
    // 保存用户偏好
    localStorage.setItem('keywordHighlight', enableKeywordHighlight.value);
  }

  // 专业术语库
  // ...

  // 分享功能实现
  function shareContent() {
    const content = getCurrentPageContent();
    const url = window.location.href;
    const title = '《深度学习基础》';
    const text = `分享自《深度学习基础》：${document.querySelector('.book-content')?.textContent?.substring(0, 100)}...`;
    
    try {
      // 首先尝试使用现代分享API
      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url,
        }).catch(error => {
          console.log('分享失败:', error);
          // 如果分享API失败，回退到剪贴板复制
          fallbackShare();
        });
      } else {
        // 浏览器不支持分享API，回退到剪贴板复制
        fallbackShare();
      }
    } catch (error) {
      console.error('分享出错:', error);
      fallbackShare();
    }
    
    // 回退分享方法：复制到剪贴板
    function fallbackShare() {
      try {
        navigator.clipboard.writeText(text).then(() => {
          alert('内容已复制到剪贴板，您可以粘贴分享给他人。');
        }).catch(() => {
          alert('无法复制到剪贴板，请手动复制。');
        });
      } catch (e) {
        alert('您的浏览器不支持自动复制，请手动复制分享。');
      }
    }
  }
</script>

<style scoped>
  /* 笔记面板样式 */
  .side-notes-panel {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 0;
    background-color: #f8f9fa;
    border-left: 1px solid #e9ecef;
    transition: width 0.3s ease;
    overflow: hidden;
    z-index: 10;
  }

  .dark .side-notes-panel {
    background-color: #2d3748;
    border-left: 1px solid #4a5568;
  }

  .side-notes-panel.expanded {
    width: 320px;
  }

  .notes-toggle-button {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 40px;
    background-color: #f0f0f0;
    border-radius: 4px 0 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    border-right: none;
    z-index: 11;
  }

  .dark .notes-toggle-button {
    background-color: #4a5568;
    border-color: #2d3748;
  }

  .notes-content {
    padding: 15px;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  .dark .notes-header {
    border-bottom-color: #4a5568;
  }

  .notes-header h3 {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .notes-header h3 i {
    margin-right: 8px;
    color: #4299e1;
  }

  .add-note-btn {
    padding: 5px 10px;
    background-color: #4299e1;
    color: white;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .add-note-btn i {
    margin-right: 5px;
  }

  .notes-list {
    margin-bottom: 15px;
  }

  .empty-notes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    color: #a0aec0;
    text-align: center;
  }

  .empty-notes i {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .empty-notes .help-text {
    font-size: 12px;
    margin-top: 10px;
    max-width: 200px;
    line-height: 1.4;
  }

  .empty-notes .help-text i {
    font-size: 12px;
    margin: 0 2px;
    display: inline;
  }

  .note-item {
    background-color: white;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-left: 3px solid #4299e1;
  }

  .dark .note-item {
    background-color: #2d3748;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .note-item.active {
    border-left-color: #f6ad55;
  }

  .note-source-text {
    font-size: 12px;
    color: #718096;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #e2e8f0;
    font-style: italic;
  }

  .dark .note-source-text {
    color: #a0aec0;
    border-bottom-color: #4a5568;
  }

  .note-content {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .note-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .note-action-btn {
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #edf2f7;
    color: #4a5568;
    display: flex;
    align-items: center;
  }

  .dark .note-action-btn {
    background-color: #4a5568;
    color: #e2e8f0;
  }

  .note-action-btn i {
    margin-right: 4px;
    font-size: 10px;
  }

  .note-action-btn.delete {
    background-color: #fed7d7;
    color: #e53e3e;
  }

  .dark .note-action-btn.delete {
    background-color: #742a2a;
    color: #fc8181;
  }

  .note-timestamp {
    font-size: 10px;
    color: #a0aec0;
    text-align: right;
    margin-top: 5px;
  }

  .note-instructions {
    font-size: 12px;
    color: #718096;
    padding: 10px;
    background-color: #edf2f7;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .dark .note-instructions {
    background-color: #4a5568;
    color: #e2e8f0;
  }

  .note-instructions i {
    margin-right: 8px;
    color: #4299e1;
  }

  /* 书籍内容区域样式 */
  .book-content {
    padding: 20px;
    line-height: 1.6;
    font-size: 16px;
  }

  .book-content h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #2d3748;
  }

  .dark .book-content h1 {
    color: #e2e8f0;
  }

  .book-content p {
    margin-bottom: 16px;
  }

  /* 关键词高亮样式 */
  .keyword-highlight {
    background-color: rgba(255, 255, 0, 0.3);
    padding: 0 2px;
    border-radius: 2px;
  }

  /* 专业术语样式 */
  .technical-term {
    color: #4299e1;
    border-bottom: 1px dashed #4299e1;
    cursor: help;
  }

  /* 数学公式样式 */
  .math-formula {
    font-family: 'Cambria Math', serif;
  }

  .inline-formula {
    display: inline-block;
    margin: 0 2px;
  }

  .block-formula {
    display: block;
    margin: 10px 0;
    padding: 10px;
    text-align: center;
  }

  /* 高亮样式 */
  .highlight-yellow {
    background-color: rgba(255, 255, 0, 0.3);
    padding: 0 2px;
    border-radius: 2px;
  }

  /* 底部导航栏样式 */
  .book-footer {
    border-top: 1px solid #e2e8f0;
    padding: 10px 0;
    background-color: white;
  }

  .dark .book-footer {
    background-color: #1a202c;
    border-top-color: #2d3748;
  }

  /* 选择菜单样式 */
  .selection-menu {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* 笔记编辑框样式 */
  .note-editor {
    width: 90%;
    max-width: 400px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .side-notes-panel.expanded {
      width: 100%;
    }
  }
</style>
