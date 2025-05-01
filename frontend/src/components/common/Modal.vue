<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click="closeOnBackdrop && $emit('update:modelValue', false)">
        <div class="modal-container" :class="[size, { 'modal-centered': centered }]" @click.stop>
          <!-- 标题栏 -->
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
            <button v-if="closeButton" class="modal-close" @click="$emit('update:modelValue', false)">
              &times;
            </button>
          </div>
          
          <!-- 内容区域 -->
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <!-- 底部操作区 -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';
import { useUIStore } from '../../store/modules/ui';

const props = defineProps({
  // 双向绑定的显示状态
  modelValue: {
    type: Boolean,
    required: true
  },
  // 模态框标题
  title: {
    type: String,
    default: ''
  },
  // 点击背景是否关闭模态框
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  // 是否显示关闭按钮
  closeButton: {
    type: Boolean,
    default: true
  },
  // 尺寸：small, medium, large, fullscreen
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value)
  },
  // 是否居中显示
  centered: {
    type: Boolean,
    default: true
  }
});

const uiStore = useUIStore();

// 定义emit事件
const emit = defineEmits(['update:modelValue', 'open', 'close']);

// 监听模态框状态变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 模态框打开时
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    emit('open');
  } else {
    // 模态框关闭时
    document.body.style.overflow = ''; // 恢复背景滚动
    emit('close');
  }
});

// ESC键关闭模态框
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false);
  }
};

// 添加和移除键盘事件监听
watch(() => props.modelValue, (value) => {
  if (value) {
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1 1 auto;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* 尺寸变体 */
.modal-container.small {
  width: 300px;
}

.modal-container.medium {
  width: 500px;
}

.modal-container.large {
  width: 800px;
}

.modal-container.fullscreen {
  width: 100%;
  height: 100%;
  border-radius: 0;
  margin: 0;
}

/* 居中显示 */
.modal-centered {
  margin: auto;
}

/* 动画效果 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

/* 暗色模式适配 */
:root.dark .modal-container {
  background-color: #1f2937;
  color: #f3f4f6;
}

:root.dark .modal-header {
  border-bottom-color: #374151;
}

:root.dark .modal-title {
  color: #f3f4f6;
}

:root.dark .modal-footer {
  border-top-color: #374151;
}
</style>
