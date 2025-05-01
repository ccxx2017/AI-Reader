<template>
  <div class="system-status-panel">
    <h2 class="panel-title">
      <i class="fas fa-server server-icon"></i>
      系统状态
    </h2>
    
    <!-- 摄像头预览小窗 -->
    <div class="camera-preview-container">
      <CameraPreview 
        :isLarge="showLargeCamera" 
        @toggleSize="showLargeCamera = !showLargeCamera"
        @ocr-result="handleOcrResult"
        @ocr-status="handleOcrStatus"
      />
    </div>
    
    <!-- 系统状态总结提示 -->
    <div class="system-status-summary" 
        :class="systemStatusClass">
      <i class="fas status-icon" :class="systemStatusIcon"></i>
      <span class="status-message">{{systemStatusMessage}}</span>
    </div>
    
    <div class="status-components">
      <!-- 摄像头状态组件 -->
      <CameraStatus />
      
      <!-- 页面检测状态组件 -->
      <PageDetectionStatus />
      
      <!-- AI处理状态组件 -->
      <AIProcessingStatus 
        :isProcessing="isAIProcessing"
        :progress="aiProcessProgress"
        :processingText="aiProcessingText"
      />
      
      <!-- 已捕获页面组件 -->
      <CapturedPagesStatus 
        :capturedPages="capturedPages"
        @jumpToPage="jumpToPage"
        @rescanPage="rescanPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CameraPreview from '../../ocr/CameraOCR.vue';
import CameraStatus from './CameraStatus.vue';
import PageDetectionStatus from './PageDetectionStatus.vue';
import AIProcessingStatus from './AIProcessingStatus.vue';
import CapturedPagesStatus from './CapturedPagesStatus.vue';

// 摄像头大小切换状态
const showLargeCamera = ref(false);

// AI处理状态
const isAIProcessing = ref(false);
const aiProcessProgress = ref(0);
const aiProcessingText = ref('');

// 模拟摄像头识别结果处理
function handleOcrResult(result) {
  console.log('OCR结果:', result);
  // 可以在这里增加处理OCR结果的逻辑
  simulateAIProcessing();
}

// 处理OCR状态变化
function handleOcrStatus(status) {
  console.log('OCR状态变化:', status);
  // 在这里处理OCR状态变化
}

// 系统状态样式与图标
const systemStatusClass = computed(() => {
  return isAIProcessing.value 
    ? 'processing' 
    : 'normal';
});

const systemStatusIcon = computed(() => {
  return isAIProcessing.value 
    ? 'fa-cog fa-spin' 
    : 'fa-check-circle';
});

const systemStatusMessage = computed(() => {
  return isAIProcessing.value 
    ? '系统正在处理中' 
    : '系统正常运行中';
});

// 捕获的页面数据
const capturedPages = ref([
  { 
    id: '1', 
    pageNumber: 25, 
    capturedAt: new Date().getTime() - 10 * 60 * 1000, 
    isRecognized: true,
    isRescanning: false,
    rescanProgress: 0
  },
  { 
    id: '2', 
    pageNumber: 26, 
    capturedAt: new Date().getTime() - 5 * 60 * 1000, 
    isRecognized: true,
    isRescanning: false,
    rescanProgress: 0
  }
]);

// 跳转到指定页面
function jumpToPage(page) {
  // 实现跳转到指定页面的逻辑
  console.log('跳转到页面:', page);
  // TODO: 实现页面跳转功能
}

// 重新扫描页面
function rescanPage(page) {
  console.log('重新扫描页面:', page);
  
  // 找到对应页面并设置为重新扫描状态
  const pageIndex = capturedPages.value.findIndex(p => p.id === page.id);
  if (pageIndex !== -1) {
    capturedPages.value[pageIndex].isRescanning = true;
    capturedPages.value[pageIndex].rescanProgress = 0;
    
    // 模拟重新扫描进度
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        capturedPages.value[pageIndex].rescanProgress = progress;
      } else {
        clearInterval(intervalId);
        capturedPages.value[pageIndex].isRescanning = false;
        // 更新页面的捕获时间为当前时间
        capturedPages.value[pageIndex].capturedAt = new Date().getTime();
      }
    }, 300);
  }
}

// 模拟AI处理状态变化
function simulateAIProcessing() {
  if (isAIProcessing.value) return; // 避免重复触发
  
  isAIProcessing.value = true;
  aiProcessProgress.value = 0;
  aiProcessingText.value = '初始化分析...';
  
  const processingSteps = [
    '文字识别中...',
    '语义分析中...',
    '内容理解中...',
    '生成见解中...',
    '完成处理'
  ];
  
  let step = 0;
  const intervalId = setInterval(() => {
    aiProcessProgress.value += 20;
    aiProcessingText.value = processingSteps[step];
    step++;
    
    if (aiProcessProgress.value >= 100) {
      clearInterval(intervalId);
      setTimeout(() => {
        isAIProcessing.value = false;
        aiProcessProgress.value = 0;
        aiProcessingText.value = '';
      }, 1000);
    }
  }, 800);
}
</script>

<style scoped>
.system-status-panel {
  background-color: rgba(17, 24, 39, 0.3); /* bg-gray-900/30 */
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.server-icon {
  color: #f97316; /* text-orange-500 */
  margin-right: 0.5rem;
}

.camera-preview-container {
  margin-bottom: 0.5rem;
}

.system-status-summary {
  margin-bottom: 0.75rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
}

.system-status-summary.processing {
  background-color: rgba(59, 130, 246, 0.2); /* bg-blue-500/20 */
  color: #93c5fd; /* text-blue-300 */
}

.system-status-summary.normal {
  background-color: rgba(34, 197, 94, 0.2); /* bg-green-500/20 */
  color: #86efac; /* text-green-300 */
}

.status-icon {
  margin-right: 0.375rem;
  font-size: 0.875rem;
}

.status-message {
  font-size: 0.75rem;
  font-weight: 500;
}

.status-components {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* 深色模式 */
:global(.dark) .system-status-panel {
  background-color: rgba(31, 41, 55, 0.3); /* dark:bg-gray-800/30 */
}
</style>