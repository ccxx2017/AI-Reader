<template>
  <!-- 右侧AI助手聊天面板 -->
  <div id="chat-panel" class="chat-panel">
    <div class="chat-card">
      <!-- 顶部控制栏 -->
      <ChatHeader @open-settings="openSettingsPanel" />
      
      <!-- 聊天内容区域 -->
      <ChatMessages 
        :messages="messages" 
        :isThinking="isThinking"
        :isMessageCollapsed="isMessageCollapsed"
        :isLongMessage="isLongMessage"
        @toggle-message-collapse="toggleMessageCollapse"
        @toggle-favorite="toggleFavorite"
        @explain-simpler="explainSimpler"
        @explain-detailed="explainDetailed"
        ref="chatContainer"
      />
      
      <!-- 智能提问建议 -->
      <QuestionSuggestions 
        :showSuggestions="showSuggestions" 
        :questionSuggestions="questionSuggestions"
        :relatedHistoryQuestions="relatedHistoryQuestions"
        @toggle-suggestions="toggleSuggestions"
        @use-suggestion="useQuestionSuggestion"
      />
      
      <!-- 学习辅助工具 -->
      <LearningTools 
        :showTools="showTools"
        @toggle-tools="toggleTools"
        @generate-concept-map="generateConceptMap"
        @generate-study-cards="generateStudyCards"
        @generate-summary="generateSummary"
        @show-progress-stats="showProgressStats"
      />
      
      <!-- 底部输入区域 -->
      <ChatInput 
        v-model:userInput="userInput" 
        @send-message="sendMessage" 
        @open-file-upload="openFileUpload"
        @toggle-voice-input="toggleVoiceInput"
        @open-drawing-tool="openDrawingTool"
        @open-camera-upload="openCameraUpload"
        :isVoiceInputActive="isVoiceInputActive"
      />
    </div>
  </div>
  
  <!-- 个性化设置面板 -->
  <SettingsPanel 
    v-if="showSettingsPanel" 
    :settings="aiSettings"
    @close="closeSettingsPanel" 
    @save="saveSettings"
  />
  
  <!-- 绘图工具面板 -->
  <DrawingTool 
    v-if="showDrawingTool" 
    @close="closeDrawingTool" 
    @submit="submitDrawing"
  />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import ChatHeader from './ChatHeader.vue';
import ChatMessages from './ChatMessages.vue';
import QuestionSuggestions from './QuestionSuggestions.vue';
import LearningTools from './LearningTools.vue';
import ChatInput from './ChatInput.vue';
import SettingsPanel from './SettingsPanel.vue';
import DrawingTool from './DrawingTool.vue';

// 消息列表
const messages = ref([
  {
    id: 1,
    type: 'system',
    content: '你好！我是你的AI阅读助手。我已经理解了你正在阅读的内容，有什么可以帮助你的吗？',
    timestamp: Date.now() - 6000000
  },
  {
    id: 2,
    type: 'user',
    content: '你能解释一下深度学习与传统机器学习的主要区别吗？',
    timestamp: Date.now() - 300000
  },
  {
    id: 3,
    type: 'assistant',
    content: `根据你正在阅读的内容，深度学习与传统机器学习的主要区别有：

- 特征工程：传统机器学习需要手动特征工程，而深度学习能够自动学习特征
- 数据量要求：深度学习通常需要大量数据，而传统方法可以在较小数据集上表现良好
- 计算资源：深度学习对计算资源要求更高，通常需要GPU加速
- 可解释性：传统机器学习方法通常可解释性更强，而深度学习常被视为"黑盒"

你可以在第16页的表格中找到这些信息的详细比较。`,
    timestamp: Date.now() - 240000,
    favorited: false
  },
  {
    id: 4,
    type: 'user',
    content: '什么情况下应该选择深度学习而不是传统机器学习方法？',
    timestamp: Date.now() - 5000
  }
]);

// 思考状态
const isThinking = ref(true);

// 用户输入
const userInput = ref('');

// 问题建议控制
const showSuggestions = ref(true);

// 学习工具控制
const showTools = ref(false);

// 消息折叠控制
const isMessageCollapsed = ref(true);
const isLongMessage = ref(true);

// 多模态输入控制
const isVoiceInputActive = ref(false);
const showDrawingTool = ref(false);

// 设置面板控制
const showSettingsPanel = ref(false);

// AI设置
const aiSettings = ref({
  responseLength: 'balanced', // 'concise', 'balanced', 'detailed'
  tonality: 'professional', // 'friendly', 'professional', 'academic'
  includeCitations: true,
  autoSuggestQuestions: true,
  notifyBookmarkReferences: true,
  notifyNoteReferences: true,
  theme: 'auto' // 'light', 'dark', 'auto'
});

// 聊天容器引用
const chatContainer = ref(null);

// 问题建议列表
const questionSuggestions = ref([
  { text: '深度学习适用于哪些领域？', level: 'basic' },
  { text: '如何选择合适的神经网络架构？', level: 'advanced' },
  { text: '迁移学习如何解决数据稀缺问题？', level: 'expert' },
  { text: '反向传播算法的数学原理是什么？', level: 'expert' },
  { text: '深度学习模型参数调优有哪些策略？', level: 'advanced' }
]);

