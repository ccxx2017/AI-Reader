import api from './api';

// 书籍相关的API服务
export const bookService = {
  /**
   * 获取书籍列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回书籍列表数据
   */
  getBooks(params = {}) {
    return api.get('/books', { params });
  },
  
  /**
   * 获取单本书籍详情
   * @param {String} id - 书籍ID
   * @returns {Promise} - 返回书籍详情数据
   */
  getBookById(id) {
    return api.get(`/books/${id}`);
  },
  
  /**
   * 获取书籍章节列表
   * @param {String} bookId - 书籍ID
   * @returns {Promise} - 返回章节列表数据
   */
  getChapters(bookId) {
    return api.get(`/books/${bookId}/chapters`);
  },
  
  /**
   * 获取特定页面内容
   * @param {String} bookId - 书籍ID
   * @param {Number} pageNumber - 页码
   * @returns {Promise} - 返回页面内容数据
   */
  getPage(bookId, pageNumber) {
    return api.get(`/books/${bookId}/pages/${pageNumber}`);
  },
  
  /**
   * 搜索书籍内容
   * @param {String} bookId - 书籍ID
   * @param {String} query - 搜索关键字
   * @returns {Promise} - 返回搜索结果
   */
  searchInBook(bookId, query) {
    return api.get(`/books/${bookId}/search`, { params: { query } });
  },
  
  /**
   * 获取书籍的书签列表
   * @param {String} bookId - 书籍ID
   * @returns {Promise} - 返回书签列表数据
   */
  getBookmarks(bookId) {
    return api.get(`/books/${bookId}/bookmarks`);
  },
  
  /**
   * 添加书签
   * @param {String} bookId - 书籍ID
   * @param {Object} bookmark - 书签数据
   * @returns {Promise} - 返回添加结果
   */
  addBookmark(bookId, bookmark) {
    return api.post(`/books/${bookId}/bookmarks`, bookmark);
  },
  
  /**
   * 更新书签
   * @param {String} bookId - 书籍ID
   * @param {String} bookmarkId - 书签ID
   * @param {Object} bookmark - 更新的书签数据
   * @returns {Promise} - 返回更新结果
   */
  updateBookmark(bookId, bookmarkId, bookmark) {
    return api.put(`/books/${bookId}/bookmarks/${bookmarkId}`, bookmark);
  },
  
  /**
   * 删除书签
   * @param {String} bookId - 书籍ID
   * @param {String} bookmarkId - 书签ID
   * @returns {Promise} - 返回删除结果
   */
  deleteBookmark(bookId, bookmarkId) {
    return api.delete(`/books/${bookId}/bookmarks/${bookmarkId}`);
  },
  
  /**
   * 获取阅读进度
   * @param {String} bookId - 书籍ID
   * @returns {Promise} - 返回阅读进度数据
   */
  getReadingProgress(bookId) {
    return api.get(`/books/${bookId}/progress`);
  },
  
  /**
   * 更新阅读进度
   * @param {String} bookId - 书籍ID
   * @param {Object} progress - 进度数据
   * @returns {Promise} - 返回更新结果
   */
  updateReadingProgress(bookId, progress) {
    return api.put(`/books/${bookId}/progress`, progress);
  },
  
  /**
   * 保存阅读会话
   * @param {String} bookId - 书籍ID
   * @param {Object} session - 会话数据
   * @returns {Promise} - 返回保存结果
   */
  saveReadingSession(bookId, session) {
    return api.post(`/books/${bookId}/sessions`, session);
  }
};

export default bookService;
