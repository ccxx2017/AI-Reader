<template>
  <!-- 绘图工具面板 -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-w-full">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium">绘图工具</h3>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="p-4">
        <div class="canvas-container">
          <canvas 
            ref="canvas" 
            class="drawing-canvas border border-gray-300 dark:border-gray-600 rounded-lg" 
            width="560" 
            height="320"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="stopDrawing"
          ></canvas>
        </div>
        
        <div class="drawing-tools flex items-center justify-between mt-4">
          <div class="flex items-center space-x-3">
            <div class="color-picker flex space-x-2">
              <button 
                v-for="color in colors" 
                :key="color" 
                @click="setColor(color)"
                class="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                :class="{'ring-2 ring-blue-500': currentColor === color}"
                :style="{backgroundColor: color}"
              ></button>
            </div>
            
            <div class="brush-size flex items-center space-x-2 ml-4">
              <button 
                v-for="size in brushSizes" 
                :key="size" 
                @click="setBrushSize(size)"
                class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700"
                :class="{'bg-blue-100 dark:bg-blue-900': currentSize === size}"
              >
                <div 
                  class="rounded-full bg-gray-800 dark:bg-gray-300" 
                  :style="{width: `${size}px`, height: `${size}px`}"
                ></div>
              </button>
            </div>
          </div>
          
          <div class="actions flex space-x-2">
            <button 
              @click="clearCanvas" 
              class="px-3 py-1.5 rounded-md text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition-colors"
            >
              <i class="fas fa-trash-alt mr-1"></i>清除
            </button>
            <button 
              @click="$emit('submit')" 
              class="px-3 py-1.5 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition-colors"
            >
              <i class="fas fa-paper-plane mr-1"></i>提交
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['close', 'submit']);

const canvas = ref(null);
let ctx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 绘图颜色和笔刷大小选项
const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const brushSizes = [2, 4, 8, 12];
const currentColor = ref('#000000');
const currentSize = ref(4);

// 设置颜色
function setColor(color) {
  currentColor.value = color;
}

// 设置笔刷大小
function setBrushSize(size) {
  currentSize.value = size;
}

// 开始绘制
function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.value.getBoundingClientRect();
  [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
}

// 绘制
function draw(e) {
  if (!isDrawing) return;
  
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ctx.strokeStyle = currentColor.value;
  ctx.lineWidth = currentSize.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  [lastX, lastY] = [x, y];
}

// 停止绘制
function stopDrawing() {
  isDrawing = false;
}

// 清除画布
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

// 处理触摸事件 - 开始
function handleTouchStart(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const rect = canvas.value.getBoundingClientRect();
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    isDrawing = true;
  }
}

// 处理触摸事件 - 移动
function handleTouchMove(e) {
  e.preventDefault();
  if (!isDrawing || e.touches.length !== 1) return;
  
  const touch = e.touches[0];
  const rect = canvas.value.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  
  ctx.strokeStyle = currentColor.value;
  ctx.lineWidth = currentSize.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  [lastX, lastY] = [x, y];
}

// 获取绘制的图像数据
function getImageData() {
  return canvas.value.toDataURL('image/png');
}

// 暴露方法给父组件
defineExpose({
  getImageData
});

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    
    // 设置画布背景为白色
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
  }
});
</script>

<style scoped>
.drawing-canvas {
  width: 100%;
  height: 320px;
  cursor: crosshair;
}
</style>
