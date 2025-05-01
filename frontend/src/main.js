import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// 创建Pinia实例
const pinia = createPinia()

// 创建应用实例并使用Pinia
const app = createApp(App)
app.use(pinia)
app.mount('#app')
