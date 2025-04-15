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
          <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="分享">
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
              <!-- 轻量级状态指示器 -->
              <div v-if="showPageStatus" class="page-status absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs z-20">
                {{ pageStatusText }}
              </div>
              
              <!-- 当前页面 - 结合图1和图2的样式优点 -->
              <div class="page h-full overflow-y-auto relative bg-white dark:bg-gray-900" 
                  @mouseup="handleTextSelection" 
                  @contextmenu.prevent
                  style="position: relative;">
                <!-- 章节标题和页码 - 采用图2的样式 -->
                <div class="p-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ chapters[currentChapter]?.title || '章节标题' }}</h2>
                  <div class="flex justify-between items-center mt-1">
                    <div class="text-sm text-gray-600 dark:text-gray-300">Page {{ currentPageIndex + 1 }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      <button class="hover:text-blue-500 focus:outline-none p-1" title="添加书签">
                        <i class="far fa-bookmark"></i>
                      </button>
                      <button class="hover:text-blue-500 focus:outline-none p-1 ml-2" title="添加笔记">
                        <i class="far fa-sticky-note"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- 使用动态组件来渲染增强的书籍内容 -->
                <div v-html="processedContent" ref="pageContentRef" class="content-area bg-white dark:bg-gray-900 rounded-lg p-6 mb-2"></div>
                
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
      <button @click="saveNote" class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
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
  import { ref, inject, computed, onMounted, onUnmounted } from 'vue';
  import { marked } from 'marked';

  // 从上层组件注入书籍数据
  const { bookPages, currentPageIndex, navigatePageParent } = inject('bookData');

  // 页面内容引用
  const pageContentRef = ref(null);

  // 顶部和底部导航栏折叠状态
  const isHeaderCollapsed = ref(false);
  const isFooterCollapsed = ref(false);

  // 是否启用关键词高亮（默认关闭）
  const enableKeywordHighlight = ref(false);
  const forceRefresh = ref(0); // 添加一个变量来强制视图更新

  // 模拟书籍数据
  const demoBookContent = ref([
    `
# 深度学习概述

## 深度学习的关键突破

深度学习是机器学习的一个分支，通过模拟人脑的神经网络结构来学习数据的层次化表示。近年来，得益于三个关键因素，深度学习取得了突破性进展：

1. **大规模数据集**：如ImageNet包含上百万张带标签的图像，为训练复杂模型提供了足够样本
2. **计算能力的提升**：GPU并行计算能力的发展使得训练大型神经网络成为可能
3. **算法创新**：包括更有效的训练方法、激活函数和网络结构

这些进步使深度学习在计算机视觉、自然语言处理等领域实现了超越传统方法的性能。

与传统机器学习相比，深度学习自动学习特征的能力是其最大优势。在传统机器学习中，特征工程是一个耗时且需要专业知识的过程，而深度学习模型可以直接从原始数据中学习有用的特征表示。
  `,
  `
## 量子计算基础

量子计算是一种利用量子力学原理进行信息处理的新型计算范式。与经典计算使用的比特(0或1)不同，量子计算使用量子比特(qubits)，可以同时处于多个状态。

量子比特的这种特性带来两个关键优势：
- **量子叠加**：单个量子比特可以同时存在于0和1的混合状态
- **量子纠缠**：多个量子比特可以形成关联，使其状态彼此依赖

这些特性使得量子计算在特定问题上(如大数分解、数据库搜索)能够提供指数级的速度提升。
  `,
  `
# 实践应用

## 模型训练方法

深度学习模型的训练是一个迭代优化过程，主要包括以下步骤：

1. **数据准备**：收集并预处理数据，通常划分为训练集、验证集和测试集
2. **模型设计**：根据任务选择适当的网络架构，如CNN用于图像，RNN/Transformer用于序列数据
3. **损失函数选择**：根据任务类型(分类、回归、生成等)选择合适的损失函数
4. **优化器配置**：选择如SGD、Adam等优化算法，并设置合适的学习率
5. **训练循环**：
   - 前向传播计算预测
   - 计算损失
   - 反向传播更新权重
6. **超参数调整**：通过验证集性能调整批次大小、学习率等
7. **性能评估**：在测试集上评估最终模型

在实际应用中，还常常需要考虑数据增强、正则化、早停等技术来提高模型泛化能力。
  `,
  `
## 部署与优化

将训练好的深度学习模型部署到实际环境中需要考虑多方面因素：

### 模型优化技术
- **量化**：将权重从32位浮点数转换为8位或更低精度
- **剪枝**：移除对输出影响较小的连接或神经元
- **知识蒸馏**：将大模型的"知识"迁移到小模型中
- **模型压缩**：减少模型大小，降低内存需求

### 部署环境
- **云服务**：高性能但需网络连接，适合复杂模型
- **边缘设备**：本地推理，低延迟，适合实时应用
- **移动设备**：资源受限，需要极致优化

### 性能监控与维护
- **推理性能**：监控延迟、吞吐量等指标
- **准确率漂移**：检测模型在实际数据上的表现变化
- **模型更新**：制定模型版本迭代策略

优秀的部署方案需要在模型性能、计算资源和用户体验之间找到平衡点。
  `
]);

// 当前所在章节
const currentChapter = ref(0);

// 模拟章节数据
const chapters = ref([
  {
    title: '第一章：深度学习概述',
    pageIndex: 0,
    sections: [
      { title: '1.1 深度学习的关键突破', page: 0 },
      { title: '1.2 量子计算基础', page: 1 }
    ]
  },
  {
    title: '第二章：实践应用',
    pageIndex: 2,
    sections: [
      { title: '2.1 模型训练方法', page: 2 },
      { title: '2.2 部署与优化', page: 3 }
    ]
  }
]);

// 书签数据
const bookmarks = ref([]);

// 页面笔记
const pageNotes = ref([]);

// 笔记ID计数器
const noteIdCounter = ref(1);

// 笔记标记位置
const noteMarkPosition = ref({
  top: 0,
  left: 0,
  pageIndex: 0
});

// 状态控制变量
const showChapterNav = ref(false);
const showBookmarks = ref(false);
const showSelectionMenu = ref(false);
const showNoteEditor = ref(false);
const showTermDefinition = ref(false);
const showPageStatus = ref(false);
const pageStatusText = ref('');
const isReading = ref(false);
const showVoiceOptions = ref(false);
const showUploadVoiceOption = ref(false);
const showNotesPanel = ref(false); // 控制笔记面板显示/隐藏

// 位置信息
const selectionPosition = ref({ top: 0, left: 0 });
const noteEditorPosition = ref({ top: 0, left: 0 });
const termPosition = ref({ top: 0, left: 0 });

// 当前选中的文本内容
const selectedText = ref('');
const noteContent = ref('');
const currentTerm = ref({ term: '', definition: '' });

// 选中文本的位置信息
const selectedTextPosition = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
});

