import axios from 'axios';

// 创建API实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 获取存储的token
    const token = localStorage.getItem('token');
    
    // 如果存在token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误响应
      const { status, data } = error.response;
      
      // 处理401未授权错误
      if (status === 401) {
        // 清除存储的token
        localStorage.removeItem('token');
        
        // 重定向到登录页
        // window.location.href = '/login';
      }
      
      return Promise.reject(data || error);
    } else if (error.request) {
      // 请求已发送但未收到响应
      return Promise.reject({
        message: '无法连接到服务器，请检查您的网络连接。'
      });
    } else {
      // 请求设置时发生错误
      return Promise.reject({
        message: '请求配置错误。'
      });
    }
  }
);

export default api;
