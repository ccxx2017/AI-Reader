<template>
  <div class="bg-gray-900/30 dark:bg-gray-800/30 p-3 rounded-lg">
    <h2 class="text-lg font-semibold mb-3 flex items-center">
      <i class="fas fa-server text-orange-500 mr-2"></i>
      系统状态
    </h2>
    
    <!-- 摄像头预览小窗 -->
    <div class="camera-preview-container mb-2">
      <CameraPreview 
        :isLarge="showLargeCamera" 
        @toggleSize="showLargeCamera = !showLargeCamera"
        @ocr-result="handleOcrResult"
        @ocr-status="handleOcrStatus"
      />
    </div>
    
    <!-- 系统状态总结提示 -->
    <div class="system-status-summary mb-3 px-2.5 py-1.5 rounded-md flex items-center" 
        :class="systemStatusClass">
      <i class="fas mr-1.5 text-sm" :class="systemStatusIcon"></i>
      <span class="text-xs font-medium">{{systemStatusMessage}}</span>
    </div>
    
    <div class="space-y-3.5">
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
import CameraPreview from '../../CameraOCR.vue';
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
    ? 'bg-blue-500/20 text-blue-300' 
    : 'bg-green-500/20 text-green-300';
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