// 朗读功能相关状态
const readingSpeed = ref(1.0);
const selectedVoice = ref('default');
const availableVoices = ref([
  { id: 'default', name: '默认女声', icon: 'fa-female' },
  { id: 'male', name: '默认男声', icon: 'fa-male' },
  { id: 'child', name: '儿童声音', icon: 'fa-child' },
  { id: 'elder', name: '老者声音', icon: 'fa-user-tie' }
]);

// 语音合成对象
let speechSynthesis = null;
let speechUtterance = null;

// 增强页面内容（关键词高亮、术语标记等）
const processedContent = computed(() => {
  let content = '';
  
  if (currentPageIndex.value < demoBookContent.value.length) {
    content = demoBookContent.value[currentPageIndex.value];
  }
  
  // 使用标记语言转换内容
  content = marked(content);
  
  // 处理数学公式
  content = processMathFormulas(content);
  
  // 增强内容，根据enableKeywordHighlight状态决定是否高亮关键词
  if (enableKeywordHighlight.value) {
    content = highlightKeywords(content);
  }
  content = markTechnicalTerms(content);
  
  return content;
});

// 关键词高亮处理函数
function highlightKeywords(content) {
  // 关键词列表
  const keywords = [
    'GPU', 'ImageNet', '深度学习', '神经网络', '自动学习', '特征工程', '卷积神经网络',
    '量化', '剪枝', '知识蒸馏', '模型压缩', '云服务', '边缘设备', '移动设备'
  ];
  
  // 创建一个临时的DOM元素来处理HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // 递归处理文本节点
  function processNode(node) {
    // 如果是文本节点
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      let highlighted = false;
      
      // 检查是否含有关键词
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          // 分割文本并添加高亮
          const parts = text.split(keyword);
          if (parts.length > 1) {
            // 创建一个文档片段来保存修改后的内容
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < parts.length; i++) {
              // 添加分割部分
              if (parts[i]) {
                fragment.appendChild(document.createTextNode(parts[i]));
              }
              
              // 添加高亮关键词（除了最后一个分隔符后面）
              if (i < parts.length - 1) {
                const span = document.createElement('span');
                span.className = 'keyword';
                span.textContent = keyword;
                fragment.appendChild(span);
              }
            }
            
            // 使用新的片段替换当前节点
            node.parentNode.replaceChild(fragment, node);
            highlighted = true;
            break;
          }
        }
      }
      
      // 如果没有高亮，就继续检查下一个节点
      return highlighted;
    } 
    // 如果是元素节点，处理其子节点
    else if (node.nodeType === Node.ELEMENT_NODE) {
      // 避免处理已经是关键词高亮的元素
      if (node.className === 'keyword') {
        return false;
      }
      
      // 处理子节点（因为DOM可能在处理过程中变化，使用while循环）
      const childNodes = Array.from(node.childNodes);
      for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        const highlighted = processNode(childNode);
        // 如果节点被高亮替换了，需要跳过下一个节点，因为DOM结构已经改变
        if (highlighted) {
          i++;
        }
      }
    }
    
    return false;
  }
  
  // 从根节点开始处理
  processNode(tempDiv);
  
  return tempDiv.innerHTML;
}

