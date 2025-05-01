<template>
  <div class="camera-ocr">
    <video ref="video" autoplay playsinline width="320" height="240"></video>
    <canvas ref="canvas" width="320" height="240" style="display:none;"></canvas>
    <div class="control-buttons">
      <button @click="takePhoto" class="btn">拍照</button>
      <button v-if="photoData" @click="uploadPhoto" class="btn">上传识别</button>
    </div>
    <img v-if="photoData" :src="photoData" alt="拍照预览" class="preview-image" width="160" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import ocrService from '../../services/ocrService'

const video = ref(null)
const canvas = ref(null)
const photoData = ref('')
const ocrText = ref('')
const emits = defineEmits(['ocr-result', 'ocr-status'])

// 打开摄像头
onMounted(() => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.value.srcObject = stream
      emits('ocr-status', {camera: 'ready', page: 'idle', ai: 'idle', captured: 'idle'})
    })
    .catch(err => {
      alert('无法访问摄像头: ' + err)
      emits('ocr-status', {camera: 'error', page: 'idle', ai: 'idle', captured: 'idle'})
    })
})

// 拍照
function takePhoto() {
  emits('ocr-status', {camera: 'working', page: 'idle', ai: 'idle', captured: 'idle'})
  const ctx = canvas.value.getContext('2d')
  ctx.drawImage(video.value, 0, 0, 320, 240)
  photoData.value = canvas.value.toDataURL('image/png')
  ocrText.value = ''
  emits('ocr-status', {camera: 'ready', page: 'idle', ai: 'idle', captured: 'idle'})
}

// 上传图片到后端
async function uploadPhoto() {
  try {
    // 更新状态：摄像头工作中 -> 页面检测中 -> AI处理中
    emits('ocr-status', {camera: 'working', page: 'detecting', ai: 'idle', captured: 'idle'})
    
    const blob = await (await fetch(photoData.value)).blob()
    
    // 更新状态：AI处理中
    emits('ocr-status', {camera: 'ready', page: 'done', ai: 'processing', captured: 'idle'})
    
    // 使用OCR服务
    const result = await ocrService.recognizeImage(blob)
    ocrText.value = result.text
    
    // 发送识别结果到主区域
    emits('ocr-result', result.text)
    
    // 更新状态：已捕获页面
    emits('ocr-status', {camera: 'ready', page: 'done', ai: 'done', captured: 'updated'})
    
    // 2秒后恢复默认状态
    setTimeout(() => {
      emits('ocr-status', {camera: 'ready', page: 'idle', ai: 'idle', captured: 'idle'})
    }, 2000)
  } catch (error) {
    console.error('识别失败:', error)
    emits('ocr-status', {camera: 'error', page: 'error', ai: 'error', captured: 'error'})
  }
}
</script>

<style scoped>
.camera-ocr { 
  max-width: 340px; 
}

.control-buttons {
  margin-top: 0.5rem; /* mt-2 */
  display: flex; /* flex */
  gap: 0.5rem; /* space-x-2 */
}

.btn { 
  padding: 0.5em 1em; 
  background: #2563eb; 
  color: #fff; 
  border-radius: 4px; 
  border: none; 
  cursor: pointer; 
}

.btn:hover { 
  background: #1d4ed8; 
}

.preview-image {
  margin-top: 0.5rem; /* mt-2 */
  border: 1px solid #e5e7eb; /* border */
  border-radius: 0.25rem; /* rounded */
}
</style>
