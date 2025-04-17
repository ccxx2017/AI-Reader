<template>
  <div class="camera-ocr">
    <video ref="video" autoplay playsinline width="320" height="240"></video>
    <canvas ref="canvas" width="320" height="240" style="display:none;"></canvas>
    <div class="mt-2 flex space-x-2">
      <button @click="takePhoto" class="btn">拍照</button>
      <button v-if="photoData" @click="uploadPhoto" class="btn">上传识别</button>
    </div>
    <img v-if="photoData" :src="photoData" alt="拍照预览" class="mt-2 border rounded" width="160" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import Tesseract from 'tesseract.js'

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
    const formData = new FormData()
    formData.append('file', blob, 'photo.png')
    
    // 更新状态：AI处理中
    emits('ocr-status', {camera: 'ready', page: 'done', ai: 'processing', captured: 'idle'})
    
    const res = await fetch('http://localhost:8000/api/ocr/upload', {
      method: 'POST',
      body: formData
    })
    
    const data = await res.json()
    ocrText.value = data.text
    
    // 发送识别结果到主区域
    emits('ocr-result', data.text)
    
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
.camera-ocr { max-width: 340px; }
.btn { padding: 0.5em 1em; background: #2563eb; color: #fff; border-radius: 4px; border: none; cursor: pointer; }
.btn:hover { background: #1d4ed8; }
</style>