// 关键词高亮状态更新时重新渲染内容
function toggleKeywordHighlight() {
  enableKeywordHighlight.value = !enableKeywordHighlight.value;
  // 显示状态提示
  showPageStatusMessage(enableKeywordHighlight.value ? '已开启关键词高亮' : '已关闭关键词高亮');
  
  // 强制刷新视图
  forceRefresh.value += 1;
}

// 处理文本选择
function handleTextSelection() {
  const selection = window.getSelection();
  
  if (selection.toString().trim().length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // 获取书籍内容容器的位置
    const pageContent = pageContentRef.value;
    if (!pageContent) return;
    
    const container = pageContent.getBoundingClientRect();
    const pageElement = document.querySelector('.page');
    const scrollTop = pageElement ? pageElement.scrollTop : 0;
    
    // 计算选择菜单位置 - 放在选中文本的右侧
    selectionPosition.value.left = rect.right - container.left + 5; // 右侧偏移5px
    selectionPosition.value.top = rect.top - container.top + (rect.height / 2) + scrollTop; // 垂直居中并考虑滚动
    
    // 确保菜单不会超出页面边界
    const pageWidth = pageContent.offsetWidth;
    if (selectionPosition.value.left + 120 > pageWidth) { // 假设菜单宽度约为120px
      selectionPosition.value.left = Math.max(10, pageWidth - 130);
    }
    
    // 保存选中文本的位置信息，供添加笔记使用
    selectedTextPosition.value.top = rect.top;
    selectedTextPosition.value.left = rect.left;
    selectedTextPosition.value.bottom = rect.bottom;
    selectedTextPosition.value.right = rect.right;
    
    selectedText.value = selection.toString();
    showSelectionMenu.value = true;
  } else {
    showSelectionMenu.value = false;
  }
}

