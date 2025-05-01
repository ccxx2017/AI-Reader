<template>
  <button
    :class="[
      'btn',
      `btn-${type}`,
      { 
        'btn-sm': size === 'small',
        'btn-lg': size === 'large',
        'btn-rounded': rounded,
        'btn-block': block,
        'btn-icon': icon && !$slots.default,
        'disabled': disabled
      }
    ]"
    :disabled="disabled"
    @click="!disabled && $emit('click', $event)"
  >
    <span v-if="icon" class="btn-icon">
      <i :class="icon"></i>
    </span>
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // 按钮类型: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
  type: {
    type: String,
    default: 'primary'
  },
  // 按钮尺寸: 'small', 'medium', 'large'
  size: {
    type: String,
    default: 'medium'
  },
  // 是否圆角
  rounded: {
    type: Boolean,
    default: false
  },
  // 是否占满宽度
  block: {
    type: Boolean,
    default: false
  },
  // 图标类名
  icon: {
    type: String,
    default: ''
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  user-select: none;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
  background-color: transparent;
}

.btn:hover:not(.disabled) {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn:active:not(.disabled) {
  transform: translateY(0);
}

/* 按钮尺寸 */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.2rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.3rem;
}

/* 按钮类型 */
.btn-primary {
  background-color: var(--primary, #3b82f6);
  color: white;
  border-color: var(--primary, #3b82f6);
}

.btn-secondary {
  background-color: var(--secondary, #6b7280);
  color: white;
  border-color: var(--secondary, #6b7280);
}

.btn-success {
  background-color: var(--success, #22c55e);
  color: white;
  border-color: var(--success, #22c55e);
}

.btn-danger {
  background-color: var(--danger, #ef4444);
  color: white;
  border-color: var(--danger, #ef4444);
}

.btn-warning {
  background-color: var(--warning, #f59e0b);
  color: white;
  border-color: var(--warning, #f59e0b);
}

.btn-info {
  background-color: var(--info, #3b82f6);
  color: white;
  border-color: var(--info, #3b82f6);
}

.btn-light {
  background-color: var(--light, #f3f4f6);
  color: var(--dark, #1f2937);
  border-color: #d1d5db;
}

.btn-dark {
  background-color: var(--dark, #1f2937);
  color: white;
  border-color: var(--dark, #1f2937);
}

/* 圆角按钮 */
.btn-rounded {
  border-radius: 9999px;
}

/* 块级按钮 */
.btn-block {
  display: flex;
  width: 100%;
}

/* 图标按钮 */
.btn-icon {
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.btn-icon.btn-sm {
  padding: 0.25rem;
}

.btn-icon.btn-lg {
  padding: 0.75rem;
}

.btn-icon > i {
  margin-right: 0.5rem;
}

/* 禁用状态 */
.disabled {
  opacity: 0.65;
  pointer-events: none;
  cursor: not-allowed;
}

/* 暗色模式适配 */
:root.dark .btn-light {
  background-color: var(--dark-light, #374151);
  color: white;
  border-color: #4b5563;
}
</style>
