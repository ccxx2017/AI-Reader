<template>
  <span class="status-badge" :class="[`status-${type}`, { 'status-dot': dot, 'status-pill': pill }]">
    <span v-if="dot" class="status-indicator"></span>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  // 状态类型: 'primary', 'success', 'warning', 'danger', 'info', 'default'
  type: {
    type: String,
    default: 'default'
  },
  // 显示文本
  text: {
    type: String,
    default: ''
  },
  // 是否显示状态点
  dot: {
    type: Boolean,
    default: false
  },
  // 是否为胶囊形状
  pill: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 0.25rem;
  white-space: nowrap;
  vertical-align: middle;
}

/* 胶囊形状 */
.status-pill {
  border-radius: 9999px;
}

/* 状态点样式 */
.status-dot {
  padding-left: 0.25rem;
}

.status-indicator {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.375rem;
}

/* 状态类型样式 */
.status-default {
  background-color: #e5e7eb;
  color: #374151;
}

.status-default .status-indicator {
  background-color: #6b7280;
}

.status-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-primary .status-indicator {
  background-color: #3b82f6;
}

.status-success {
  background-color: #dcfce7;
  color: #15803d;
}

.status-success .status-indicator {
  background-color: #22c55e;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-warning .status-indicator {
  background-color: #f59e0b;
}

.status-danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-danger .status-indicator {
  background-color: #ef4444;
}

.status-info {
  background-color: #cffafe;
  color: #0e7490;
}

.status-info .status-indicator {
  background-color: #06b6d4;
}

/* 暗色模式适配 */
:root.dark .status-default {
  background-color: #374151;
  color: #e5e7eb;
}

:root.dark .status-primary {
  background-color: #1e3a8a;
  color: #bfdbfe;
}

:root.dark .status-success {
  background-color: #14532d;
  color: #bbf7d0;
}

:root.dark .status-warning {
  background-color: #78350f;
  color: #fef3c7;
}

:root.dark .status-danger {
  background-color: #991b1b;
  color: #fee2e2;
}

:root.dark .status-info {
  background-color: #0e7490;
  color: #cffafe;
}
</style>