// 添加当前页为书签
function addCurrentPageBookmark() {
  // 从页面内容提取标题
  const pageContent = demoBookContent.value[currentPageIndex.value];
  const titleMatch = pageContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : `页面 ${currentPageIndex.value + 1}`;
  
  // 提取预览内容
  const preview = pageContent.substring(0, 100).replace(/[#*_]/g, '') + '...';
  
  bookmarks.value.push({
    pageIndex: currentPageIndex.value,
    title: title,
    preview: preview,
    timestamp: new Date().toISOString()
  });
  
  showPageStatus.value = true;
  pageStatusText.value = '书签已添加';
  setTimeout(() => {
    showPageStatus.value = false;
  }, 2000);
}

// 删除书签
function removeBookmark(index) {
  bookmarks.value.splice(index, 1);
}

// 跳转到书签页面
function navigateToBookmark(bookmark) {
  currentPageIndex.value = bookmark.pageIndex;
  showBookmarks.value = false;
}

// 导航到指定章节
function navigateToChapter(chapterIndex) {
  // 更新当前章节和页码
  currentChapter.value = chapterIndex;
  
  // 获取章节对应的页面索引
  const chapter = chapters.value[chapterIndex];
  if (chapter && chapter.sections && chapter.sections.length > 0) {
    currentPageIndex.value = chapter.sections[0].page || 0;
  }
  
  // 关闭章节导航
  showChapterNav.value = false;
  
  // 显示页面状态提示
  showPageStatusMessage(`已跳转到${chapter.title}`);
}

// 导航到指定小节
function navigateToSection(chapterIndex, sectionIndex) {
  // 更新当前章节
  currentChapter.value = chapterIndex;
  
  // 获取对应小节的页面索引
  const chapter = chapters.value[chapterIndex];
  if (chapter && chapter.sections && chapter.sections[sectionIndex]) {
    currentPageIndex.value = chapter.sections[sectionIndex].page || 0;
  }
  
  // 关闭章节导航
  showChapterNav.value = false;
  
  // 显示页面状态提示
  showPageStatusMessage(`已跳转到${chapter.sections[sectionIndex].title}`);
}

// 跳转到指定页面
function nextPage() {
  if (currentPageIndex.value < demoBookContent.value.length - 1) {
    currentPageIndex.value = currentPageIndex.value + 1;
    
    // 更新当前章节
    updateCurrentChapter();
  }
}

function previousPage() {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value = currentPageIndex.value - 1;
    
    // 更新当前章节
    updateCurrentChapter();
  }
}

// 更新当前章节
function updateCurrentChapter() {
  // 在实际应用中，这里应该根据currentPageIndex找到对应的章节
  // 简化实现：直接将第一章设为当前章节
  currentChapter.value = 0;
}

// 添加页面状态提示函数 
function showPageStatusMessage(message) {
  pageStatusText.value = message;
  showPageStatus.value = true;
  
  // 2秒后自动隐藏
  setTimeout(() => {
    showPageStatus.value = false;
  }, 2000);
}

// 高亮选中的文本
function highlightSelection(color) {
  // 在实际应用中，这里需要更复杂的处理，将高亮信息持久化并在重新渲染时保留
  // 简化处理：添加临时高亮并关闭选择菜单
  showSelectionMenu.value = false;
  
  showPageStatusMessage(`文本已高亮`);
}

// 为选中文本添加笔记
function addNoteToSelection() {
  noteContent.value = '';
  showSelectionMenu.value = false;
  showNoteEditor.value = true;
}

// 计算当前页面的笔记
const currentPageNotes = computed(() => {
  return pageNotes.value.filter(note => note.pageIndex === currentPageIndex.value);
});

// 当前活跃的笔记索引（用于高亮）
const activeNoteIndex = ref(-1);

// 高亮特定笔记
function highlightNote(index) {
  activeNoteIndex.value = index;
}

// 取消高亮
function unhighlightNote() {
  activeNoteIndex.value = -1;
}

// 保存笔记
function saveNote(note, index) {
  // 如果是已存在的笔记
  if (note && typeof index === 'number') {
    note.editing = false;
    note.timestamp = new Date().toLocaleString('zh-CN');
    
    // 如果笔记内容为空，则删除这条笔记
    if (!note.text || note.text.trim() === '') {
      deleteNote(index);
    }
    
    showPageStatusMessage('笔记已保存');
    return;
  }
  
  // 以下是为选中文本添加笔记的逻辑
  if (noteContent.value.trim()) {
    const currentTime = new Date();
    const timeString = currentTime.toLocaleString('zh-CN');
    
    // 添加新笔记 - 保存选中的文本内容
    pageNotes.value.push({
      id: noteIdCounter.value++,
      pageIndex: currentPageIndex.value,
      sourceText: selectedText.value,
      text: noteContent.value,
      timestamp: timeString,
      editing: false,
      active: false
    });
    
    // 清空选中内容和笔记编辑器
    noteContent.value = '';
    selectedText.value = '';
    showingNoteEditor.value = false;
    showPageStatusMessage('笔记已添加');
  } else {
    showPageStatusMessage('笔记内容不能为空');
  }
}

// 显示笔记内容
function showNoteContent(note, index) {
  note.editing = true;  // 设置为编辑模式
  highlightNote(index);
}

// 关闭笔记编辑框
function closeNoteEditor() {
  showNoteEditor.value = false;
  noteContent.value = '';
}

// 询问关于选中内容
function askAboutSelection() {
  // 在实际应用中，这里应发送选中内容到AI助手进行问答
  // 简化处理：关闭选择菜单并显示状态消息
  showSelectionMenu.value = false;
  
  showPageStatusMessage(`正在分析: "${selectedText.value.substring(0, 20)}..."`);
}

// 术语点击处理 - 在组件挂载后添加事件监听
onMounted(() => {
  // 添加术语点击事件处理（保持原有代码不变）
  pageContentRef.value.addEventListener('click', (e) => {
    let target = e.target;
    
    // 检查是否点击了术语或术语图标
    if (target.classList.contains('term-icon')) {
      target = target.parentElement;
    }
    
    if (target.classList.contains('term')) {
      const term = target.getAttribute('data-term');
      const termInfo = technicalTerms.value.find(t => t.term === term);
      
      if (termInfo) {
        // 获取术语元素的位置
        const rect = target.getBoundingClientRect();
        const container = pageContentRef.value.getBoundingClientRect();
        
        termPosition.top = rect.bottom - container.top + 10;
        termPosition.left = rect.left - container.left;
        
        currentTerm.term = termInfo.term;
        currentTerm.definition = termInfo.definition;
        
        showTermDefinition.value = true;
      }
    }
  });
  
  // 直接处理底部灰色拖动条 - 使用最精确的方法，不影响中间拖动条
  setTimeout(() => {
    // 使用更精确的查找方法找到底部灰色拖动条
    const bookPanel = document.getElementById('book-panel');
    const bookContent = bookPanel.querySelector('.book-content-wrapper');
    const bookFooter = bookPanel.querySelector('.book-footer');
    
    if (bookContent && bookFooter) {
      // 查找内容区域和页脚之间的所有元素
      const contentRect = bookContent.getBoundingClientRect();
      const footerRect = bookFooter.getBoundingClientRect();
      
      // 尝试直接选择和处理这个位置的元素
      const potentialDragBars = document.querySelectorAll('#book-panel > *');
      potentialDragBars.forEach(el => {
        if (el !== bookContent && el !== bookFooter) {
          const rect = el.getBoundingClientRect();
          
          // 检查元素是否正好在内容区和底部导航之间
          if (rect.top >= contentRect.bottom - 10 && 
              rect.bottom <= footerRect.top + 10 && 
              rect.height < 15) {
            
            console.log('找到底部灰色拖动条:', el);
            
            // 直接通过父元素移除
            try {
              el.parentNode.removeChild(el);
            } catch (e) {
              // 如果无法移除，则隐藏
              el.style.display = 'none';
              el.style.height = '0';
              el.style.visibility = 'hidden';
              el.style.pointerEvents = 'none';
            }
          }
        }
      });
      
      // 确保内容区和页脚之间没有间隙
      bookContent.style.marginBottom = '0';
      bookFooter.style.marginTop = '0';
      bookFooter.style.borderTop = '1px solid #e5e7eb';
    }
  }, 300);
});

// 关闭术语定义弹窗
function closeTermDefinition() {
  showTermDefinition.value = false;
}

// 了解更多关于术语
function askMoreAboutTerm() {
  // 在实际应用中，这里应发送术语到AI助手进行详细解释
  // 简化处理：关闭弹窗并显示状态消息
  showTermDefinition.value = false;
  
  showPageStatusMessage(`正在深入解析: "${currentTerm.term}"`);
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
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
    speechUtterance = new SpeechSynthesisUtterance();
    
    // 获取纯文本内容（移除HTML标签）
    const textContent = demoBookContent.value[currentPageIndex.value];
    speechUtterance.text = textContent.replace(/[#*_]/g, '');
    
    // 设置语速
    speechUtterance.rate = readingSpeed.value;
    
    // 语音选择逻辑 - 在实际应用中需要根据实际可用声音进行设置
    speechSynthesis.speak(speechUtterance);
    
    // 朗读完成事件
    speechUtterance.onend = () => {
      if (currentPageIndex.value < demoBookContent.value.length - 1) {
        // 自动翻到下一页继续朗读
        currentPageIndex.value = currentPageIndex.value + 1;
        setTimeout(() => {
          if (isReading.value) {
            startReading();
          }
        }, 1000);
      } else {
        isReading.value = false;
      }
    };
  } else {
    showPageStatusMessage('您的浏览器不支持语音合成');
    isReading.value = false;
  }
}

// 停止朗读
function stopReading() {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
}

// 调整朗读速度
function adjustReadingSpeed(delta) {
  readingSpeed.value = Math.max(0.5, Math.min(2.0, readingSpeed.value + delta));
  
  if (isReading.value && speechUtterance) {
    // 重新开始朗读以应用新速度
    stopReading();
    startReading();
  }
}

// 切换声音选项面板
function toggleVoiceOptions() {
  showVoiceOptions.value = !showVoiceOptions.value;
}

// 选择声音
function selectVoice(voiceId) {
  selectedVoice.value = voiceId;
  
  if (isReading.value) {
    // 使用新的声音重新开始朗读
    stopReading();
    startReading();
  }
  
  showVoiceOptions.value = false;
}

// 截断文本，防止过长
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// 删除笔记
function deleteNote(index) {
  // 找到要删除的笔记在全局笔记数组中的索引
  const noteToDelete = currentPageNotes.value[index];
  const globalIndex = pageNotes.value.findIndex(n => 
    n.pageIndex === noteToDelete.pageIndex && 
    n.timestamp === noteToDelete.timestamp
  );
  
  if (globalIndex !== -1) {
    pageNotes.value.splice(globalIndex, 1);
    showPageStatusMessage('笔记已删除');
  }
}

// 切换笔记面板显示
function toggleNotesPanel() {
  showNotesPanel.value = !showNotesPanel.value;
  
  // 移除底部灰色拖动条
  setTimeout(() => {
    // 查找页面中所有可能的拖动条元素
    const selectors = [
      '.gutter-horizontal', 
      '.gutter-vertical', 
      '.gutter', 
      '[class*="splitter"]', 
      '[class*="handle"]', 
      '[class*="drag"]', 
      '[class*="resize"]'
    ];
    
    // 查找所有匹配的元素
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // 检查元素的位置，找出位于阅读区域和底部导航之间的元素
        if (
          // 检查元素是否在页面底部区域
          rect.bottom > window.innerHeight - 150 && 
          rect.top > window.innerHeight / 2 && 
          rect.width > 50 // 是水平拖动条
        ) {
          // 这可能是拖动分隔器，移除它
          el.style.display = 'none';
          el.style.height = '0';
          el.style.pointerEvents = 'none';
          
          // 阻止事件监听和传播
          el.onmousedown = (e) => { e.stopPropagation(); return false; };
          el.ontouchstart = (e) => { e.stopPropagation(); return false; };
          
          // 修改元素样式使其不可见
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.position = 'absolute';
          el.style.zIndex = '-9999';
          el.style.pointerEvents = 'none';
          
          // 如果可能，从DOM中移除元素
          if (el.parentNode) {
            try {
              el.parentNode.removeChild(el);
            } catch (e) {
              console.log('无法移除元素，应用样式隐藏');
            }
          }
        }
      });
    });
    
    // 特殊处理：在book-content-wrapper和book-footer之间可能存在的拖动条
    const contentWrapper = document.querySelector('.book-content-wrapper');
    const footer = document.querySelector('.book-footer');
    
    if (contentWrapper && footer) {
      // 移除任何可能位于这两者之间的元素
      const wrappedRect = contentWrapper.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      
      // 查找所有位于这个区域的元素
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // 如果元素位于内容区域底部和底部导航之间
        if (
          rect.top >= wrappedRect.bottom - 10 && 
          rect.bottom <= footerRect.top + 10 &&
          rect.height < 20 && // 拖动条通常高度很小
          el !== footer && 
          !footer.contains(el) && 
          el !== contentWrapper && 
          !contentWrapper.contains(el)
        ) {
          // 隐藏或移除这个元素
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
          el.style.opacity = '0';
        }
      });
    }
  }, 100);
}

