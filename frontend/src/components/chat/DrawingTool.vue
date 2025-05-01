<template>
  <!-- 绘图工具面板 -->
  <div class="drawing-tool-overlay">
    <div class="drawing-panel">
      <div class="panel-header">
        <h3 class="panel-title">绘图工具</h3>
        <button @click="$emit('close')" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="panel-content">
        <div class="canvas-container">
          <canvas 
            ref="canvas" 
            class="drawing-canvas" 
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
        
        <div class="drawing-tools">
          <div class="tool-controls">
            <div class="color-picker">
              <button 
                v-for="color in colors" 
                :key="color" 
                @click="setColor(color)"
                class="color-button"
                :class="{'selected-color': currentColor === color}"
                :style="{backgroundColor: color}"
              ></button>
            </div>
            
            <div class="brush-size">
              <button 
                v-for="size in brushSizes" 
                :key="size" 
                @click="setBrushSize(size)"
                class="size-button"
                :class="{'selected-size': currentSize === size}"
              >
                <div 
                  class="size-indicator" 
                  :style="{width: `${size}px`, height: `${size}px`}"
                ></div>
              </button>
            </div>
          </div>
          
          <div class="action-buttons">
            <button 
              @click="clearCanvas" 
              class="clear-button"
            >
              <i class="fas fa-trash-alt action-icon"></i>清除
            </button>
            <button 
              @click="$emit('submit')" 
              class="submit-button"
            >
              <i class="fas fa-paper-plane action-icon"></i>提交
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
.drawing-tool-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.drawing-panel {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 600px;
  max-width: 100%;
}

.dark .drawing-panel {
  background-color: #1f2937;
}

.panel-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .panel-header {
  border-bottom-color: #374151;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.close-button {
  padding: 0.5rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  background-color: #f3f4f6;
}

.dark .close-button:hover {
  background-color: #374151;
}

.close-button:focus {
  outline: none;
}

.panel-content {
  padding: 1rem;
}

.canvas-container {
  width: 100%;
}

.drawing-canvas {
  width: 100%;
  height: 320px;
  cursor: crosshair;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.dark .drawing-canvas {
  border-color: #4b5563;
}

.drawing-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.tool-controls {
  display: flex;
  align-items: center;
}

.color-picker {
  display: flex;
  gap: 0.5rem;
}

.color-button {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.dark .color-button {
  border-color: #4b5563;
}

.selected-color {
  box-shadow: 0 0 0 2px #3b82f6;
}

.brush-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
}

.size-button {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border: none;
  cursor: pointer;
}

.dark .size-button {
  background-color: #374151;
}

.selected-size {
  background-color: #dbeafe;
}

.dark .selected-size {
  background-color: #1e3a8a;
}

.size-indicator {
  border-radius: 9999px;
  background-color: #1f2937;
}

.dark .size-indicator {
  background-color: #d1d5db;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.clear-button, .submit-button {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.clear-button {
  background-color: #e5e7eb;
  color: #1f2937;
}

.dark .clear-button {
  background-color: #374151;
  color: #e5e7eb;
}

.clear-button:hover {
  background-color: #d1d5db;
}

.dark .clear-button:hover {
  background-color: #4b5563;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
}

.submit-button:hover {
  background-color: #2563eb;
}

.action-icon {
  margin-right: 0.25rem;
}
</style>