// 历史相关问题
const relatedHistoryQuestions = ref([
  '深度学习训练时如何避免过拟合？',
  '卷积神经网络与循环神经网络的区别？'
]);

// 打开个性化设置面板
function openSettingsPanel() {
  showSettingsPanel.value = true;
}

// 关闭个性化设置面板
function closeSettingsPanel() {
  showSettingsPanel.value = false;
}

// 保存设置
function saveSettings() {
  closeSettingsPanel();
  // 这里可以添加保存设置的逻辑
}

// 折叠/展开消息
function toggleMessageCollapse() {
  isMessageCollapsed.value = !isMessageCollapsed.value;
}

// 收藏/取消收藏消息
function toggleFavorite() {
  // 找到当前选中的消息（这里简化为最后一条AI消息）
  const assistantMessages = messages.value.filter(msg => msg.type === 'assistant');
  if (assistantMessages.length > 0) {
    const lastMessage = assistantMessages[assistantMessages.length - 1];
    lastMessage.favorited = !lastMessage.favorited;
    
    // 使用一个临时变量来存储消息，以确保视图更新
    const tempMessages = [...messages.value];
    messages.value = tempMessages;
    
    // 如果收藏，显示提示
    if (lastMessage.favorited) {
      // 这里可以添加收藏成功的提示
      console.log('消息已收藏');
    }
  }
}

// 解释调节功能
function explainSimpler() {
  isThinking.value = true;
  
  // 模拟请求延迟
  setTimeout(() => {
    // 添加更简单的解释
    messages.value.push({
      id: Date.now(),
      type: 'assistant',
      content: '简单来说，传统机器学习像是按照特定规则做决策，你需要告诉它哪些特征重要；而深度学习就像人脑，能自己学习哪些特征重要，但需要大量数据和强大计算机。当你有海量数据和足够计算资源时，选择深度学习；数据少或需要模型具有高解释性，传统方法可能是更好的选择。',
      timestamp: Date.now(),
      favorited: false
    });
    
    isThinking.value = false;
    scrollToBottom();
  }, 1500);
}

function explainDetailed() {
  // 类似于explainSimpler的实现
}

// 使用问题建议
function useQuestionSuggestion(question) {
  userInput.value = question;
  sendMessage();
}

// 学习辅助工具功能
function generateConceptMap() {
  console.log('生成概念图谱');
}

function generateStudyCards() {
  console.log('生成学习卡片');
}

function generateSummary() {
  console.log('生成学习概要');
}

function showProgressStats() {
  console.log('显示学习统计');
}

// 多模态交互功能
function openFileUpload() {
  // 触发文件上传对话框
  document.getElementById('file-upload').click();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    console.log('上传文件:', file.name);
    // 这里可以添加文件处理逻辑
  }
}

function toggleVoiceInput() {
  isVoiceInputActive.value = !isVoiceInputActive.value;
}

function openDrawingTool() {
  showDrawingTool.value = true;
}

function closeDrawingTool() {
  showDrawingTool.value = false;
}

function submitDrawing() {
  console.log('提交绘图');
  closeDrawingTool();
  // 这里可以添加处理绘图的逻辑
}

function openCameraUpload() {
  console.log('打开相机上传');
}

// 发送消息
function sendMessage() {
  if (!userInput.value.trim()) return;
  
  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: userInput.value,
    timestamp: Date.now()
  });
  
  // 清空输入框
  const currentInput = userInput.value;
  userInput.value = '';
  
  // 滚动到底部
  scrollToBottom();
  
  // 显示"思考中"状态
  isThinking.value = true;
  
  // 模拟请求延迟
  setTimeout(() => {
    // 添加AI回复
    messages.value.push({
      id: Date.now(),
      type: 'assistant',
      content: generateMockResponse(currentInput),
      timestamp: Date.now(),
      favorited: false
    });
    
    isThinking.value = false;
    scrollToBottom();
  }, 1500);
}

// 模拟回复内容生成
function generateMockResponse(input) {
  // 简单的模拟回复，实际应用中会从后端API获取
  if (input.includes('深度学习') || input.includes('机器学习')) {
    return '深度学习适合用于有大量数据、复杂模式识别任务的场景，例如：\n\n1. 图像与视觉识别\n2. 自然语言处理\n3. 语音识别\n4. 推荐系统\n\n相比传统方法，在这些领域深度学习通常能提供更高的精度，但代价是需要更多计算资源和训练数据。如果数据量有限或需要模型具有高解释性，传统机器学习可能是更好的选择。';
  }
  
  return '感谢您的问题。基于您正在阅读的内容，这是一个有趣的话题。您可以在书的第18-25页找到相关讨论。您还想了解这个主题的哪些具体方面？';
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      const element = chatContainer.value.$el;
      element.scrollTop = element.scrollHeight;
    }
  });
}

// 智能提问建议控制
function toggleSuggestions() {
  showSuggestions.value = !showSuggestions.value;
}

// 学习工具控制
function toggleTools() {
  showTools.value = !showTools.value;
}

onMounted(() => {
  // 初始滚动到底部
  scrollToBottom();
});
</script>

<style scoped>
.chat-panel {
  flex: 1;
  min-width: 300px;
  overflow: hidden;
}

.chat-card {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .chat-card {
  background-color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