// 添加空白笔记
function addEmptyNote() {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleString('zh-CN');
  
  pageNotes.value.push({
    id: noteIdCounter.value++,
    pageIndex: currentPageIndex.value,
    sourceText: '直接添加的笔记',
    text: '',
    timestamp: timeString,
    editing: true,
    active: false
  });
  
  showPageStatusMessage('已添加新笔记');
}

// 切换章节导航显示
function toggleChapterNav() {
  showChapterNav.value = !showChapterNav.value;
  showBookmarks.value = false;
  showVoiceOptions.value = false;
}

// 切换书签面板显示
function toggleBookmarks() {
  showBookmarks.value = !showBookmarks.value;
  showChapterNav.value = false;
  showVoiceOptions.value = false;
}

// 专业术语库
const technicalTerms = ref([
  { 
    term: '深度神经网络', 
    definition: '具有多个隐藏层的人工神经网络结构，能够学习高度抽象的特征表示。', 
    icon: 'fa-brain' 
  },
  { 
    term: '特征工程', 
    definition: '从原始数据中提取有用特征的过程，是传统机器学习中的重要步骤。', 
    icon: 'fa-cogs' 
  },
  { 
    term: 'GPU', 
    definition: '图形处理单元，一种专门设计用于快速处理和渲染图像的处理器，在深度学习中被广泛用于加速训练过程。', 
    icon: 'fa-microchip' 
  },
  { 
    term: 'ImageNet', 
    definition: '一个大规模的视觉数据库，包含超过1400万张带标注的图像，是计算机视觉研究的重要基准。', 
    icon: 'fa-image' 
  },
  { 
    term: '反向传播', 
    definition: '神经网络学习的核心算法，通过计算损失函数对网络参数的梯度，从后向前更新网络权重。', 
    icon: 'fa-exchange-alt' 
  }
]);

