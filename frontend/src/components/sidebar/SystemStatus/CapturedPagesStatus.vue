<template>
  <!-- 已捕获页面 - 可点击下拉 -->
  <div class="status-container" @click="toggleDropdown">
    <div class="status-header">
      <span class="status-title">
        <i class="fas fa-images status-icon"></i>
        已捕获页面
      </span>
      <div class="status-indicator-wrapper">
        <span class="page-counter">
          {{capturedPages.length}}
          <i class="fas" :class="showDropdown ? 'fa-chevron-up dropdown-icon open' : 'fa-chevron-down dropdown-icon'"></i>
        </span>
      </div>
    </div>
    
    <!-- 下拉菜单内容 -->
    <transition name="dropdown">
      <div v-if="showDropdown" class="captured-pages-dropdown">
        <!-- 排序和筛选选项 -->
        <div class="dropdown-header">
          <div class="sort-controls">
            <span class="sort-label">排序:</span>
            <select v-model="sortOrder" class="sort-select">
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="pageAsc">页码升序</option>
              <option value="pageDesc">页码降序</option>
            </select>
          </div>
          <div>
            <button @click.stop="toggleOnlyRecognized" class="filter-button" 
              :class="{'filter-active': showOnlyRecognized, 'filter-inactive': !showOnlyRecognized}">
              <i class="fas fa-check-circle filter-icon"></i>
              仅已识别
            </button>
          </div>
        </div>
        
        <div v-if="capturedPages.length === 0" class="empty-message">
          <i class="fas fa-info-circle"></i> 暂无已捕获页面
        </div>
        <div v-else class="pages-list">
          <div v-for="(page, index) in filteredPages" :key="page.id" class="captured-page-item">
            <div class="page-item-content">
              <!-- 页面缩略图 -->
              <div class="page-thumbnail" :data-page-id="page.id">
                <div class="thumbnail-placeholder">
                  <i class="fas fa-file-alt file-icon"></i>
                  <div class="page-number">第 {{page.pageNumber}} 页</div>
                </div>
                
                <!-- 缩略图上的快速操作按钮 -->
                <div class="thumbnail-actions">
                  <button @click.stop="handleJumpToPage(page)" class="thumbnail-action-btn jump-btn" title="跳转至该页">
                    <i class="fas fa-arrow-right action-icon"></i>
                    <span class="action-text">跳转至该页</span>
                  </button>
                  <button @click.stop="handleRescanPage(page)" class="thumbnail-action-btn rescan-btn" title="重新扫描">
                    <i class="fas fa-sync-alt action-icon"></i>
                    <span class="action-text">重新扫描</span>
                  </button>
                </div>
                
                <!-- 重新扫描进度覆盖 -->
                <div v-if="page.isRescanning" class="rescan-overlay">
                  <div class="rescan-text">重新扫描中...</div>
                  <div class="rescan-progress-bar">
                    <div class="rescan-progress-fill" :style="{width: `${page.rescanProgress}%`}"></div>
                  </div>
                </div>
              </div>
              
              <!-- 页面信息 -->
              <div class="page-info">
                <div class="page-title">第 {{page.pageNumber}} 页</div>
                <div class="page-timestamp">{{formatTimestamp(page.capturedAt)}}</div>
                <div class="page-status">
                  <span class="recognized-badge">
                    <i class="fas fa-check-circle badge-icon"></i>已识别
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown-footer">
          <button class="footer-button clear-button">
            <i class="fas fa-trash-alt"></i>清除
          </button>
          <button class="footer-button view-all-button">
            <i class="fas fa-external-link-alt"></i>全部查看
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

// 定义组件接收的属性
const props = defineProps({
  capturedPages: {
    type: Array,
    default: () => []
  }
});

// 定义组件的事件
const emit = defineEmits(['jumpToPage', 'rescanPage']);

// 下拉状态
const showDropdown = ref(false);
const sortOrder = ref('newest');
const showOnlyRecognized = ref(false);

// 过滤和排序后的页面列表
const filteredPages = computed(() => {
  let result = [...props.capturedPages];
  
  // 只显示已识别的页面
  if (showOnlyRecognized.value) {
    result = result.filter(page => page.isRecognized);
  }
  
  // 排序
  switch (sortOrder.value) {
    case 'newest':
      return result.sort((a, b) => b.capturedAt - a.capturedAt);
    case 'oldest':
      return result.sort((a, b) => a.capturedAt - b.capturedAt);
    case 'pageAsc':
      return result.sort((a, b) => a.pageNumber - b.pageNumber);
    case 'pageDesc':
      return result.sort((a, b) => b.pageNumber - a.pageNumber);
    default:
      return result;
  }
});

// 切换下拉菜单显示/隐藏
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// 切换仅显示已识别的页面
function toggleOnlyRecognized(event) {
  event.stopPropagation();
  showOnlyRecognized.value = !showOnlyRecognized.value;
}

// 跳转至指定页面
function handleJumpToPage(page) {
  emit('jumpToPage', page);
}

// 重新扫描页面
function handleRescanPage(page) {
  emit('rescanPage', page);
}

