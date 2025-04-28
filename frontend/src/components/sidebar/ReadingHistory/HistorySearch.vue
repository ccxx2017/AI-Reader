<template>
  <div class="mb-3 bg-gray-800/80 rounded-lg p-2">
    <div class="flex items-center space-x-2 mb-2">
      <!-- 搜索框 -->
      <div class="flex-grow relative">
        <input 
          type="text"
          class="w-full bg-gray-700 rounded-md text-gray-200 text-xs py-1.5 pl-7 pr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="搜索书籍或作者..."
          v-model="localSearchQuery"
          @input="emitModelValue"
        >
        <i class="fas fa-search absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
      </div>
      
      <!-- 筛选按钮 -->
      <div class="relative">
        <button 
          @click="toggleFilterMenu" 
          class="flex items-center bg-gray-700 rounded-md text-gray-300 text-xs py-1.5 px-2 hover:bg-gray-600 transition-colors"
        >
          <i class="fas fa-filter mr-1"></i>
          <i class="fas fa-chevron-down text-[8px] ml-1.5"></i>
        </button>
        
        <!-- 筛选下拉菜单 -->
        <transition name="fade">
          <div v-if="showFilterMenu" class="absolute right-0 top-full mt-1 bg-gray-800 rounded-md shadow-lg z-10 w-48 border border-gray-700 text-xs">
            <div class="p-2 border-b border-gray-700">
              <div class="text-gray-300 mb-1.5">排序方式</div>
              <div class="space-y-1">
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="localFilter.sortBy" 
                    value="recent" 
                    class="form-radio text-blue-500"
                    @change="emitFilter"
                  >
                  <span class="ml-2 text-gray-400">最近阅读</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="localFilter.sortBy" 
                    value="progress" 
                    class="form-radio text-blue-500"
                    @change="emitFilter"
                  >
                  <span class="ml-2 text-gray-400">阅读进度</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="localFilter.sortBy" 
                    value="title" 
                    class="form-radio text-blue-500"
                    @change="emitFilter"
                  >
                  <span class="ml-2 text-gray-400">书名</span>
                </label>
              </div>
            </div>
            <div class="p-2">
              <div class="text-gray-300 mb-1.5">时间范围</div>
              <div class="space-y-1">
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="all" 
                    class="form-radio text-blue-500"
                    @change="updateDateRange"
                  >
                  <span class="ml-2 text-gray-400">全部时间</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="today" 
                    class="form-radio text-blue-500"
                    @change="updateDateRange"
                  >
                  <span class="ml-2 text-gray-400">今天</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="week" 
                    class="form-radio text-blue-500"
                    @change="updateDateRange"
                  >
                  <span class="ml-2 text-gray-400">本周</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="dateRangeType" 
                    value="month" 
                    class="form-radio text-blue-500"
                    @change="updateDateRange"
                  >
                  <span class="ml-2 text-gray-400">本月</span>
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
import { ref, defineProps, defineEmits, watch } from 'vue';

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