// 术语标记处理
function markTechnicalTerms(content) {
  let processedContent = content;
  
  technicalTerms.value.forEach(term => {
    const regex = new RegExp(`(?<!<[^>]*)(\\b${term.term}\\b)(?![^<]*>)`, 'g');
    processedContent = processedContent.replace(regex, `<span class="term" data-term="${term.term}">$1<span class="annotation-mark" title="点击查看解释"><i class="fas ${term.icon}"></i></span></span>`);
  });
  
  return processedContent;
}

// 调整字体大小
function adjustFontSize(delta) {
  const content = document.querySelector('.content-area');
  if (content) {
    const currentSize = parseFloat(window.getComputedStyle(content).fontSize);
    const newSize = currentSize + delta;
    if (newSize >= 12 && newSize <= 24) {
      content.style.fontSize = `${newSize}px`;
    }
  }
}

// 切换顶部导航栏显示/隐藏
function toggleHeader() {
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
  // 显示状态提示
  showPageStatusMessage(isHeaderCollapsed.value ? '已隐藏顶部导航栏' : '已显示顶部导航栏');
}

// 切换底部导航栏显示/隐藏
function toggleFooter() {
  isFooterCollapsed.value = !isFooterCollapsed.value;
  // 显示状态提示
  showPageStatusMessage(isFooterCollapsed.value ? '已隐藏底部导航栏' : '已显示底部导航栏');
}

