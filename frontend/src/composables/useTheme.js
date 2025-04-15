import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  // 默认使用浏览器偏好或系统设置
  const currentTheme = ref('light')
  
  // 设置主题
  function setTheme(theme) {
    currentTheme.value = theme
    
    // 更新文档类
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
      document.body.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    }
    
    // 保存到本地存储
    localStorage.setItem('theme', theme)
  }
  
  // 切换主题
  function toggleTheme() {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }
  
  // 初始化主题
  onMounted(() => {
    // 检查本地存储中是否有保存的主题
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      // 使用保存的主题
      setTheme(savedTheme)
    } else {
      // 检查用户操作系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      })
    }
  })
  
  // 监听主题变化
  watch(currentTheme, (newTheme) => {
    setTheme(newTheme)
  })
  
  return {
    currentTheme,
    setTheme,
    toggleTheme
  }
}
