import { ref, computed } from 'vue';
import { useChatStore } from '../store/modules/chat';
import { useBookStore } from '../store/modules/book';

export function useChat() {
  const chatStore = useChatStore();
  const bookStore = useBookStore();
  
  // 输入框的内容
  const inputText = ref('');
  
  // 聊天加载状态
  const isLoading = ref(false);
  
  // 错误信息
  const errorMessage = ref('');
  
  // 是否显示建议问题
  const showSuggestions = ref(true);
  
  // 是否显示学习工具
  const showLearningTools = ref(false);
  
  // 获取当前活跃的消息列表
  const messages = computed(() => chatStore.activeMessages);
  
  // 获取当前的对话
  const currentConversation = computed(() => chatStore.activeConversation);
  
  // 获取最后一条消息
  const lastMessage = computed(() => {
    if (!messages.value.length) return null;
    return messages.value[messages.value.length - 1];
  });
  
  // 更新聊天输入框中的文字
  function updateInputText(text) {
    inputText.value = text;
  }
  
  // 清空输入框
  function clearInput() {
    inputText.value = '';
  }
  
  // 切换建议问题显示/隐藏
  function toggleSuggestions() {
    showSuggestions.value = !showSuggestions.value;
  }
  
  // 切换学习工具显示/隐藏
  function toggleLearningTools() {
    showLearningTools.value = !showLearningTools.value;
  }
  
  // 从书籍上下文中提取信息
  function extractBookContext() {
    if (!bookStore.currentBook) return null;
    
    // 获取当前选中的文本
    let selection = '';
    if (window.getSelection) {
      selection = window.getSelection().toString();
    }
    
    return {
      id: bookStore.currentBook.id,
      title: bookStore.currentBook.title,
      pageNumber: bookStore.currentPage,
      selection: selection,
      pageContent: bookStore.currentPageContent.slice(0, 1000) // 提取前1000个字符作为上下文
    };
  }
  
  // 发送消息
  async function sendMessage(text = '') {
    // 使用参数中的文本或输入框中的文本
    const messageText = text || inputText.value;
    
    // 验证消息内容
    if (!messageText.trim()) {
      errorMessage.value = '请输入消息内容';
      return null;
    }
    
    try {
      isLoading.value = true;
      errorMessage.value = '';
      
      // 提取当前书籍上下文
      const bookContext = extractBookContext();
      
      // 发送消息
      const sentMessage = chatStore.sendMessage(messageText, bookContext);
      
      // 清空输入框
      clearInput();
      
      // 模拟AI响应
      // 在实际应用中，这里将调用后端API
      setTimeout(() => {
        const response = simulateAIResponse(messageText, bookContext);
        chatStore.receiveResponse(response.content, response.references);
        isLoading.value = false;
      }, 1000);
      
      return sentMessage;
    } catch (error) {
      console.error('发送消息失败:', error);
      errorMessage.value = '发送消息失败，请重试';
      return null;
    }
  }
  
  // 模拟AI响应
  // 注意：这只是用于演示的模拟函数，实际应用中将通过API调用AI服务
  function simulateAIResponse(message, bookContext) {
    // 简单的响应模拟
    let content = `我理解你的问题是关于"${message}"。`;
    
    // 如果有书籍上下文，添加相关信息
    if (bookContext) {
      content += `\n\n基于你正在阅读的《${bookContext.title}》第${bookContext.pageNumber}页的内容，`;
      
      if (bookContext.selection) {
        content += `特别是你选中的文本："${bookContext.selection.slice(0, 50)}..."，`;
      }
      
      content += `我可以提供以下解答：\n\n`;
      content += `这个问题涉及到该书所讨论的核心概念。根据页面内容，这个主题是在建立理论框架的基础上进行分析和应用的。\n\n`;
      content += `作者通过多个实例展示了这个概念在实际场景中的应用，并且强调了它的重要性。如果你想更深入地理解这个概念，我建议你继续阅读下一章，那里有更详细的讨论。`;
    } else {
      content += `\n\n由于你没有选择具体的书籍内容，我只能提供一般性的解答：\n\n`;
      content += `这个问题通常可以从多个角度来理解。在学术研究中，人们普遍认为这个问题需要结合具体场景和背景进行分析。\n\n`;
      content += `如果你希望得到更具体的答案，我建议你选择书中的相关段落，这样我可以基于特定内容为你提供更准确的解释。`;
    }
    
    // 模拟引用
    let references = [];
    if (bookContext) {
      references = [
        {
          pageNumber: bookContext.pageNumber,
          text: bookContext.selection || '相关内容...',
          context: '在这一段中，作者详细阐述了这个概念的基本原理...'
        }
      ];
      
      // 如果当前不是第一页，添加前一页的引用
      if (bookContext.pageNumber > 1) {
        references.push({
          pageNumber: bookContext.pageNumber - 1,
          text: '上一页的相关内容...',
          context: '这里包含了该概念的前置知识介绍...'
        });
      }
    }
    
    return {
      content,
      references
    };
  }
  
  // 创建新的对话
  function createNewChat() {
    // 创建新对话，如果有书籍信息，则关联书籍
    if (bookStore.currentBook) {
      return chatStore.createNewConversation(
        `关于"${bookStore.currentBook.title}"的对话`, 
        bookStore.currentBook.id,
        bookStore.currentBook.title
      );
    } else {
      return chatStore.createNewConversation('新对话');
    }
  }
  
  // 切换到指定对话
  function switchToChat(conversationId) {
    return chatStore.switchConversation(conversationId);
  }
  
  // 使用建议的问题
  function useSuggestedQuestion(question) {
    return sendMessage(question);
  }
  
  // 更新对话标题
  function updateChatTitle(title) {
    if (!currentConversation.value) return false;
    return chatStore.updateConversationTitle(currentConversation.value.id, title);
  }
  
  // 删除当前对话
  function deleteCurrentChat() {
    if (!currentConversation.value) return false;
    return chatStore.deleteConversation(currentConversation.value.id);
  }
  
  // 清除所有对话历史
  function clearAllChats() {
    return chatStore.clearAllConversations();
  }
  
  // 导出当前对话
  function exportCurrentChat() {
    if (!currentConversation.value) return null;
    
    const chatData = {
      conversation: currentConversation.value,
      exportDate: new Date().toISOString()
    };
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(chatData, null, 2);
    
    // 创建Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${currentConversation.value.title.replace(/\s+/g, '-')}.json`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return chatData;
  }
  
  return {
    inputText,
    isLoading,
    errorMessage,
    showSuggestions,
    showLearningTools,
    messages,
    currentConversation,
    lastMessage,
    updateInputText,
    clearInput,
    toggleSuggestions,
    toggleLearningTools,
    sendMessage,
    createNewChat,
    switchToChat,
    useSuggestedQuestion,
    updateChatTitle,
    deleteCurrentChat,
    clearAllChats,
    exportCurrentChat
  };
}