// 增加数学公式处理函数
function processMathFormulas(content) {
  // 识别并处理行内公式: $formula$
  let processedContent = content.replace(/\$([^$]+)\$/g, '<span class="inline-formula">$1</span>');
  
  // 识别并处理块级公式: $$formula$$
  processedContent = processedContent.replace(/\$\$([^$]+)\$\$/g, '<div class="formula-container"><div class="formula">$1</div></div>');
  
  return processedContent;
}

</script>

<style scoped>
.panel-container {
  height: 100%;
  transition: all 0.3s ease;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.book-content-wrapper {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.book {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-content {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.page {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

/* 深色模式下调整页面背景 */
:root.dark .page {
  background-color: #1f2937; /* 与笔记区域背景色保持一致 */
  color: #e5e7eb; /* 确保文本在深色背景下可读 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.book-footer {
  height: 50px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white; /* 确保背景为白色 */
  z-index: 10;
  position: relative; /* 确保定位正确 */
  margin-top: 0 !important; /* 消除和拖动条的间隙 */
}

.dark .book-footer {
  background-color: #1f2937;
  border-top-color: #374151;
}

/* 添加连接内容区和底部导航的样式 */
.book-content-wrapper {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  border-bottom: none !important;
}

/* 移除底部灰色拖动条的专用样式 */
.book-content-wrapper + div:not(#resizer):not(.resizer):not(.book-footer):not(.card):not(.panel-container):not(.side-notes-panel),
.book-content-wrapper ~ div:not(#resizer):not(.resizer):not(.book-content):not(.book-footer):not(.card):not(.panel-container):not(.side-notes-panel)[style*="cursor: col-resize"],
.book-content-wrapper ~ div:not(#resizer):not(.resizer):not(.book-content):not(.book-footer):not(.card):not(.panel-container):not(.side-notes-panel)[style*="height: 6px"],
.book-content-wrapper ~ div:not(#resizer):not(.resizer):not(.book-content):not(.book-footer):not(.card):not(.panel-container):not(.side-notes-panel)[style*="height:6px"] {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  z-index: -999 !important;
  height: 0 !important;
  width: 0 !important;
  min-height: 0 !important;
  min-width: 0 !important;
  max-height: 0 !important;
  max-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  visibility: hidden !important;
  overflow: hidden !important;
}

.book-footer {
  border-top: 1px solid #e5e7eb;
  padding: 8px 0;
  margin-top: 0;
  background-color: #fff;
  z-index: 10;
}

.dark .book-footer {
  border-color: #374151;
  background-color: #1f2937;
}

/* 内容区域样式 - 结合图1和图2的优点 */
.content-area {
  font-size: 16px;
  line-height: 1.7;
  color: #374151;
  padding: 20px 30px;
}

.dark .content-area {
  color: #e5e7eb;
}

/* 高亮关键词样式 - 类似图2的黄色高亮 */
.keyword {
  background-color: #fff3a1;
  color: #000;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
  display: inline;
}

.dark .keyword {
  background-color: #ffec99;
  color: #000;
}

/* 链接样式增强 - 类似图1 */
.content-area a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.content-area a:hover {
  border-color: #3b82f6;
}

.dark .content-area a {
  color: #60a5fa;
}

.dark .content-area a:hover {
  border-color: #60a5fa;
}

/* 底部导航区域 */
.navigation-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 折叠按钮样式 */
.header-collapse-btn, .footer-collapse-btn {
  opacity: 0.5;
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
}

.header-collapse-btn:hover, .footer-collapse-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background-color: #e5e7eb;
}

.dark .header-collapse-btn:hover, .dark .footer-collapse-btn:hover {
  background-color: #4b5563;
}

.header-collapse-btn {
  top: 8px;
  right: 8px;
}

.footer-collapse-btn {
  bottom: 8px;
  right: 8px;
}

/* 折叠状态下的按钮位置 */
.top-actions-collapsed {
  top: 0;
}

.bottom-actions-collapsed {
  bottom: 0;
}

/* 折叠按钮图标旋转动画 */
.header-collapse-btn i, .footer-collapse-btn i {
  transition: transform 0.3s ease;
  color: #6b7280;
}

/* 折叠按钮样式 */
.header-collapse-btn-collapsed {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.header-collapse-btn-collapsed:hover {
  opacity: 1;
  transform: scale(1.05);
}

/* 笔记面板样式 */
.side-notes-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 0;
  background-color: #fff;
  transition: all 0.3s ease;
  overflow: hidden;
  border-left: 1px solid #e5e7eb;
  z-index: 15;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0);
}

.dark .side-notes-panel {
  background-color: #1f2937;
  border-left-color: #374151;
}

.side-notes-panel.expanded {
  width: 320px;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
}

.dark .side-notes-panel.expanded {
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);
}

.notes-toggle-button {
  position: absolute;
  left: -36px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 60px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 6px 0 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 5;
  transition: all 0.2s ease;
}

.dark .notes-toggle-button {
  background-color: #2d3748;
  border-color: #4b5563;
  color: #e2e8f0;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}

.notes-toggle-button:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
  width: 40px;
  left: -40px;
}

.dark .notes-toggle-button:hover {
  background-color: #374151;
  color: #60a5fa;
}

.notes-content {
  height: 100%;
  width: 100%;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .notes-header {
  border-bottom-color: #4b5563;
}

.notes-header h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
}

.notes-header h3 i {
  margin-right: 0.5rem;
  color: #4b5563;
}

.dark .notes-header h3 {
  color: #f9fafb;
}

.dark .notes-header h3 i {
  color: #9ca3af;
}

.add-note-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.dark .add-note-btn {
  background-color: #4f46e5;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.4);
}

.add-note-btn:hover {
  background-color: #2563eb;
}

.dark .add-note-btn:hover {
  background-color: #4338ca;
}

.add-note-btn i {
  margin-right: 0.375rem;
  font-size: 0.75rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

.empty-notes {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  margin: 1rem 0;
  background-color: #f9fafb;
}

.dark .empty-notes {
  color: #9ca3af;
  border-color: #4b5563;
  background-color: #1e293b;
}

.empty-notes i {
  font-size: 2rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.dark .empty-notes i {
  color: #6b7280;
}

.empty-notes p {
  margin: 0.5rem 0;
}

.empty-notes .help-text {
  margin-top: 1rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: #9ca3af;
  max-width: 90%;
}

.dark .empty-notes .help-text {
  color: #6b7280;
}
</style>
