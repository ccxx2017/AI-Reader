<template>
  <div>
    <h2 class="text-lg font-semibold">当前书籍信息</h2>
    <div class="bg-gray-800 p-3 rounded-lg mb-3">
      <div class="flex items-start">
        <!-- 书籍封面 -->
        <div class="w-14 h-20 bg-gray-700 rounded-sm overflow-hidden mr-3 flex-shrink-0 flex items-center justify-center">
          <i class="fas fa-book text-blue-400 text-xl"></i>
        </div>
        
        <!-- 书籍信息 -->
        <div class="flex-grow">
          <BookBasicInfo 
            :title="currentBook.title"
            :author="currentBook.author"
            :progress="currentBook.readingProgress"
          />
          
          <!-- 阅读进度条 -->
          <BookProgressBar :progress="currentBook.readingProgress" />
          
          <!-- 当前章节信息 -->
          <CurrentChapterInfo 
            :currentChapter="currentBook.currentChapter"
            :chapters="currentBook.chapters"
            @selectChapter="selectChapter"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BookBasicInfo from './BookBasicInfo.vue';
import BookProgressBar from './BookProgressBar.vue';
import CurrentChapterInfo from './CurrentChapterInfo.vue';

// 当前书籍数据
const currentBook = ref({
  title: '量子计算基础',
  author: 'Richard P. Feynman',
  readingProgress: 25, // 阅读进度百分比
  currentChapter: '第一章 量子计算概述',
  chapters: [
    '序言',
    '第一章 量子计算概述',
    '第二章 量子比特',
    '第三章 量子门与电路',
    '第四章 量子算法',
    '第五章 量子纠错',
    '第六章 量子计算机的物理实现',
    '附录 A 线性代数基础',
    '附录 B 量子力学基础',
    '索引'
  ]
});

// 选择章节的处理函数
function selectChapter(chapter) {
  console.log('选择章节:', chapter);
  currentBook.value.currentChapter = chapter;
  // 这里可以添加更多处理逻辑，例如通知其他组件切换章节等
}
</script>