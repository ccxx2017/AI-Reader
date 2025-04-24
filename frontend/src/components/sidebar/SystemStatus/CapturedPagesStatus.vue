<template>
  <!-- 已捕获页面 - 可点击下拉 -->
  <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg cursor-pointer relative" @click="toggleDropdown">
    <div class="flex items-center justify-between">
      <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
        <i class="fas fa-images mr-1.5"></i>
        已捕获页面
      </span>
      <div class="flex items-center">
        <span class="text-sm text-white px-2 py-0.5 rounded-full bg-blue-700 flex items-center">
          {{capturedPages.length}}
          <i class="fas" :class="showDropdown ? 'fa-chevron-up ml-1 text-xs transition-transform duration-300' : 'fa-chevron-down ml-1 text-xs transition-transform duration-300'"></i>
        </span>
      </div>
    </div>
    
    <!-- 下拉菜单内容 -->
    <transition name="dropdown">
      <div v-if="showDropdown" class="captured-pages-dropdown mt-2 rounded-lg overflow-hidden">
        <!-- 排序和筛选选项 -->
        <div class="p-2 bg-gray-800/80 border-b border-gray-700 flex justify-between items-center">
          <div class="flex items-center">
            <span class="text-xs text-gray-300 mr-1.5">排序:</span>
            <select v-model="sortOrder" class="bg-gray-700 text-xs text-gray-200 px-1.5 py-0.5 rounded border-none outline-none">
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="pageAsc">页码升序</option>
              <option value="pageDesc">页码降序</option>
            </select>
          </div>
          <div>
            <button @click.stop="toggleOnlyRecognized" class="text-xs px-1.5 py-0.5 rounded" 
              :class="showOnlyRecognized ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'">
              <i class="fas fa-check-circle text-[10px] mr-0.5"></i>
              仅已识别
            </button>
          </div>
        </div>
        
        <div v-if="capturedPages.length === 0" class="text-center py-3 text-gray-400">
          <i class="fas fa-info-circle mr-1"></i> 暂无已捕获页面
        </div>
        <div v-else class="max-h-[200px] overflow-y-auto">
          <div v-for="(page, index) in filteredPages" :key="page.id" class="captured-page-item p-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-600/30 transition-colors duration-200 cursor-pointer">
            <div class="flex items-start">
              <!-- 页面缩略图 -->
              <div class="page-thumbnail w-12 h-16 bg-gray-700 rounded-sm overflow-hidden mr-2 flex-shrink-0 relative" :data-page-id="page.id">
                <div class="w-full h-full flex items-center justify-center flex-col">
                  <i class="fas fa-file-alt text-gray-500 mb-1"></i>
                  <div class="text-xs text-gray-300">第 {{page.pageNumber}} 页</div>
                </div>
                
                <!-- 缩略图上的快速操作按钮 -->
                <div class="thumbnail-actions opacity-0 absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <button @click.stop="handleJumpToPage(page)" class="thumbnail-action-btn bg-blue-600 hover:bg-blue-500 mb-1.5" title="跳转至该页">
                    <i class="fas fa-arrow-right text-[10px] mr-1"></i>
                    <span class="text-[10px]">跳转至该页</span>
                  </button>
                  <button @click.stop="handleRescanPage(page)" class="thumbnail-action-btn bg-green-600 hover:bg-green-500" title="重新扫描">
                    <i class="fas fa-sync-alt text-[10px] mr-1"></i>
                    <span class="text-[10px]">重新扫描</span>
                  </button>
                </div>
                
                <!-- 重新扫描进度覆盖 -->
                <div v-if="page.isRescanning" class="absolute inset-0 bg-black/75 flex flex-col items-center justify-center">
                  <div class="text-[10px] text-white mb-1">重新扫描中...</div>
                  <div class="w-3/4 h-1 bg-gray-700 rounded">
                    <div class="h-full bg-green-500 rounded" :style="{width: `${page.rescanProgress}%`}"></div>
                  </div>
                </div>
              </div>
              
              <!-- 页面信息 -->
              <div class="flex-grow">
                <div class="text-xs font-medium text-blue-300 mb-0.5">第 {{page.pageNumber}} 页</div>
                <div class="text-xs text-gray-300">{{formatTimestamp(page.capturedAt)}}</div>
                <div class="flex items-center text-xs mt-1">
                  <span class="text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-400 mr-1">
                    <i class="fas fa-check-circle text-[10px] mr-0.5"></i>已识别
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-1.5 bg-gray-700 flex justify-between items-center">
          <button class="text-xs text-blue-300 hover:text-blue-200 px-2 py-1 transition-colors">
            <i class="fas fa-trash-alt mr-1"></i>清除
          </button>
          <button class="text-xs text-blue-300 hover:text-blue-200 px-2 py-1 transition-colors">
            <i class="fas fa-external-link-alt mr-1"></i>全部查看
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
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
}

.page-thumbnail:hover .thumbnail-actions {
  opacity: 1;
  transition: opacity 0.2s;
}
</style>