import api from './api';

// 用户相关的API服务
export const userService = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @returns {Promise} - 返回登录结果
   */
  login(credentials) {
    return api.post('/users/login', credentials);
  },
  
  /**
   * 用户注册
   * @param {Object} userData - 用户数据
   * @returns {Promise} - 返回注册结果
   */
  register(userData) {
    return api.post('/users/register', userData);
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} - 返回用户信息
   */
  getCurrentUser() {
    return api.get('/users/me');
  },
  
  /**
   * 更新用户信息
   * @param {Object} userData - 更新的用户数据
   * @returns {Promise} - 返回更新结果
   */
  updateUserProfile(userData) {
    return api.put('/users/profile', userData);
  },
  
  /**
   * 修改密码
   * @param {Object} passwordData - 包含旧密码和新密码的对象
   * @returns {Promise} - 返回更改结果
   */
  changePassword(passwordData) {
    return api.put('/users/password', passwordData);
  },
  
  /**
   * 获取用户的阅读历史
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回阅读历史数据
   */
  getReadingHistory(params = {}) {
    return api.get('/users/reading-history', { params });
  },
  
  /**
   * 获取用户的笔记
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回笔记数据
   */
  getNotes(params = {}) {
    return api.get('/users/notes', { params });
  },
  
  /**
   * 获取用户的学习状态
   * @returns {Promise} - 返回学习状态数据
   */
  getLearningStatus() {
    return api.get('/users/learning-status');
  },
  
  /**
   * 获取用户的阅读统计
   * @param {Object} params - 查询参数，可以指定时间范围
   * @returns {Promise} - 返回阅读统计数据
   */
  getReadingStats(params = {}) {
    return api.get('/users/reading-stats', { params });
  },
  
  /**
   * 同步用户数据到云端
   * @param {Object} data - 需要同步的数据
   * @returns {Promise} - 返回同步结果
   */
  syncData(data) {
    return api.post('/users/sync', data);
  },
  
  /**
   * 从云端获取同步的用户数据
   * @returns {Promise} - 返回同步的数据
   */
  getSyncedData() {
    return api.get('/users/sync');
  },
  
  /**
   * 用户登出
   * @returns {Promise} - 返回登出结果
   */
  logout() {
    return api.post('/users/logout');
  }
};

export default userService;
