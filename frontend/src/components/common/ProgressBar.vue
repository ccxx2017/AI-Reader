<template>
  <div class="progress-container" :class="{ 'progress-striped': striped, 'progress-animated': animated }">
    <div
      class="progress-bar"
      :class="[
        `progress-${type}`,
        { 'progress-rounded': rounded }
      ]"
      :style="{
        width: `${clampedValue}%`,
        height: height,
      }"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span v-if="showLabel" class="progress-label">{{ formattedLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 进度值（0-100）
  value: {
    type: Number,
    default: 0
  },
  // 进度条类型: 'primary', 'success', 'warning', 'danger', 'info'
  type: {
    type: String,
    default: 'primary'
  },
  // 高度
  height: {
    type: String,
    default: '0.5rem'
  },
  // 是否显示标签
  showLabel: {
    type: Boolean,
    default: false
  },
  // 标签格式（函数或字符串）
  labelFormat: {
    type: [Function, String],
    default: '{value}%'
  },
  // 是否带条纹
  striped: {
    type: Boolean,
    default: false
  },
  // 是否带动画
  animated: {
    type: Boolean,
    default: false
  },
  // 是否圆角
  rounded: {
    type: Boolean,
    default: true
  }
});

// 确保值在0-100范围内
const clampedValue = computed(() => {
  return Math.min(Math.max(props.value, 0), 100);
});

// 格式化标签
const formattedLabel = computed(() => {
  if (typeof props.labelFormat === 'function') {
    return props.labelFormat(clampedValue.value);
  }
  
  return props.labelFormat.replace('{value}', clampedValue.value.toFixed(0));
});
</script>

<style scoped>
.progress-container {
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  transition: width 0.6s ease;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0 0.5rem;
}

/* 进度条类型 */
.progress-primary {
  background-color: var(--primary, #3b82f6);
}

.progress-success {
  background-color: var(--success, #22c55e);
}

.progress-warning {
  background-color: var(--warning, #f59e0b);
}

.progress-danger {
  background-color: var(--danger, #ef4444);
}

.progress-info {
  background-color: var(--info, #06b6d4);
}

/* 圆角进度条 */
.progress-rounded {
  border-radius: 9999px;
}

/* 条纹效果 */
.progress-striped .progress-bar {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* 动画效果 */
.progress-animated .progress-bar {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

/* 暗色模式适配 */
:root.dark .progress-container {
  background-color: #374151;
}
</style>
