<template>
  <div class="search-container">
    <div class="search-bar">
      <!-- 搜索框 -->
      <div class="search-input-wrapper">
        <input 
          type="text"
          class="search-input"
          placeholder="搜索书籍或作者..."
          v-model="localSearchQuery"
          @input="emitModelValue"
        >
        <i class="fas fa-search search-icon"></i>
      </div>
      
      <!-- 筛选按钮 -->
      <div class="filter-menu-container">
        <button 
          @click="toggleFilterMenu" 
          class="filter-button"
        >
          <i class="fas fa-filter filter-icon"></i>
          <i class="fas fa-chevron-down chevron-icon"></i>
        </button>
        
        <!-- 筛选下拉菜单 -->
        <transition name="fade">
          <div v-if="showFilterMenu" class="filter-dropdown">
            <div class="filter-section sort-section">
              <div class="section-title">排序方式</div>
              <div class="filter-options">
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="localFilter.sortBy" 
                    value="recent" 
                    class="radio-input"
                    @change="emitFilter"
                  >
                  <span class="option-label">最近阅读</span>
                </label>
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="localFilter.sortBy" 
                    value="progress" 
                    class="radio-input"
                    @change="emitFilter"
                  >
                  <span class="option-label">阅读进度</span>
                </label>
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="localFilter.sortBy" 
                    value="title" 
                    class="radio-input"
                    @change="emitFilter"
                  >
                  <span class="option-label">书名</span>
                </label>
              </div>
            </div>
            <div class="filter-section date-section">
              <div class="section-title">时间范围</div>
              <div class="filter-options">
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="all" 
                    class="radio-input"
                    @change="updateDateRange"
                  >
                  <span class="option-label">全部时间</span>
                </label>
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="today" 
                    class="radio-input"
                    @change="updateDateRange"
                  >
                  <span class="option-label">今天</span>
                </label>
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="week" 
                    class="radio-input"
                    @change="updateDateRange"
                  >
                  <span class="option-label">本周</span>
                </label>
                <label class="filter-option">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="month" 
                    class="radio-input"
                    @change="updateDateRange"
                  >
                  <span class="option-label">本月</span>
                </label>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'filter']);

// 本地搜索查询
const localSearchQuery = ref(props.modelValue);

// 筛选菜单状态
const showFilterMenu = ref(false);

// 本地筛选条件
const localFilter = ref({
  dateRange: null,
  sortBy: 'recent'
});

// 日期范围类型
const dateRangeType = ref('all');

// 监听prop变化
watch(() => props.modelValue, (newValue) => {
  localSearchQuery.value = newValue;
});

// 切换筛选菜单显示状态
function toggleFilterMenu() {
  showFilterMenu.value = !showFilterMenu.value;
}

// 更新日期范围
function updateDateRange() {
  let dateRange = null;
  const now = new Date();
  
  switch (dateRangeType.value) {
    case 'today':
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateRange = {
        start: startOfDay.getTime(),
        end: now.getTime()
      };
      break;
    case 'week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateRange = {
        start: startOfWeek.getTime(),
        end: now.getTime()
      };
      break;
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateRange = {
        start: startOfMonth.getTime(),
        end: now.getTime()
      };
      break;
    default:
      dateRange = null;
  }
  
  localFilter.value.dateRange = dateRange;
  emitFilter();
}

// 发送搜索值更新事件
function emitModelValue() {
  emit('update:modelValue', localSearchQuery.value);
}

// 发送筛选条件更新事件
function emitFilter() {
  emit('filter', { ...localFilter.value });
}

// 点击页面其他位置关闭筛选菜单
function closeMenuOnOutsideClick(event) {
  if (showFilterMenu.value) {
    const isClickOutside = !event.target.closest('.filter-menu-container');
    if (isClickOutside) {
      showFilterMenu.value = false;
    }
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick);
});
</script>

<style scoped>
.search-container {
  margin-bottom: 0.75rem;
  background-color: rgba(31, 41, 55, 0.8); /* bg-gray-800/80 */
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.search-input-wrapper {
  position: relative;
  flex-grow: 1;
}

.search-input {
  width: 100%;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.375rem;
  color: #e5e7eb; /* text-gray-200 */
  font-size: 0.75rem;
  padding: 0.375rem 0.5rem 0.375rem 1.75rem;
  border: none;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 1px #3b82f6; /* focus:ring-1 focus:ring-blue-500 */
}

.search-icon {
  position: absolute;
  left: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; /* text-gray-400 */
  font-size: 0.75rem;
}

.filter-menu-container {
  position: relative;
}

.filter-button {
  display: flex;
  align-items: center;
  background-color: #374151; /* bg-gray-700 */
  border-radius: 0.375rem;
  color: #d1d5db; /* text-gray-300 */
  font-size: 0.75rem;
  padding: 0.375rem 0.5rem;
  border: none;
  transition: background-color 0.2s;
  cursor: pointer;
}

.filter-button:hover {
  background-color: #4b5563; /* hover:bg-gray-600 */
}

.filter-icon {
  margin-right: 0.25rem;
}

.chevron-icon {
  font-size: 0.5rem;
  margin-left: 0.375rem;
}

.filter-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.25rem;
  background-color: #1f2937; /* bg-gray-800 */
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  width: 12rem;
  border: 1px solid #374151; /* border-gray-700 */
  font-size: 0.75rem;
}

.filter-section {
  padding: 0.5rem;
}

.sort-section {
  border-bottom: 1px solid #374151; /* border-gray-700 */
}

.section-title {
  color: #d1d5db; /* text-gray-300 */
  margin-bottom: 0.375rem;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-input {
  color: #3b82f6; /* text-blue-500 */
}

.option-label {
  margin-left: 0.5rem;
  color: #9ca3af; /* text-gray-400 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>