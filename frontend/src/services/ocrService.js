import api from './api';

// OCR识别相关的API服务
export const ocrService = {
  /**
   * 上传图片进行OCR识别
   * @param {File} imageFile - 图片文件
   * @returns {Promise} - 返回OCR识别结果
   */
  recognizeImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return api.post('/ocr/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * 从摄像头捕获的图像进行OCR识别
   * @param {Blob} imageBlob - 图像数据
   * @returns {Promise} - 返回OCR识别结果
   */
  recognizeCapturedImage(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');
    
    return api.post('/ocr/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * 识别PDF文件中的文本
   * @param {File} pdfFile - PDF文件
   * @returns {Promise} - 返回识别结果
   */
  recognizePdf(pdfFile) {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    
    return api.post('/ocr/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  /**
   * 获取OCR识别历史记录
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回历史记录数据
   */
  getOcrHistory(params = {}) {
    return api.get('/ocr/history', { params });
  },
  
  /**
   * 将OCR识别结果转换为书籍
   * @param {String} ocrResultId - OCR结果ID
   * @param {Object} bookInfo - 书籍信息
   * @returns {Promise} - 返回转换结果
   */
  convertToBook(ocrResultId, bookInfo) {
    return api.post(`/ocr/results/${ocrResultId}/convert`, bookInfo);
  },
  
  /**
   * 获取单次OCR识别的详细结果
   * @param {String} resultId - 结果ID
   * @returns {Promise} - 返回详细结果数据
   */
  getOcrResult(resultId) {
    return api.get(`/ocr/results/${resultId}`);
  },
  
  /**
   * 修正OCR识别结果
   * @param {String} resultId - 结果ID
   * @param {Object} corrections - 修正数据
   * @returns {Promise} - 返回修正后的结果
   */
  correctOcrResult(resultId, corrections) {
    return api.put(`/ocr/results/${resultId}/correct`, corrections);
  }
};

export default ocrService;
