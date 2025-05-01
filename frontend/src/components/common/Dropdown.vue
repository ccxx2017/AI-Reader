<template>
  <div class="dropdown-container" ref="dropdownRef">
    <!-- 触发器 -->
    <div 
      class="dropdown-trigger" 
      @click="toggleDropdown"
      :class="{ 'active': isOpen }"
    >
      <slot name="trigger">
        <button class="dropdown-button">
          {{ label }}
          <i class="dropdown-icon" :class="isOpen ? 'icon-up' : 'icon-down'"></i>
        </button>
      </slot>
    </div>
    
    <!-- 下拉内容 -->
    <transition name="dropdown">
      <div 
        v-if="isOpen" 
        class="dropdown-menu" 
        :class="[position, { 'dropdown-menu-right': alignRight }]"
      >
        <div class="dropdown-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  // 下拉菜单标签
  label: {
    type: String,
    default: '下拉菜单'
  },
  // 下拉菜单位置：top, bottom, left, right
  position: {
    type: String,
    default: 'bottom'
  },
  // 是否右对齐
  alignRight: {
    type: Boolean,
    default: false
  },
  // 点击外部是否关闭
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
});

const isOpen = ref(false);
const dropdownRef = ref(null);

// 切换下拉菜单状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (props.closeOnClickOutside && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

// 挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

// 卸载前移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.dropdown-button:hover {
  background-color: #f8fafc;
}

.dropdown-icon {
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
}

.icon-down::after {
  content: '▼';
  font-size: 0.75rem;
}

.icon-up::after {
  content: '▲';
  font-size: 0.75rem;
}

.dropdown-menu {
  position: absolute;
  z-index: 10;
  min-width: 10rem;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
  border: 1px solid #e2e8f0;
  margin-top: 0.25rem;
}

.dropdown-menu.bottom {
  top: 100%;
  left: 0;
}

.dropdown-menu.top {
  bottom: 100%;
  left: 0;
}

.dropdown-menu.left {
  right: 100%;
  top: 0;
}

.dropdown-menu.right {
  left: 100%;
  top: 0;
}

.dropdown-menu-right {
  right: 0;
  left: auto;
}

.dropdown-content {
  padding: 0.5rem 0;
}

/* 动画效果 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

/* 暗色模式适配 */
:root.dark .dropdown-button {
  background-color: #1f2937;
  border-color: #374151;
  color: white;
}

:root.dark .dropdown-button:hover {
  background-color: #374151;
}

:root.dark .dropdown-menu {
  background-color: #1f2937;
  border-color: #374151;
}
</style>
