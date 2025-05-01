<template>
  <div class="book-info-container">
    <h2 class="panel-title">当前书籍信息</h2>
    <div class="book-card">
      <div class="book-content">
        <!-- 书籍封面 -->
        <div class="book-cover">
          <i class="fas fa-book book-icon"></i>
        </div>
        
        <!-- 书籍信息 -->
        <div class="book-details">
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

<style scoped>
.book-info-container {
  margin-bottom: 1rem;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.book-card {
  background-color: #1f2937; /* bg-gray-800 */
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.book-content {
  display: flex;
  align-items: flex-start;
}

.book-cover {
  width: 3.5rem;
  height: 5rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.125rem;
  overflow: hidden;
  margin-right: 0.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-icon {
  color: #60a5fa; /* text-blue-400 */
  font-size: 1.25rem;
}

.book-details {
  flex-grow: 1;
}
</style>