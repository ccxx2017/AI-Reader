import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useChatStore = defineStore('chat', () => {
  // 聊天历史记录
  const chatHistory = ref([]);
  
  // 当前活跃的对话ID
  const activeConversationId = ref(null);
  
  // 对话历史记录
  const conversations = ref([
    {
      id: 'conversation-1',
      title: '解析"深度学习"第三章',
      bookId: '1',
      bookTitle: '深度学习基础',
      timestamp: Date.now() - 86400000, // 1天前
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: '请解释一下这一章中的反向传播算法',
          timestamp: Date.now() - 86400000,
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: '反向传播算法是神经网络学习的核心算法之一，它通过计算损失函数对于网络中每个权重的梯度，使得网络能够通过梯度下降来更新权重并最小化误差。\n\n具体来说，算法包括以下几个步骤：\n\n1. 前向传播：输入数据通过网络向前传播，计算每层的输出。\n2. 计算损失：使用损失函数计算网络输出与预期输出之间的差异。\n3. 反向传播误差：从输出层开始，向后计算每一层中每个神经元对于总误差的贡献。\n4. 更新权重：根据每个权重对误差的贡献，使用梯度下降法更新权重。\n\n这个算法之所以叫"反向"传播，是因为误差信号从输出层向后传递到输入层。',
          timestamp: Date.now() - 86400000 + 20000,
          references: [
            {
              pageNumber: 32,
              text: '反向传播算法的详细描述...',
              context: '在计算每一层的导数时，我们可以应用链式法则...'
            }
          ]
        }
      ]
    },
    {
      id: 'conversation-2',
      title: '关于量子计算的问题',
      bookId: '2',
      bookTitle: '量子计算入门',
      timestamp: Date.now() - 86400000 * 3, // 3天前
      messages: [
        {
          id: 'msg-3',
          role: 'user',
          content: '量子位和经典位有什么区别？',
          timestamp: Date.now() - 86400000 * 3,
        },
        {
          id: 'msg-4',
          role: 'assistant',
          content: '量子位（qubit）和经典位（bit）的核心区别在于：\n\n1. 状态表示：\n   - 经典位只能处于0或1两种状态之一\n   - 量子位可以同时处于0和1的叠加状态\n\n2. 信息容量：\n   - n个经典位可以表示2^n个状态中的一个\n   - n个量子位可以表示2^n个状态的叠加\n\n3. 测量特性：\n   - 经典位可以被测量而不改变其状态\n   - 量子位一旦被测量，其叠加状态会坍缩为0或1的确定状态\n\n4. 量子纠缠：\n   - 经典位之间不存在纠缠现象\n   - 量子位可以与其他量子位纠缠，形成一个不可分离的量子系统\n\n这些特性使得量子计算机在某些问题上拥有指数级的速度优势。',
          timestamp: Date.now() - 86400000 * 3 + 15000,
          references: [
            {
              pageNumber: 24,
              text: '量子比特（量子位）的定义...',
              context: '与经典比特不同，量子比特可以处于叠加状态...'
            }
          ]
        }
      ]
    }
  ]);
  
  // 当前正在生成的响应
  const generatingResponse = ref(false);
  
  // 建议的问题
  const suggestedQuestions = ref([
    '当前这一章的主要观点是什么？',
    '请解释一下这个概念的实际应用',
    '这个理论与前一章的内容有什么关联？',
    '这部分内容存在哪些争议？'
  ]);
  
  // 聊天设置
  const chatSettings = ref({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    includePageContext: true,
    includeBookmarkContext: true,
    includeNotesContext: true,
    responseTone: 'balanced', // 'academic', 'simple', 'balanced'
    responseLength: 'medium', // 'short', 'medium', 'long'
    enableCitations: true,
  });
  
  // 当前活跃的对话
  const activeConversation = computed(() => {
    if (!activeConversationId.value) return null;
    return conversations.value.find(conv => conv.id === activeConversationId.value);
  });
  
  // 当前活跃对话的消息
  const activeMessages = computed(() => {
    if (!activeConversation.value) return [];
    return activeConversation.value.messages;
  });
  
  // 发送新消息
  function sendMessage(content, bookContext = null) {
    if (!content.trim()) return null;
    
    // 如果没有活跃对话，创建一个新对话
    if (!activeConversationId.value) {
      createNewConversation(bookContext?.title || '新对话', bookContext?.id);
    }
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    
    // 如果有书籍上下文，添加到消息中
    if (bookContext) {
      newMessage.bookContext = {
        bookId: bookContext.id,
        pageNumber: bookContext.pageNumber,
        selection: bookContext.selection
      };
    }
    
    // 找到当前对话
    const conversation = conversations.value.find(conv => conv.id === activeConversationId.value);
    
    // 添加新消息
    conversation.messages.push(newMessage);
    
    // 更新对话的时间戳
    conversation.timestamp = Date.now();
    
    // 设置为正在生成响应
    generatingResponse.value = true;
    
    // 保存对话历史
    saveConversations();
    
    return newMessage;
  }
  
  // 接收助手响应
  function receiveResponse(content, references = []) {
    if (!activeConversationId.value) return null;
    
    // 找到当前对话
    const conversation = conversations.value.find(conv => conv.id === activeConversationId.value);
    if (!conversation) return null;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
      references
    };
    
    // 添加新消息
    conversation.messages.push(newMessage);
    
    // 更新对话的时间戳
    conversation.timestamp = Date.now();
    
    // 设置为不再生成响应
    generatingResponse.value = false;
    
    // 保存对话历史
    saveConversations();
    
    return newMessage;
  }
  
  // 创建新对话
  function createNewConversation(title = '新对话', bookId = null, bookTitle = null) {
    const newConversation = {
      id: `conversation-${Date.now()}`,
      title,
      bookId,
      bookTitle,
      timestamp: Date.now(),
      messages: []
    };
    
    // 添加到对话列表
    conversations.value.push(newConversation);
    
    // 设置为活跃对话
    activeConversationId.value = newConversation.id;
    
    // 保存对话历史
    saveConversations();
    
    return newConversation;
  }
  
  // 切换到指定对话
  function switchConversation(conversationId) {
    // 检查对话是否存在
    const conversation = conversations.value.find(conv => conv.id === conversationId);
    if (!conversation) return false;
    
    // 切换活跃对话
    activeConversationId.value = conversationId;
    
    return true;
  }
  
  // 更新对话标题
  function updateConversationTitle(conversationId, newTitle) {
    // 找到对话
    const conversation = conversations.value.find(conv => conv.id === conversationId);
    if (!conversation) return false;
    
    // 更新标题
    conversation.title = newTitle;
    
    // 保存对话历史
    saveConversations();
    
    return true;
  }
  
  // 删除对话
  function deleteConversation(conversationId) {
    // 找到对话索引
    const index = conversations.value.findIndex(conv => conv.id === conversationId);
    if (index < 0) return false;
    
    // 删除对话
    conversations.value.splice(index, 1);
    
    // 如果删除的是当前活跃对话，重置活跃对话
    if (activeConversationId.value === conversationId) {
      activeConversationId.value = conversations.value.length > 0 ? conversations.value[0].id : null;
    }
    
    // 保存对话历史
    saveConversations();
    
    return true;
  }
  
  // 清空对话历史
  function clearAllConversations() {
    // 清空对话列表
    conversations.value = [];
    
    // 重置活跃对话
    activeConversationId.value = null;
    
    // 保存对话历史
    saveConversations();
    
    return true;
  }
  
  // 更新聊天设置
  function updateChatSettings(newSettings) {
    chatSettings.value = { ...chatSettings.value, ...newSettings };
    
    // 保存设置
    localStorage.setItem('chatSettings', JSON.stringify(chatSettings.value));
    
    return chatSettings.value;
  }
  
  // 获取按照时间排序的对话列表
  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) => b.timestamp - a.timestamp);
  });
  
  // 搜索对话
  function searchConversations(query) {
    if (!query || query.trim() === '') {
      return sortedConversations.value;
    }
    
    const queryLower = query.toLowerCase();
    return sortedConversations.value.filter(conv => {
      // 搜索标题
      if (conv.title.toLowerCase().includes(queryLower)) {
        return true;
      }
      
      // 搜索消息内容
      return conv.messages.some(msg => 
        msg.content.toLowerCase().includes(queryLower)
      );
    });
  }
  
  // 添加或更新建议问题
  function updateSuggestedQuestions(questions) {
    if (Array.isArray(questions)) {
      suggestedQuestions.value = [...questions];
    }
  }
  
  // 保存对话历史到本地存储
  function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(conversations.value));
    localStorage.setItem('activeConversationId', activeConversationId.value);
  }
  
  // 从本地存储加载对话历史
  function loadConversations() {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      try {
        conversations.value = JSON.parse(savedConversations);
      } catch (error) {
        console.error('加载对话历史失败:', error);
      }
    }
    
    const savedActiveId = localStorage.getItem('activeConversationId');
    if (savedActiveId) {
      activeConversationId.value = savedActiveId;
    }
    
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        chatSettings.value = { ...chatSettings.value, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('加载聊天设置失败:', error);
      }
    }
  }
  
  // 初始化
  function init() {
    loadConversations();
  }
  
  return {
    chatHistory,
    activeConversationId,
    conversations,
    generatingResponse,
    suggestedQuestions,
    chatSettings,
    activeConversation,
    activeMessages,
    sortedConversations,
    sendMessage,
    receiveResponse,
    createNewConversation,
    switchConversation,
    updateConversationTitle,
    deleteConversation,
    clearAllConversations,
    updateChatSettings,
    searchConversations,
    updateSuggestedQuestions,
    init
  };
});
