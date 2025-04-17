<template>
  <!-- 右侧AI助手聊天面板 -->
  <div id="chat-panel" class="panel-container flex-1 min-w-[300px] overflow-hidden">
    <div class="card h-full overflow-hidden flex flex-col">
      <!-- 顶部控制栏 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="text-lg font-medium">AI 助手</div>
        <div class="flex space-x-2">
          <!-- 个性化设置 -->
          <button @click="openSettingsPanel" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="个性化设置">
            <i class="fas fa-sliders-h text-gray-600 dark:text-gray-300"></i>
          </button>
          <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="聊天记录">
            <i class="fas fa-history text-gray-600 dark:text-gray-300"></i>
          </button>
          <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="设置">
            <i class="fas fa-cog text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
      </div>
      
      <!-- 聊天内容区域 -->
      <div class="flex-grow overflow-y-auto p-4" ref="chatContainer">
        <div class="space-y-4">
          <!-- 系统消息 -->
          <div class="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block max-w-[85%]">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              你好！我是你的AI阅读助手。我已经理解了你正在阅读的内容，有什么可以帮助你的吗？
            </p>
          </div>
          
          <!-- 用户消息 -->
          <div class="flex justify-end">
            <div class="py-2 px-3 bg-primary text-white rounded-lg inline-block max-w-[85%]">
              <p class="text-sm">
                你能解释一下深度学习与传统机器学习的主要区别吗？
              </p>
              <span class="text-xs text-gray-200 mt-1 block text-right">5分钟前</span>
            </div>
          </div>
          
          <!-- AI助手消息 - 可折叠 -->
          <div class="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block max-w-[85%] relative group">
            <!-- 收藏按钮 -->
            <button @click="toggleFavorite" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <i class="far fa-star text-xs text-gray-500 dark:text-gray-400"></i>
            </button>
            
            <!-- 折叠/展开按钮 -->
            <div v-if="isLongMessage" class="flex justify-between items-center mb-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">AI助手</span>
              <button @click="toggleMessageCollapse" class="text-xs text-blue-500 hover:underline focus:outline-none">
                {{ isMessageCollapsed ? '展开全部' : '折叠内容' }}
              </button>
            </div>
            
            <div :class="{'max-h-28 overflow-hidden': isMessageCollapsed && isLongMessage}">
              <p class="text-sm text-gray-700 dark:text-gray-300">
                根据你正在阅读的内容，深度学习与传统机器学习的主要区别有：
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2 ml-2">
                <li>特征工程：传统机器学习需要手动特征工程，而深度学习能够自动学习特征</li>
                <li>数据量要求：深度学习通常需要大量数据，而传统方法可以在较小数据集上表现良好</li>
                <li>计算资源：深度学习对计算资源要求更高，通常需要GPU加速</li>
                <li>可解释性：传统机器学习方法通常可解释性更强，而深度学习常被视为"黑盒"</li>
              </ul>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                你可以在第16页的表格中找到这些信息的详细比较。
              </p>
            </div>
            
            <!-- 渐变遮罩，在折叠状态下显示 -->
            <div v-if="isMessageCollapsed && isLongMessage" class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent"></div>
            
            <!-- 解释深度调节 -->
            <div class="flex mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button @click="explainSimpler" class="text-xs text-blue-500 hover:underline mr-3 focus:outline-none">
                <i class="fas fa-arrow-down mr-1"></i>更简单解释
              </button>
              <button @click="explainDetailed" class="text-xs text-blue-500 hover:underline focus:outline-none">
                <i class="fas fa-arrow-up mr-1"></i>更详细解释
              </button>
            </div>
            
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">4分钟前</span>
          </div>
          
          <!-- 用户消息 -->
          <div class="flex justify-end">
            <div class="py-2 px-3 bg-primary text-white rounded-lg inline-block max-w-[85%]">
              <p class="text-sm">
                什么情况下应该选择深度学习而不是传统机器学习方法？
              </p>
              <span class="text-xs text-gray-200 mt-1 block text-right">刚刚</span>
            </div>
          </div>
          
          <!-- AI助手消息（思考中） -->
          <div v-if="isThinking" class="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
            <p class="text-sm text-gray-700 dark:text-gray-300 thinking-dots">思考中</p>
          </div>
        </div>
      </div>
      
      <!-- 智能提问建议 - 可折叠 -->
      <div class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center px-4 py-2 cursor-pointer" @click="toggleSuggestions">
          <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
            <span>推荐问题</span>
          </div>
          <div class="text-gray-500">
            <i :class="showSuggestions ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>
        
        <div v-if="showSuggestions" class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden">
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="(suggestion, index) in questionSuggestions" 
              :key="index"
              @click="useQuestionSuggestion(suggestion.text)"
              class="px-3 py-1.5 text-xs rounded-full border focus:outline-none transition-colors"
              :class="[
                suggestion.level === 'basic' ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : 
                suggestion.level === 'advanced' ? 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                'border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
              ]"
            >
              <span v-if="suggestion.level === 'basic'" class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              <span v-if="suggestion.level === 'advanced'" class="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
              <span v-if="suggestion.level === 'expert'" class="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
              {{ suggestion.text }}
            </button>
          </div>
          <div v-if="relatedHistoryQuestions.length > 0" class="mt-2">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">之前问过：</p>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="(question, index) in relatedHistoryQuestions" 
                :key="index"
                @click="useQuestionSuggestion(question)"
                class="px-3 py-1.5 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700"
              >
                {{ question }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 学习辅助工具 - 可折叠 -->
      <div class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center px-4 py-2 cursor-pointer" @click="toggleTools">
          <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <i class="fas fa-tools mr-2 text-blue-500"></i>
            <span>学习工具</span>
          </div>
          <div class="text-gray-500">
            <i :class="showTools ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>
        
        <div v-if="showTools" class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex overflow-x-auto transition-all duration-300 overflow-hidden">
          <button @click="generateConceptMap" class="flex flex-col items-center justify-center p-2 mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
            <i class="fas fa-project-diagram text-lg"></i>
            <span class="text-xs mt-1">概念图谱</span>
          </button>
          <button @click="generateStudyCards" class="flex flex-col items-center justify-center p-2 mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
            <i class="fas fa-clone text-lg"></i>
            <span class="text-xs mt-1">学习卡片</span>
          </button>
          <button @click="generateSummary" class="flex flex-col items-center justify-center p-2 mr-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
            <i class="fas fa-file-alt text-lg"></i>
            <span class="text-xs mt-1">学习概要</span>
          </button>
          <button @click="showProgressStats" class="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none">
            <i class="fas fa-chart-line text-lg"></i>
            <span class="text-xs mt-1">学习统计</span>
          </button>
        </div>
      </div>
      
      <!-- 底部输入区域 -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="relative">
          <textarea 
            v-model="userInput"
            class="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200"
            placeholder="输入你的问题..."
            rows="2"
            @keydown.enter.prevent="sendMessage"
          ></textarea>
          <button 
            @click="sendMessage"
            class="absolute right-2 bottom-2 p-2 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="flex space-x-2">
            <button @click="openFileUpload" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative" title="上传文件">
              <i class="fas fa-paperclip"></i>
              <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
            </button>
            <button @click="toggleVoiceInput" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" :class="{'text-red-500': isRecording}" title="语音输入">
              <i class="fas fa-microphone" :class="{'animate-pulse': isRecording}"></i>
            </button>
            <button @click="openDrawingTool" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="绘图输入">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button @click="openCameraUpload" class="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none" title="拍照上传">
              <i class="fas fa-camera"></i>
            </button>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Shift + Enter 换行
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 个性化设置面板 - 默认隐藏 -->
  <div v-if="showSettingsPanel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeSettingsPanel">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-full">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium">个性化设置</h3>
        <button @click="closeSettingsPanel" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI回答风格</label>
          <select v-model="aiResponseStyle" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200">
            <option value="concise">简洁</option>
            <option value="detailed">详细</option>
            <option value="examples">案例丰富</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">知识深度级别</label>
          <div class="flex">
            <button 
              v-for="level in knowledgeLevels" 
              :key="level.value" 
              @click="knowledgeLevel = level.value"
              class="flex-1 py-2 border focus:outline-none transition-colors"
              :class="[
                knowledgeLevel === level.value ? 'bg-primary-light/10 border-primary-light text-primary-light' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
                level.value === 'beginner' ? 'rounded-l-md' : '',
                level.value === 'expert' ? 'rounded-r-md' : '',
                level.value !== 'beginner' ? '-ml-px' : ''
              ]"
            >
              {{ level.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <button @click="saveSettings" class="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          保存设置
        </button>
      </div>
    </div>
  </div>
  
  <!-- 绘图工具 - 默认隐藏 -->
  <div v-if="showDrawingTool" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeDrawingTool">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-2xl">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium">绘图输入</h3>
        <button @click="closeDrawingTool" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="p-4">
        <div class="border border-gray-300 dark:border-gray-600 rounded-md" style="height: 300px;">
          <!-- 这里将是画布区域 -->
          <div class="w-full h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-400">绘图区域</p>
          </div>
        </div>
        <div class="flex mt-4 space-x-2">
          <button class="p-2 border border-gray-300 dark:border-gray-600 rounded-md">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="p-2 border border-gray-300 dark:border-gray-600 rounded-md">
            <i class="fas fa-eraser"></i>
          </button>
          <button class="p-2 border border-gray-300 dark:border-gray-600 rounded-md">
            <i class="fas fa-undo"></i>
          </button>
          <button class="p-2 border border-gray-300 dark:border-gray-600 rounded-md">
            <i class="fas fa-trash-alt"></i>
          </button>
          <div class="flex-grow"></div>
          <button @click="submitDrawing" class="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none">
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// 聊天状态
const isThinking = ref(false);
const userInput = ref('');
const chatContainer = ref(null);
const isMessageCollapsed = ref(true);
const isLongMessage = ref(true);
const isRecording = ref(false);
const fileInput = ref(null);

// 面板控制
const showSettingsPanel = ref(false);
const showDrawingTool = ref(false);
const showSuggestions = ref(false); // 默认折叠
const showTools = ref(false); // 默认折叠

// 个性化设置
const aiResponseStyle = ref('detailed');
const knowledgeLevel = ref('intermediate');
const knowledgeLevels = [
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'expert', label: '专业' }
];

// 智能提问建议
const questionSuggestions = ref([
  { text: '深度学习在NLP中的应用', level: 'basic' },
  { text: '如何选择合适的深度学习架构', level: 'advanced' },
  { text: '神经网络优化技术对比分析', level: 'expert' },
]);

// 历史相关问题
const relatedHistoryQuestions = ref([
  '深度学习模型如何避免过拟合？',
  '迁移学习的基本原理是什么？'
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
  // 这里实现保存设置逻辑
  showSettingsPanel.value = false;
}

// 折叠/展开消息
function toggleMessageCollapse() {
  isMessageCollapsed.value = !isMessageCollapsed.value;
}

// 收藏/取消收藏消息
function toggleFavorite() {
  const target = document.querySelector('.far');
  if (target) {
    target.classList.remove('far');
    target.classList.add('fas');
    target.classList.add('text-yellow-500');
  } else {
    const target = document.querySelector('.fas');
    if (target) {
      target.classList.remove('fas');
      target.classList.remove('text-yellow-500');
      target.classList.add('far');
    }
  }
}

// 解释调节功能
function explainSimpler() {
  // 实现更简单解释的逻辑
}

function explainDetailed() {
  // 实现更详细解释的逻辑
}

// 使用问题建议
function useQuestionSuggestion(question) {
  userInput.value = question;
}

// 学习辅助工具功能
function generateConceptMap() {
  // 实现生成概念图谱的逻辑
}

function generateStudyCards() {
  // 实现生成学习卡片的逻辑
}

function generateSummary() {
  // 实现生成学习概要的逻辑
}

function showProgressStats() {
  // 实现显示学习统计的逻辑
}

// 多模态交互功能
function openFileUpload() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleFile(event) {
    // 实现文件上传逻辑
  }
  handleFile(event);
}

function toggleVoiceInput() {
  isRecording.value = !isRecording.value;
  // 实现语音输入逻辑
}

function openDrawingTool() {
  showDrawingTool.value = true;
}

function closeDrawingTool() {
  showDrawingTool.value = false;
}

function submitDrawing() {
  // 实现提交绘图的逻辑
  closeDrawingTool();
}

function openCameraUpload() {
  // 实现相机拍照上传逻辑
}

// 发送消息
function sendMessage() {
  if (!userInput.value.trim()) return;
  
  // 这里实现发送消息逻辑
  // 1. 添加用户消息到聊天记录
  // 2. 设置思考状态
  // 3. 调用API获取AI响应
  // 4. 添加AI响应到聊天记录
  // 5. 清除思考状态
  
  // 模拟思考状态
  isThinking.value = true;
  
  // 清空输入
  userInput.value = '';
  
  // 滚动到底部
  scrollToBottom();
  
  // 模拟AI响应
  setTimeout(() => {
    isThinking.value = false;
    // 添加AI响应
    // 再次滚动到底部
    scrollToBottom();
  }, 2000);
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
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
/* 思考动画 */
.thinking-dots:after {
  content: '';
  animation: thinking 1.5s infinite;
}

@keyframes thinking {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
}

/* 渐变效果增强 */
.panel-container-transition {
  transition: width 0.3s ease;
}
</style>