// 格式化时间戳显示
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}天前`;
  
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.status-container {
  background-color: rgba(31, 41, 55, 0.5); /* bg-gray-800/50 */
  padding: 0.625rem;
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-title {
  font-size: 0.875rem;
  color: #f97316; /* text-orange-500 */
  font-weight: 500;
  display: flex;
  align-items: center;
}

.status-icon {
  margin-right: 0.375rem;
}

.status-indicator-wrapper {
  display: flex;
  align-items: center;
}

.page-counter {
  font-size: 0.875rem;
  color: white;
  padding: 0 0.5rem;
  line-height: 1.5;
  border-radius: 9999px;
  background-color: #1d4ed8; /* bg-blue-700 */
  display: flex;
  align-items: center;
}

.dropdown-icon {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  transition: transform 0.3s;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.captured-pages-dropdown {
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dropdown-header {
  padding: 0.5rem;
  background-color: rgba(31, 41, 55, 0.8); /* bg-gray-800/80 */
  border-bottom: 1px solid #374151; /* border-gray-700 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-controls {
  display: flex;
  align-items: center;
}

.sort-label {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
  margin-right: 0.375rem;
}

.sort-select {
  background-color: #374151; /* bg-gray-700 */
  font-size: 0.75rem;
  color: #e5e7eb; /* text-gray-200 */
  padding: 0 0.375rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: none;
  outline: none;
}

.filter-button {
  font-size: 0.75rem;
  padding: 0 0.375rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
}

.filter-active {
  background-color: rgba(20, 83, 45, 0.5); /* bg-green-900/50 */
  color: #4ade80; /* text-green-400 */
}

.filter-inactive {
  background-color: #374151; /* bg-gray-700 */
  color: #9ca3af; /* text-gray-400 */
}

.filter-icon {
  font-size: 0.625rem;
  margin-right: 0.125rem;
}

.empty-message {
  text-align: center;
  padding: 0.75rem 0;
  color: #9ca3af; /* text-gray-400 */
}

.empty-message i {
  margin-right: 0.25rem;
}

.pages-list {
  max-height: 200px;
  overflow-y: auto;
}

.captured-page-item {
  padding: 0.5rem;
  border-bottom: 1px solid #374151; /* border-gray-700 */
  transition: background-color 0.2s;
  cursor: pointer;
}

.captured-page-item:last-child {
  border-bottom: none;
}

.captured-page-item:hover {
  background-color: rgba(75, 85, 99, 0.3); /* hover:bg-gray-600/30 */
}

.page-item-content {
  display: flex;
  align-items: flex-start;
}

.page-thumbnail {
  width: 3rem;
  height: 4rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.125rem;
  overflow: hidden;
  margin-right: 0.5rem;
  flex-shrink: 0;
  position: relative;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.file-icon {
  color: #6b7280; /* text-gray-500 */
  margin-bottom: 0.25rem;
}

.page-number {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.thumbnail-actions {
  opacity: 0;
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6); /* bg-black/60 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.page-thumbnail:hover .thumbnail-actions {
  opacity: 1;
}

.thumbnail-action-btn {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  border: none;
}

.jump-btn {
  background-color: #2563eb; /* bg-blue-600 */
  margin-bottom: 0.375rem;
}

.jump-btn:hover {
  background-color: #3b82f6; /* hover:bg-blue-500 */
}

.rescan-btn {
  background-color: #16a34a; /* bg-green-600 */
}

.rescan-btn:hover {
  background-color: #22c55e; /* hover:bg-green-500 */
}

.action-icon {
  font-size: 0.625rem;
  margin-right: 0.25rem;
}

.action-text {
  font-size: 0.625rem;
}

.rescan-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75); /* bg-black/75 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.rescan-text {
  font-size: 0.625rem;
  color: white;
  margin-bottom: 0.25rem;
}

.rescan-progress-bar {
  width: 75%;
  height: 0.25rem;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.25rem;
}

.rescan-progress-fill {
  height: 100%;
  background-color: #22c55e; /* bg-green-500 */
  border-radius: 0.25rem;
}

.page-info {
  flex-grow: 1;
}

.page-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #93c5fd; /* text-blue-300 */
  margin-bottom: 0.125rem;
}

.page-timestamp {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.page-status {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.recognized-badge {
  font-size: 0.75rem;
  padding: 0 0.375rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: rgba(20, 83, 45, 0.5); /* bg-green-900/50 */
  color: #4ade80; /* text-green-400 */
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
}

.badge-icon {
  font-size: 0.625rem;
  margin-right: 0.125rem;
}

.dropdown-footer {
  padding: 0.375rem;
  background-color: #374151; /* bg-gray-700 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-button {
  font-size: 0.75rem;
  color: #93c5fd; /* text-blue-300 */
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  transition: color 0.2s;
}

.footer-button:hover {
  color: #bfdbfe; /* hover:text-blue-200 */
}

.footer-button i {
  margin-right: 0.25rem;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 深色模式 */
:global(.dark) .status-container {
  background-color: rgba(55, 65, 81, 0.5); /* dark:bg-gray-700/50 */
}

:global(.dark) .status-title {
  color: #fb923c; /* dark:text-orange-400 */
}
</style>