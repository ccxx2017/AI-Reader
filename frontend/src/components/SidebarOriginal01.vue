<template>
  <!-- 左侧侧边栏 -->
  <div 
    id="sidebar" 
    class="sidebar-transition relative"
    :class="{ 
      'sidebar-collapsed': isCollapsed, 
      'w-1/5 min-w-[200px]': !isCollapsed,
      'w-[48px] min-w-[48px]': isCollapsed 
    }"
  >
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm h-full relative" :class="{ 'rounded-r-none': isCollapsed }">
      <!-- 折叠按钮 -->
      <div class="sidebar-toggle-wrapper absolute flex items-center" style="right: -12px; top: 70px; height: 100px; z-index: 30;">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </div>
      </div>
      
      <!-- 正常状态下显示的内容 -->
      <div class="normal-content p-4 h-full overflow-y-auto">
        <!-- 系统状态 -->
        <div class="mb-6 bg-gray-900/30 dark:bg-gray-800/30 p-3 rounded-lg">
          <h2 class="text-lg font-semibold mb-3 flex items-center">
            <i class="fas fa-server text-orange-500 mr-2"></i>
            系统状态
          </h2>
          
          <!-- 系统状态总结提示 -->
          <div class="system-status-summary mb-3 px-2.5 py-1.5 rounded-md flex items-center" 
               :class="systemStatusClass">
            <i class="fas mr-1.5 text-sm" :class="systemStatusIcon"></i>
            <span class="text-xs font-medium">{{systemStatusMessage}}</span>
          </div>
          
          <div class="space-y-3.5">
            <!-- 摄像头状态 - 优化后的动态指示器 -->
            <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
                  <i class="fas fa-camera mr-1.5"></i>
                  摄像头
                </span>
                <div class="flex items-center">
                  <span class="status-indicator pulse-animation bg-green-500 mr-1.5"></span>
                  <span class="text-sm text-white px-2 py-0.5 rounded-full bg-green-700">监测中...</span>
                </div>
              </div>
              <div class="status-details text-xs flex justify-between px-1 text-gray-300">
                <div class="flex items-center">
                  <i class="fas fa-lightbulb text-yellow-500 mr-1"></i>
                  <span>光线: 良好</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-crosshairs text-blue-400 mr-1"></i>
                  <span>对准: <i class="fas fa-check text-green-500"></i></span>
                </div>
              </div>
            </div>
            
            <!-- 页面检测状态 - 优化后的进度指示 -->
            <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
                  <i class="fas fa-file-alt mr-1.5"></i>
                  页面检测
                </span>
                <div class="flex items-center">
                  <span class="status-indicator bg-yellow-500 mr-1.5"></span>
                  <span class="text-sm text-white px-2 py-0.5 rounded-full bg-yellow-600">准备中</span>
                </div>
              </div>
              <div class="progress-bar mt-1.5 bg-gray-700 h-1 w-full rounded">
                <div class="bg-yellow-500 h-full rounded" :style="{width: '30%'}"></div>
              </div>
            </div>
            
            <!-- AI 处理状态 - 优化后的进度指示 -->
            <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
                  <i class="fas fa-robot mr-1.5"></i>
                  AI 处理
                </span>
                <div class="flex items-center">
                  <span class="status-indicator bg-gray-500 mr-1.5" :class="{'bg-blue-500 processing-animation': isAIProcessing}"></span>
                  <span class="text-sm text-white px-2 py-0.5 rounded-full" 
                    :class="isAIProcessing ? 'bg-blue-700 transition-colors duration-500' : 'bg-gray-600'">
                    {{isAIProcessing ? '分析中...' : '待机'}}
                  </span>
                </div>
              </div>
              <div v-if="isAIProcessing" class="mt-1.5">
                <div class="progress-bar bg-gray-700 h-1 w-full rounded">
                  <div class="bg-blue-500 h-full rounded transition-all duration-500 ease-in-out" :style="{width: `${aiProcessProgress}%`}"></div>
                </div>
                <div class="text-xs text-blue-300 mt-1">{{aiProcessingText}}</div>
              </div>
            </div>
            
            <!-- 已捕获页面 - 可点击下拉 -->
            <div class="status-container bg-gray-800/50 dark:bg-gray-700/50 p-2.5 rounded-lg cursor-pointer relative" @click="toggleCapturedPagesDropdown">
              <div class="flex items-center justify-between">
                <span class="text-sm text-orange-500 dark:text-orange-400 font-medium flex items-center">
                  <i class="fas fa-images mr-1.5"></i>
                  已捕获页面
                </span>
                <div class="flex items-center">
                  <span class="text-sm text-white px-2 py-0.5 rounded-full bg-blue-700 flex items-center">
                    {{capturedPages.length}}
                    <i class="fas" :class="showCapturedPagesDropdown ? 'fa-chevron-up ml-1 text-xs transition-transform duration-300' : 'fa-chevron-down ml-1 text-xs transition-transform duration-300'"></i>
                  </span>
                </div>
              </div>
              
              <!-- 下拉菜单内容 -->
              <transition name="dropdown">
                <div v-if="showCapturedPagesDropdown" class="captured-pages-dropdown mt-2 rounded-lg overflow-hidden">
                  <!-- 排序和筛选选项 -->
                  <div class="p-2 bg-gray-800/80 border-b border-gray-700 flex justify-between items-center">
                    <div class="flex items-center">
                      <span class="text-xs text-gray-300 mr-1.5">排序:</span>
                      <select v-model="pagesSortOrder" class="bg-gray-700 text-xs text-gray-200 px-1.5 py-0.5 rounded border-none outline-none">
                        <option value="newest">最新优先</option>
                        <option value="oldest">最早优先</option>
                        <option value="pageAsc">页码升序</option>
                        <option value="pageDesc">页码降序</option>
                      </select>
                    </div>
                    <div>
                      <button @click.stop="toggleOnlyRecognized" class="text-xs px-1.5 py-0.5 rounded" 
                        :class="showOnlyRecognized ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'">
                        <i class="fas fa-check-circle text-[10px] mr-0.5"></i>
                        仅已识别
                      </button>
                    </div>
                  </div>
                  
                  <div v-if="capturedPages.length === 0" class="text-center py-3 text-gray-400">
                    <i class="fas fa-info-circle mr-1"></i> 暂无已捕获页面
                  </div>
                  <div v-else class="max-h-[200px] overflow-y-auto">
                    <div v-for="(page, index) in filteredPages" :key="index" class="captured-page-item p-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-600/30 transition-colors duration-200 cursor-pointer">
                      <div class="flex items-start">
                        <!-- 页面缩略图 -->
                        <div class="page-thumbnail w-12 h-16 bg-gray-700 rounded-sm overflow-hidden mr-2 flex-shrink-0 relative" :data-page-id="page.id">
                          <div class="w-full h-full flex items-center justify-center flex-col">
                            <i class="fas fa-file-alt text-gray-500 mb-1"></i>
                            <div class="text-xs text-gray-300">第 {{page.pageNumber}} 页</div>
                          </div>
                          
                          <!-- 缩略图上的快速操作按钮 -->
                          <div class="thumbnail-actions opacity-0 absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                            <button @click.stop="jumpToPage(page)" class="thumbnail-action-btn bg-blue-600 hover:bg-blue-500 mb-1.5" title="跳转至该页">
                              <i class="fas fa-arrow-right text-[10px] mr-1"></i>
                              <span class="text-[10px]">跳转至该页</span>
                            </button>
                            <button @click.stop="rescanPage(page)" class="thumbnail-action-btn bg-green-600 hover:bg-green-500" title="重新扫描">
                              <i class="fas fa-sync-alt text-[10px] mr-1"></i>
                              <span class="text-[10px]">重新扫描</span>
                            </button>
                          </div>
                          
                          <!-- 重新扫描进度覆盖 -->
                          <div v-if="page.isRescanning" class="absolute inset-0 bg-black/75 flex flex-col items-center justify-center">
                            <div class="text-[10px] text-white mb-1">重新扫描中...</div>
                            <div class="w-3/4 h-1 bg-gray-700 rounded">
                              <div class="h-full bg-green-500 rounded" :style="{width: `${page.rescanProgress}%`}"></div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- 页面信息 -->
                        <div class="flex-grow">
                          <div class="text-xs font-medium text-blue-300 mb-0.5">第 {{page.pageNumber}} 页</div>
                          <div class="text-xs text-gray-300">{{formatTimestamp(page.capturedAt)}}</div>
                          <div class="flex items-center text-xs mt-1">
                            <span class="text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-400 mr-1">
                              <i class="fas fa-check-circle text-[10px] mr-0.5"></i>已识别
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-1.5 bg-gray-700 flex justify-between items-center">
                    <button class="text-xs text-blue-300 hover:text-blue-200 px-2 py-1 transition-colors">
                      <i class="fas fa-trash-alt mr-1"></i>清除
                    </button>
                    <button class="text-xs text-blue-300 hover:text-blue-200 px-2 py-1 transition-colors">
                      <i class="fas fa-external-link-alt mr-1"></i>全部查看
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        
        <!-- 分隔线 -->
        <div class="border-t border-gray-700 dark:border-gray-600 my-4"></div>
        
        <!-- 当前书籍信息 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold">当前书籍信息</h2>
          <div class="bg-gray-800 p-3 rounded-lg mb-3">
            <div class="flex items-start">
              <!-- 书籍封面 -->
              <div class="w-14 h-20 bg-gray-700 rounded-sm overflow-hidden mr-3 flex-shrink-0 flex items-center justify-center">
                <i class="fas fa-book text-blue-400 text-xl"></i>
              </div>
              <!-- 书籍详情 -->
              <div class="flex-grow">
                <div v-if="readingHistory.value && readingHistory.value.length > 0" class="text-blue-200 font-medium mb-1">{{readingHistory.value[0].title}}</div>
                <div v-else class="text-blue-200 font-medium mb-1">量子计算基础</div>
                
                <div v-if="readingHistory.value && readingHistory.value.length > 0" class="text-sm text-gray-400 mb-1">作者: {{readingHistory.value[0].author}}</div>
                <div v-else class="text-sm text-gray-400 mb-1">作者: Richard P. Feynman</div>
                
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-400">阅读进度:</span>
                  <div class="flex items-center">
                    <div class="w-20 h-1.5 bg-gray-700 rounded mr-2 overflow-hidden cursor-pointer group relative" 
                         @click="jumpToProgressPosition"
                         title="点击跳转至指定位置">
                      <div v-if="readingHistory.value && readingHistory.value.length > 0" 
                           class="h-full bg-blue-500 rounded" 
                           :style="{width: `${readingHistory.value[0].readingProgress}%`}"></div>
                      <div v-else class="h-full bg-blue-500 rounded" style="width: 25%"></div>
                      <div class="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 right-0 text-[10px] text-center bg-gray-800/90 py-0.5 px-1 rounded transition-opacity whitespace-nowrap">
                        点击跳转至指定位置
                      </div>
                    </div>
                    <span v-if="readingHistory.value && readingHistory.value.length > 0" class="text-gray-300">{{readingHistory.value[0].readingProgress}}%</span>
                    <span v-else class="text-gray-300">25%</span>
                  </div>
                </div>
                <div class="flex items-center text-xs text-gray-400 space-x-2">
                  <span v-if="readingHistory.value && readingHistory.value.length > 0" class="flex items-center">
                    <i class="fas fa-bookmark text-blue-500 mr-1"></i> 第{{readingHistory.value[0].currentPage}}/{{readingHistory.value[0].totalPages}}页
                    <button class="ml-1 text-amber-400 opacity-70 hover:opacity-100 transition-opacity" 
                            title="添加书签"
                            @click.stop="addBookmark">
                      <i class="fas fa-plus-circle text-[10px]"></i>
                    </button>
                  </span>
                  <span v-else class="flex items-center">
                    <i class="fas fa-bookmark text-blue-500 mr-1"></i> 第25/102页
                    <button class="ml-1 text-amber-400 opacity-70 hover:opacity-100 transition-opacity" 
                            title="添加书签"
                            @click.stop="addBookmark">
                      <i class="fas fa-plus-circle text-[10px]"></i>
                    </button>
                  </span>
                  
                  <span v-if="readingHistory.value && readingHistory.value.length > 0 && readingHistory.value[0].sessions && readingHistory.value[0].sessions.length > 0" class="flex items-center">
                    <i class="fas fa-clock text-green-500 mr-1"></i> 今日: {{readingHistory.value[0].sessions[0].duration}}分钟
                  </span>
                  <span v-else class="flex items-center">
                    <i class="fas fa-clock text-green-500 mr-1"></i> 今日: 30分钟
                  </span>
                </div>
              </div>
            </div>
            <!-- 章节信息 -->
            <div class="mt-3 pt-3 border-t border-gray-700">
              <div class="flex items-center justify-between text-sm mb-1">
                <div class="relative">
                  <div class="flex items-center cursor-pointer" @click="toggleChapterMenu">
                    <span class="text-gray-300">本章: <span class="text-blue-300">第一章 量子计算概述</span></span>
                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                  </div>
                  <div v-if="showChapterMenu" class="absolute left-0 top-full mt-1 bg-gray-800 rounded-md z-20 w-64 p-1 border border-gray-700 max-h-32 overflow-y-auto">
                    <div v-for="chapter in bookChapters" :key="chapter.id" 
                         class="p-1.5 hover:bg-gray-700 text-xs rounded cursor-pointer flex items-center"
                         @click="selectChapter(chapter)">
                      <i class="fas fa-file-alt text-blue-400 mr-1.5"></i>
                      <span>{{chapter.title}}</span>
                      <span v-if="chapter.id === 'chapter1'" class="ml-auto text-green-400 text-[9px]">当前</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center text-xs text-gray-400 justify-between">
                <span v-if="readingHistory.value && readingHistory.value.length > 0 && readingHistory.value[0].sessions">
                  阅读时长：{{readingHistory.value[0].sessions.reduce((sum, session) => sum + session.duration, 0)}}分钟
                </span>
                <span v-else>阅读时长：90分钟</span>
                <button class="text-blue-400 hover:text-blue-300 transition-colors">
                  <i class="fas fa-bookmark mr-1"></i>继续阅读
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 阅读历史 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-lg font-semibold">阅读历史</h2>
            <a href="#" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">查看全部</a>
          </div>
          
          <!-- 搜索和筛选栏 -->
          <div class="mb-3 bg-gray-800/80 rounded-lg p-2">
            <div class="flex items-center space-x-2 mb-2">
              <!-- 搜索框 -->
              <div class="flex-grow relative">
                <input 
                  type="text" 
                  v-model="historyFilter.searchTerm"
                  placeholder="搜索书籍或作者..." 
                  class="w-full bg-gray-700 text-gray-200 text-xs rounded-md py-1.5 px-2.5 pl-7 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                <i class="fas fa-search absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"></i>
                <!-- 清除按钮 -->
                <button 
                  v-if="historyFilter.searchTerm" 
                  @click="historyFilter.searchTerm = ''"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <i class="fas fa-times-circle text-xs"></i>
                </button>
              </div>
              
              <!-- 筛选按钮 -->
              <div class="relative">
                <button 
                  @click="showFilterDropdown = !showFilterDropdown"
                  class="bg-gray-700 text-gray-300 text-xs py-1.5 px-2.5 rounded-md flex items-center"
                >
                  <i class="fas fa-filter mr-1.5"></i>筛选
                  <i class="fas fa-chevron-down ml-1.5 text-[8px]"></i>
                </button>
                
                <!-- 筛选下拉菜单 -->
                <div v-if="showFilterDropdown" class="absolute right-0 top-full mt-1 bg-gray-800 rounded-md shadow-lg z-20 w-48 p-2 border border-gray-700">
                  <!-- 时间筛选 -->
                  <div class="mb-2">
                    <div class="text-xs text-gray-400 mb-1">时间范围</div>
                    <div class="grid grid-cols-2 gap-1">
                      <button 
                        v-for="option in [
                          {value: 'all', label: '全部'},
                          {value: 'today', label: '今天'}, 
                          {value: 'week', label: '本周'}, 
                          {value: 'month', label: '本月'}
                        ]" 
                        :key="option.value"
                        @click="historyFilter.timeRange = option.value"
                        class="text-[10px] py-1 px-1.5 rounded-sm"
                        :class="historyFilter.timeRange === option.value ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                      >
                        {{option.label}}
                      </button>
                    </div>
                  </div>
                  
                  <!-- 排序选项 -->
                  <div>
                    <div class="text-xs text-gray-400 mb-1">排序方式</div>
                    <div class="space-y-1">
                      <button 
                        v-for="option in [
                          {value: 'recent', label: '最近阅读'}, 
                          {value: 'progress', label: '阅读进度'}, 
                          {value: 'duration', label: '阅读时长'}, 
                          {value: 'engagement', label: '互动频率'}
                        ]" 
                        :key="option.value"
                        @click="historyFilter.sortBy = option.value"
                        class="w-full text-left text-[10px] py-1 px-1.5 rounded-sm flex items-center justify-between"
                        :class="historyFilter.sortBy === option.value ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                      >
                        <span>{{option.label}}</span>
                        <i v-if="historyFilter.sortBy === option.value" class="fas fa-check text-[8px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 书籍列表 - 按书籍分组 -->
          <div class="space-y-2">
            <div 
              v-for="book in filteredReadingHistory" 
              :key="book.id" 
              class="bg-gray-800/60 rounded-lg overflow-hidden"
            >
              <!-- 书籍标题栏 - 可点击展开/折叠 -->
              <div 
                @click="toggleBookHistory(book.id)"
                class="p-2.5 flex items-center cursor-pointer hover:bg-gray-700/40 transition-colors duration-200 group"
              >
                <!-- 书籍封面 -->
                <div class="w-10 h-14 bg-gray-700 rounded-sm overflow-hidden mr-2.5 flex-shrink-0 flex items-center justify-center">
                  <i class="fas fa-book text-blue-400"></i>
                </div>
                
                <!-- 书籍信息 -->
                <div class="flex-grow">
                  <div class="flex items-center justify-between mb-1">
                    <div class="text-sm font-medium text-blue-200 truncate mr-2">{{book.title}}</div>
                    <div class="flex items-center">
                      <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                        <button title="继续阅读" 
                                class="p-0.5 text-blue-400 hover:text-blue-300 transition-colors"
                                @click.stop="continueReading(book)">
                          <i class="fas fa-book-reader text-[10px]"></i>
                        </button>
                        <button title="收藏" 
                                class="p-0.5 text-yellow-400 hover:text-yellow-300 transition-colors"
                                @click.stop="toggleFavorite(book)">
                          <i class="fas fa-star text-[10px]"></i>
                        </button>
                        <button title="删除" 
                                class="p-0.5 text-red-400 hover:text-red-300 transition-colors"
                                @click.stop="removeFromHistory(book)">
                          <i class="fas fa-trash-alt text-[10px]"></i>
                        </button>
                      </div>
                      <div class="text-xs text-gray-400">{{formatRelativeTime(book.lastReadTime)}}</div>
                    </div>
                  </div>
                  
                  <!-- 进度条 -->
                  <div class="flex items-center text-xs">
                    <div class="w-full h-1.5 bg-gray-700 rounded mr-2 overflow-hidden flex-grow">
                      <div 
                        class="h-full rounded" 
                        :style="{width: `${book.readingProgress}%`}"
                        :class="{
                          'bg-red-500': book.readingProgress <= 25,
                          'bg-yellow-500': book.readingProgress > 25 && book.readingProgress <= 50,
                          'bg-blue-500': book.readingProgress > 50 && book.readingProgress <= 75,
                          'bg-green-500': book.readingProgress > 75
                        }"
                      ></div>
                    </div>
                    <span class="text-gray-300 whitespace-nowrap">阅读至 {{book.readingProgress}}%</span>
                    
                    <!-- 展开/折叠图标 -->
                    <i 
                      class="fas ml-2" 
                      :class="expandedBookId === book.id ? 'fa-chevron-up text-blue-400' : 'fa-chevron-down text-gray-500'"
                    ></i>
                  </div>
                </div>
              </div>
              
              <!-- 阅读会话记录 - 展开后显示 -->
              <div 
                v-if="expandedBookId === book.id"
                class="bg-gray-700/30 px-2.5 py-2 border-t border-gray-700"
              >
                <!-- 会话记录标题 -->
                <div class="flex items-center justify-between mb-2">
                  <div class="text-xs text-gray-300">阅读会话记录</div>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/70 text-blue-300">
                    共 {{book.sessions ? book.sessions.length : 0}} 次
                  </span>
                </div>
                
                <!-- 会话列表 -->
                <div class="space-y-2" v-if="book.sessions && book.sessions.length > 0">
                  <div 
                    v-for="(session, index) in book.sessions" 
                    :key="session.id" 
                    class="text-xs p-1.5 bg-gray-800/60 rounded"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-gray-300">第 {{index + 1}} 次阅读</span>
                      <span class="text-gray-400">{{formatRelativeTime(session.startTime)}}</span>
                    </div>
                    <div class="flex items-center space-x-3 text-[10px] text-gray-400">
                      <span><i class="far fa-clock mr-1 text-green-400"></i>{{session.duration}}分钟</span>
                      <span><i class="far fa-file-alt mr-1 text-blue-400"></i>{{session.pagesRead ? session.pagesRead.length : 0}}页</span>
                      <span><i class="far fa-sticky-note mr-1 text-amber-400"></i>{{session.notes}}笔记</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-xs text-gray-400 text-center py-2">
                  暂无阅读会话记录
                </div>
                
                <!-- 阅读统计 -->
                <div class="mt-2 pt-2 border-t border-gray-700/50 flex items-center justify-between text-[10px] text-gray-400">
                  <span v-if="book.sessions && book.sessions.length > 0">
                    <i class="fas fa-chart-line mr-1 text-purple-400"></i>总计: {{book.sessions.reduce((sum, s) => sum + s.duration, 0)}}分钟
                  </span>
                  <span v-else>
                    <i class="fas fa-chart-line mr-1 text-purple-400"></i>总计: 0分钟
                  </span>
                  <button class="text-blue-400 hover:text-blue-300 transition-colors">
                    <i class="fas fa-external-link-alt mr-1"></i>跳转阅读
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 没有历史记录时的提示 -->
          <div v-if="filteredReadingHistory.length === 0" class="py-8 text-center text-gray-400">
            <i class="fas fa-search mb-2 text-xl"></i>
            <p class="text-sm">未找到匹配的阅读记录</p>
          </div>
        </div>
        
        <!-- 我的笔记 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">我的笔记</h2>
            <a href="#" class="text-xs text-blue-400">管理</a>
          </div>
          <div class="space-y-3">
            <div class="p-3 bg-amber-900/50 border-l-2 border-amber-500 rounded-r-lg">
              <p class="text-sm text-amber-200">关于量子叠加态</p>
              <p class="text-xs text-amber-400/80">量子比特可以同时处于多个状态，这与经典比特只能是0或1不同...</p>
              <div class="text-xs text-gray-500 mt-1">页码: 42</div>
            </div>
            <div class="p-3 bg-amber-900/50 border-l-2 border-amber-500 rounded-r-lg">
              <p class="text-sm text-amber-200">量子计算优势</p>
              <p class="text-xs text-amber-400/80">量子计算机由于叠加态原理，可以同时处理2^n个状态...</p>
              <div class="text-xs text-gray-500 mt-1">页码: 43</div>
            </div>
          </div>
        </div>
        
        <!-- 个性化学习状态 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">个性化学习状态</h2>
            <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center" @click="showLearningStatistics = !showLearningStatistics">
              <i class="fas" :class="showLearningStatistics ? 'fa-chart-bar' : 'fa-chart-line'"></i>
              <span class="ml-1">{{showLearningStatistics ? '隐藏统计' : '查看统计'}}</span>
            </button>
          </div>
          
          <!-- 阅读专注度指标 -->
          <div class="bg-gray-800/70 p-3 rounded-lg mb-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-blue-300 font-medium">阅读专注度</div>
              <div class="flex items-center">
                <span class="text-sm text-white font-medium mr-1">{{learningState && learningState.focusScore ? learningState.focusScore.today : 85}}%</span>
                <i 
                  class="fas text-xs" 
                  :class="{
                    'fa-arrow-up text-green-500': learningState && learningState.focusScore && learningState.focusScore.trend === 'up',
                    'fa-arrow-down text-red-500': learningState && learningState.focusScore && learningState.focusScore.trend === 'down',
                    'fa-arrow-up text-green-500': !learningState || !learningState.focusScore
                  }"
                ></i>
              </div>
            </div>
            
            <!-- 专注度进度条 -->
            <div class="w-full h-2 bg-gray-700 rounded-full mb-2.5 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-500 ease-out" 
                :style="{width: `${learningState && learningState.focusScore ? learningState.focusScore.today : 85}%`}"
                :class="{
                  'bg-red-500': learningState && learningState.focusScore && learningState.focusScore.today < 30,
                  'bg-yellow-500': learningState && learningState.focusScore && learningState.focusScore.today >= 30 && learningState.focusScore.today < 70,
                  'bg-green-500': !learningState || !learningState.focusScore || learningState.focusScore.today >= 70
                }"
              ></div>
            </div>
            
            <!-- 专注时间统计 -->
            <div class="flex items-center justify-between text-xs">
              <div class="text-gray-400">
                <span class="text-green-400 font-medium">{{learningState && learningState.focusScore ? learningState.focusScore.continuousFocusTime : 28}}</span> 分钟连续专注
              </div>
              <div class="text-gray-400">
                最佳记录: <span class="text-blue-400 font-medium">{{learningState && learningState.focusScore ? learningState.focusScore.bestRecord : 45}}</span> 分钟
              </div>
            </div>
          </div>
          
          <!-- 概念掌握情况 -->
          <div class="bg-gray-800/70 p-3 rounded-lg mb-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-blue-300 font-medium flex items-center">
                <i class="fas fa-brain text-purple-400 mr-1.5"></i>概念掌握情况
              </div>
              <div class="text-xs text-gray-400">《{{learningState && learningState.currentBook ? learningState.currentBook.title : '量子计算基础'}}》</div>
            </div>
            
            <!-- 概念列表 -->
            <div class="space-y-2">
              <div 
                v-for="concept in (learningState && learningState.currentBook && learningState.currentBook.conceptsMastery) ? 
                  learningState.currentBook.conceptsMastery : 
                  [
                    {id: 'concept1', name: '量子比特', masteryLevel: 90, status: '精通'},
                    {id: 'concept2', name: '量子叠加', masteryLevel: 75, status: '熟悉'},
                    {id: 'concept3', name: '量子纠缠', masteryLevel: 35, status: '入门'},
                    {id: 'concept4', name: '量子算法', masteryLevel: 10, status: '待学习'}
                  ]" 
                :key="concept.id"
                class="concept-item flex items-center p-1 rounded-sm hover:bg-gray-700/30 transition-colors duration-150 cursor-pointer group"
                @click="viewConceptDetails(concept)"
              >
                <div class="w-32 truncate text-xs text-gray-300">{{concept.name}}</div>
                <div class="flex-grow mx-2 relative">
                  <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-300" 
                      :style="{width: `${concept.masteryLevel}%`}"
                      :class="{
                        'bg-red-500': concept.masteryLevel < 30,
                        'bg-yellow-500': concept.masteryLevel >= 30 && concept.masteryLevel < 70,
                        'bg-green-500': concept.masteryLevel >= 70
                      }"
                    ></div>
                  </div>
                  <!-- 悬停提示 -->
                  <div class="opacity-0 group-hover:opacity-100 absolute -top-7 left-0 right-0 text-[10px] text-center bg-gray-800/90 py-0.5 px-1 rounded transition-opacity whitespace-nowrap">
                    点击查看"{{concept.name}}"的详细掌握情况
                  </div>
                </div>
                <div class="text-xs w-14 text-right flex items-center justify-end" :class="{
                  'text-red-400': concept.masteryLevel < 30,
                  'text-yellow-400': concept.masteryLevel >= 30 && concept.masteryLevel < 70,
                  'text-green-400': concept.masteryLevel >= 70
                }">
                  <span>{{concept.status}}</span>
                  <i class="fas fa-chevron-right ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[8px]"></i>
                </div>
              </div>
            </div>
            
            <!-- 查看完整知识图谱按钮 -->
            <div class="mt-3 flex justify-between items-center">
              <button class="text-xs bg-blue-900/50 text-blue-400 px-2.5 py-1 rounded hover:bg-blue-800/50 transition-colors">
                <i class="fas fa-sitemap mr-1"></i>查看完整知识图谱
              </button>
              <button class="text-xs bg-green-900/50 text-green-400 px-2.5 py-1 rounded hover:bg-green-800/50 transition-colors">
                <i class="fas fa-tasks mr-1"></i>推荐练习
              </button>
            </div>
          </div>
          
          <!-- 学习目标 -->
          <div class="bg-gray-800/70 p-3 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-blue-300 font-medium flex items-center">
                <i class="fas fa-bullseye text-red-400 mr-1.5"></i>学习目标
              </div>
              <button class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      @click="showGoalSettings = !showGoalSettings">
                <i class="fas fa-pencil-alt mr-1"></i>设置目标
              </button>
            </div>
            
            <!-- 目标设置面板 -->
            <transition name="slide-fade">
              <div v-if="showGoalSettings" class="mb-3 bg-blue-900/20 p-2 rounded border border-blue-900/50">
                <div class="text-xs text-blue-300 mb-2">调整学习目标</div>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <label class="text-xs text-gray-400 w-1/3">每日阅读时间:</label>
                    <div class="flex items-center">
                      <button @click="adjustGoal('dailyReadingTime', -5)" class="text-xs bg-gray-700 hover:bg-gray-600 w-5 h-5 rounded-l flex items-center justify-center">-</button>
                      <div class="bg-gray-800 text-xs text-white px-2 py-1 w-12 text-center">{{learningState && learningState.learningGoals ? learningState.learningGoals.dailyReadingTime : 60}}分钟</div>
                      <button @click="adjustGoal('dailyReadingTime', 5)" class="text-xs bg-gray-700 hover:bg-gray-600 w-5 h-5 rounded-r flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <label class="text-xs text-gray-400 w-1/3">每周阅读页数:</label>
                    <div class="flex items-center">
                      <button @click="adjustGoal('weeklyPages', -5)" class="text-xs bg-gray-700 hover:bg-gray-600 w-5 h-5 rounded-l flex items-center justify-center">-</button>
                      <div class="bg-gray-800 text-xs text-white px-2 py-1 w-12 text-center">{{learningState && learningState.learningGoals ? learningState.learningGoals.weeklyPages : 70}}页</div>
                      <button @click="adjustGoal('weeklyPages', 5)" class="text-xs bg-gray-700 hover:bg-gray-600 w-5 h-5 rounded-r flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end mt-2">
                  <button @click="showGoalSettings = false" class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-center transition-colors">
                    保存设置
                  </button>
                </div>
              </div>
            </transition>
            
            <!-- 目标列表 -->
            <div class="space-y-2">
              <!-- 每日阅读时间 -->
              <div class="goal-item">
                <div class="flex items-center justify-between mb-1">
                  <div class="text-xs text-gray-300">每日阅读时间</div>
                  <div class="text-xs text-gray-400">{{learningState && learningState.learningGoals ? learningState.learningGoals.dailyReadingTime : 60}}分钟/天</div>
                </div>
                <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden relative group">
                  <div class="h-full bg-blue-500 rounded-full" style="width: 70%"></div>
                  <div class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <div class="h-full w-px bg-white absolute" style="left: 40%"></div>
                    <div class="absolute -top-4 text-[9px] text-white bg-gray-800 rounded px-1 py-0.5" style="left: 40%; transform: translateX(-50%)">
                      今日: 40分钟
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 每周阅读页数 -->
              <div class="goal-item">
                <div class="flex items-center justify-between mb-1">
                  <div class="text-xs text-gray-300">每周阅读页数</div>
                  <div class="text-xs text-gray-400">{{learningState && learningState.learningGoals ? learningState.learningGoals.weeklyPages : 70}}页/周</div>
                </div>
                <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden relative group">
                  <div class="h-full bg-green-500 rounded-full" style="width: 60%"></div>
                  <div class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <div class="h-full w-px bg-white absolute" style="left: 60%"></div>
                    <div class="absolute -top-4 text-[9px] text-white bg-gray-800 rounded px-1 py-0.5" style="left: 60%; transform: translateX(-50%)">
                      本周: 42页
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 进度预测 -->
              <div class="bg-blue-900/20 text-xs text-blue-300 p-2 rounded mt-2 border border-blue-900/50">
                <div class="flex items-center">
                  <i class="fas fa-calendar-alt mr-1.5"></i>
                  <span>按当前速度，将在 12 天内完成本书</span>
                </div>
                <div class="text-xs text-gray-400 mt-1 ml-5">提示: 每天增加5分钟可提前3天完成</div>
              </div>
            </div>
            
            <!-- 成就系统 -->
            <div class="mt-3 pt-3 border-t border-gray-700">
              <div class="text-xs text-gray-400 mb-2">最近成就</div>
              <div class="flex items-center space-x-2">
                <div 
                  v-for="achievement in (learningState && learningState.achievements) ? 
                    learningState.achievements.filter(a => a.earned).slice(0, 2) :
                    [{id: 'achievement1', name: '连续学习5天', earned: true}, {id: 'achievement2', name: '单次专注超过30分钟', earned: true}]" 
                  :key="achievement.id"
                  class="achievement-badge group relative px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full text-[10px] flex items-center"
                >
                  <i class="fas fa-award text-yellow-400 mr-1"></i>
                  <span>{{achievement.name}}</span>
                  <button 
                    class="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" 
                    title="分享成就"
                    @click.stop="shareAchievement(achievement)">
                    <i class="fas fa-share-alt text-[8px]"></i>
                  </button>
                </div>
              </div>
              
              <!-- 成就达成动画 -->
              <transition name="achievement-animation">
                <div v-if="showAchievementAnimation" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                  <div class="bg-gray-900 border-2 border-yellow-500 p-5 rounded-lg text-center transform scale-105 achievement-pulse">
                    <i class="fas fa-trophy text-yellow-400 text-3xl mb-2"></i>
                    <div class="text-white font-semibold mb-1">恭喜达成目标!</div>
                    <div class="text-gray-300 text-sm">{{currentAchievement}}</div>
                    <button @click="showAchievementAnimation = false" class="mt-3 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded transition-colors">
                      确定
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          
          <!-- 学习统计展开区域 -->
          <transition name="slide-fade">
            <div v-if="showLearningStatistics" class="mt-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <div class="text-xs text-gray-300 mb-2">学习数据统计</div>
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-gray-800 p-2 rounded">
                  <div class="text-[10px] text-gray-400 mb-1">本周阅读时长</div>
                  <div class="text-sm text-blue-300 font-medium">3.5 小时</div>
                </div>
                <div class="bg-gray-800 p-2 rounded">
                  <div class="text-[10px] text-gray-400 mb-1">本周阅读页数</div>
                  <div class="text-sm text-blue-300 font-medium">42 页</div>
                </div>
                <div class="bg-gray-800 p-2 rounded">
                  <div class="text-[10px] text-gray-400 mb-1">平均专注度</div>
                  <div class="text-sm text-blue-300 font-medium">76%</div>
                </div>
                <div class="bg-gray-800 p-2 rounded">
                  <div class="text-[10px] text-gray-400 mb-1">学习效率提升</div>
                  <div class="text-sm text-green-400 font-medium">+15%</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        
        <!-- 折叠状态下显示的图标 -->
        <div class="sidebar-icons">
          <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer" title="拍照">
            <i class="fas fa-camera text-indigo-500"></i>
          </div>
          <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer" title="屏幕">
            <i class="fas fa-desktop text-indigo-500"></i>
          </div>
          <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer" title="AI处理">
            <i class="fas fa-robot text-indigo-500"></i>
          </div>
          <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer" title="文档">
            <i class="fas fa-file-alt text-indigo-500"></i>
          </div>
          <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer" title="历史">
            <i class="fas fa-history text-indigo-500"></i>
          </div>
          <div class="sidebar-icon w-8 h-8 flex items-center justify-center cursor-pointer" title="保存">
            <i class="far fa-save text-indigo-500"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';

// 注入侧边栏状态
const isSidebarCollapsed = inject('sidebarState');

// 本地状态
const isCollapsed = ref(false);
const showCapturedPagesDropdown = ref(false);
const isAIProcessing = ref(false);
const aiProcessProgress = ref(0);
const aiProcessingText = ref('准备分析页面内容...');
const pagesSortOrder = ref('newest');
const showOnlyRecognized = ref(false);
const showFilterDropdown = ref(false);
const showLearningStatistics = ref(false);
const showChapterMenu = ref(false);
const bookChapters = ref([
  { id: 'chapter1', title: '第一章 量子计算概述', page: 1 },
  { id: 'chapter2', title: '第二章 量子比特和量子门', page: 15 },
  { id: 'chapter3', title: '第三章 量子算法基础', page: 32 },
  { id: 'chapter4', title: '第四章 量子编程', page: 47 },
  { id: 'chapter5', title: '第五章 量子优势案例', page: 68 },
]);

// 系统状态总结
const systemStatus = ref('normal'); // 可能的值: normal, warning, error
const systemStatusMessage = computed(() => {
  if (systemStatus.value === 'normal') return '系统正常运行中';
  if (systemStatus.value === 'warning') return '注意：光线变暗';
  if (systemStatus.value === 'error') return '错误：无法检测书本';
});

const systemStatusClass = computed(() => {
  if (systemStatus.value === 'normal') return 'bg-green-900/30 text-green-400';
  if (systemStatus.value === 'warning') return 'bg-yellow-900/30 text-yellow-400';
  if (systemStatus.value === 'error') return 'bg-red-900/30 text-red-400';
});

const systemStatusIcon = computed(() => {
  if (systemStatus.value === 'normal') return 'fa-check-circle';
  if (systemStatus.value === 'warning') return 'fa-exclamation-triangle';
  if (systemStatus.value === 'error') return 'fa-times-circle';
});

// 模拟捕获的页面数据
const capturedPages = ref([
  {
    id: 1,
    pageNumber: 42,
    capturedAt: new Date().getTime() - 300000, // 5分钟前
    thumbnail: '', // 不再使用外部图片URL
    status: 'recognized',
    isRescanning: false,
    rescanProgress: 0,
    lastUpdatedAt: new Date().getTime() - 300000
  },
  {
    id: 2,
    pageNumber: 43,
    capturedAt: new Date().getTime() - 180000, // 3分钟前
    thumbnail: '', // 不再使用外部图片URL
    status: 'recognized',
    isRescanning: false,
    rescanProgress: 0,
    lastUpdatedAt: new Date().getTime() - 180000
  }
]);

// 模拟阅读历史数据 - 按照优化建议进行结构化
const defaultReadingHistory = [
  {
    id: "default_book1",
    title: "量子计算基础",
    author: "Richard P. Feynman",
    coverImage: "", 
    lastReadTime: new Date().getTime() - 3600000, // 1小时前
    readingProgress: 25,
    totalPages: 102,
    currentPage: 25,
    sessions: [
      {
        id: "session1",
        startTime: new Date().getTime() - 5400000, // 1.5小时前
        endTime: new Date().getTime() - 3600000, // 1小时前
        duration: 30,
        pagesRead: [23, 24, 25],
        notes: 2
      }
    ]
  },
  {
    id: "default_book2",
    title: "现代计算机历史",
    author: "John Hennessy",
    coverImage: "",
    lastReadTime: new Date().getTime() - 86400000, // 昨天
    readingProgress: 43,
    totalPages: 230,
    currentPage: 99,
    sessions: [
      {
        id: "session3",
        startTime: new Date().getTime() - 86400000 - 7200000, // 昨天
        endTime: new Date().getTime() - 86400000 - 5400000, // 昨天
        duration: 45,
        pagesRead: [95, 96, 97, 98, 99],
        notes: 3
      }
    ]
  },
  {
    id: "default_book3",
    title: "机器学习入门",
    author: "Andrew Ng",
    coverImage: "",
    lastReadTime: new Date().getTime() - 259200000, // 3天前
    readingProgress: 78,
    totalPages: 180,
    currentPage: 140,
    sessions: [
      {
        id: "session4",
        startTime: new Date().getTime() - 259200000 - 7200000, // 3天前
        endTime: new Date().getTime() - 259200000 - 5400000, // 3天前
        duration: 50,
        pagesRead: [135, 136, 137, 138, 139, 140],
        notes: 2
      }
    ]
  }
];

const readingHistory = ref(defaultReadingHistory);

// 模拟学习状态数据
const learningState = ref({
  focusScore: {
    today: 85,
    trend: 'up', // 'up' 或 'down'
    continuousFocusTime: 28, // 分钟
    bestRecord: 45 // 分钟
  },
  currentBook: {
    id: "book1",
    title: "量子计算基础",
    conceptsMastery: [
      {id: "concept1", name: "量子比特", masteryLevel: 90, status: "精通"},
      {id: "concept2", name: "量子叠加", masteryLevel: 75, status: "熟悉"},
      {id: "concept3", name: "量子纠缠", masteryLevel: 35, status: "入门"},
      {id: "concept4", name: "量子算法", masteryLevel: 10, status: "待学习"}
    ]
  },
  learningGoals: {
    dailyReadingTime: 60, // 每日目标阅读时间（分钟）
    weeklyPages: 70, // 每周目标页数
    completionDate: new Date().getTime() + 1209600000, // 计划完成日期（两周后）
    progress: 40 // 目标完成进度百分比
  },
  achievements: [
    {id: "achievement1", name: "连续学习5天", earned: true, date: new Date().getTime() - 172800000},
    {id: "achievement2", name: "单次专注超过30分钟", earned: true, date: new Date().getTime() - 86400000},
    {id: "achievement3", name: "掌握3个核心概念", earned: false}
  ]
});

// 阅读历史筛选和排序状态
const historyFilter = ref({
  searchTerm: '',
  timeRange: 'all', // 'today', 'week', 'month', 'all'
  type: 'all', // 'book', 'paper', 'note', 'all'
  status: 'all', // 'completed', 'in-progress', 'not-started', 'all'
  sortBy: 'recent' // 'recent', 'duration', 'progress', 'engagement'
});

// 当前选中的书籍（用于展开/折叠历史记录）
const expandedBookId = ref(null);

// 过滤和排序后的阅读历史
const filteredReadingHistory = computed(() => {
  // 检查readingHistory是否存在
  if (!readingHistory.value || readingHistory.value.length === 0) {
    return defaultReadingHistory;
  }
  
  let result = readingHistory.value;
  
  // 搜索过滤
  if (historyFilter.value.searchTerm) {
    const term = historyFilter.value.searchTerm.toLowerCase();
    result = result.filter(book => 
      book.title.toLowerCase().includes(term) || 
      book.author.toLowerCase().includes(term)
    );
  }
  
  // 时间范围过滤
  if (historyFilter.value.timeRange !== 'all') {
    const now = new Date().getTime();
    let timeLimit;
    
    switch (historyFilter.value.timeRange) {
      case 'today':
        timeLimit = now - 86400000; // 24小时内
        break;
      case 'week':
        timeLimit = now - 604800000; // 7天内
        break;
      case 'month':
        timeLimit = now - 2592000000; // 30天内
        break;
    }
    
    result = result.filter(book => book.lastReadTime >= timeLimit);
  }
  
  // 排序
  return result.slice().sort((a, b) => {
    switch (historyFilter.value.sortBy) {
      case 'recent':
        return b.lastReadTime - a.lastReadTime;
      case 'progress':
        return b.readingProgress - a.readingProgress;
      case 'duration':
        const aDuration = a.sessions ? a.sessions.reduce((sum, session) => sum + session.duration, 0) : 0;
        const bDuration = b.sessions ? b.sessions.reduce((sum, session) => sum + session.duration, 0) : 0;
        return bDuration - aDuration;
      case 'engagement':
        const aEngagement = a.sessions ? a.sessions.reduce((sum, session) => sum + session.notes, 0) : 0;
        const bEngagement = b.sessions ? b.sessions.reduce((sum, session) => sum + session.notes, 0) : 0;
        return bEngagement - aEngagement;
      default:
        return b.lastReadTime - a.lastReadTime;
    }
  });
});

// 格式化相对时间（例如：今天、昨天、3天前）
function formatRelativeTime(timestamp) {
  if (!timestamp) return '未知';
  
  const now = new Date().getTime();
  const diff = now - timestamp;
  
  // 小于24小时
  if (diff < 86400000) {
    return '今天';
  }
  
  // 小于48小时
  if (diff < 172800000) {
    return '昨天';
  }
  
  // 其他情况
  return `${Math.floor(diff / 86400000)}天前`;
}

// 当前选中的页面（用于中间阅读区模拟）
const currentPage = ref(null);

// 过滤和排序后的页面列表
const filteredPages = computed(() => {
  // 先过滤
  let result = capturedPages.value;
  if (showOnlyRecognized.value) {
    result = result.filter(page => page.status === 'recognized');
  }
  
  // 再排序
  return result.slice().sort((a, b) => {
    if (pagesSortOrder.value === 'newest') {
      return b.capturedAt - a.capturedAt;
    } else if (pagesSortOrder.value === 'oldest') {
      return a.capturedAt - b.capturedAt;
    } else if (pagesSortOrder.value === 'pageAsc') {
      return a.pageNumber - b.pageNumber;
    } else if (pagesSortOrder.value === 'pageDesc') {
      return b.pageNumber - a.pageNumber;
    }
    return 0;
  });
});

// 格式化时间戳为友好显示
function formatTimestamp(timestamp) {
  const now = new Date().getTime();
  const diff = now - timestamp;
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  }
  
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  }
  
  // 其他情况显示日期
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// 切换侧边栏折叠状态
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  
  // 更新共享状态
  isSidebarCollapsed.value = isCollapsed.value;
  
  // 触发调整面板宽度的事件（在主组件中实现）
  const event = new CustomEvent('adjust-panel-widths');
  window.dispatchEvent(event);
}

// 切换已捕获页面下拉列表显示/隐藏
function toggleCapturedPagesDropdown() {
  showCapturedPagesDropdown.value = !showCapturedPagesDropdown.value;
}

// 切换仅显示已识别的页面
function toggleOnlyRecognized(event) {
  event.preventDefault();
  event.stopPropagation();
  showOnlyRecognized.value = !showOnlyRecognized.value;
}

// 跳转至指定页面
function jumpToPage(page) {
  // 显示加载状态 - 这里可以添加通知其他组件的逻辑
  currentPage.value = page;
  
  // 模拟页面跳转成功通知
  const event = new CustomEvent('jump-to-page', { 
    detail: { 
      pageNumber: page.pageNumber,
      pageId: page.id
    } 
  });
  window.dispatchEvent(event);
  
  // 关闭下拉菜单
  showCapturedPagesDropdown.value = false;
  
  // 模拟页面加载完成的视觉反馈
  setTimeout(() => {
    // 这里可以添加页面加载完成后的操作
    // 比如通知中间阅读区高亮页码等
    console.log(`已跳转至第 ${page.pageNumber} 页`);
    
    // 触发系统状态更新
    systemStatus.value = 'normal';
  }, 500);
}

// 重新扫描指定页面
function rescanPage(page) {
  // 防止重复操作
  if (page.isRescanning) return;
  
  // 设置重新扫描状态
  page.isRescanning = true;
  page.rescanProgress = 0;
  
  // 更新系统状态
  systemStatus.value = 'warning';
  
  // 模拟扫描进度
  const scanInterval = setInterval(() => {
    if (page.rescanProgress >= 100) {
      clearInterval(scanInterval);
      
      // 扫描完成后更新状态
      setTimeout(() => {
        page.isRescanning = false;
        page.lastUpdatedAt = new Date().getTime();
        
        // 只更新时间戳，不再更换图片URL
        
        // 提示用户扫描完成
        const successNotice = document.createElement('div');
        successNotice.className = 'scan-success-notice';
        const thumbnail = document.querySelector(`.page-thumbnail[data-page-id="${page.id}"]`);
        if (thumbnail) {
          thumbnail.appendChild(successNotice);
          setTimeout(() => {
            thumbnail.removeChild(successNotice);
          }, 2000);
        }
        
        // 恢复系统状态
        systemStatus.value = 'normal';
        systemStatusMessage.value = '系统正常运行中';
        
        console.log(`第 ${page.pageNumber} 页重新扫描完成`);
      }, 500);
      
      return;
    }
    
    // 更新进度
    page.rescanProgress += 5;
    
    // 更新系统状态消息
    if (page.rescanProgress < 30) {
      aiProcessingText.value = '准备重新扫描...';
    } else if (page.rescanProgress < 60) {
      aiProcessingText.value = '增强图像质量...';
    } else {
      aiProcessingText.value = '优化文本识别...';
    }
  }, 100);
}

// 模拟AI处理状态变化
function simulateAIProcessing() {
  if (isAIProcessing.value) return;
  
  isAIProcessing.value = true;
  aiProcessProgress.value = 0;
  
  const processSteps = [
    '准备分析页面内容...',
    '识别文本和图像...',
    '提取关键概念...',
    '建立语义理解...',
    '完成分析'
  ];
  
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (aiProcessProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        isAIProcessing.value = false;
      }, 1000);
      return;
    }
    
    aiProcessProgress.value += 5;
    
    // 更新处理步骤文本
    if (aiProcessProgress.value >= currentStep * 25 && currentStep < processSteps.length) {
      aiProcessingText.value = processSteps[currentStep];
      currentStep++;
    }
  }, 200);
}

// 切换书籍历史记录展开/折叠状态
function toggleBookHistory(bookId) {
  if (expandedBookId.value === bookId) {
    expandedBookId.value = null;
  } else {
    expandedBookId.value = bookId;
  }
}

// 跳转至进度位置
function jumpToProgressPosition() {
  console.log('跳转至进度位置');
}

// 切换章节菜单显示/隐藏
function toggleChapterMenu() {
  showChapterMenu.value = !showChapterMenu.value;
}

// 选择章节
function selectChapter(chapter) {
  console.log(`选择章节: ${chapter.title}, 页码: ${chapter.page}`);
  showChapterMenu.value = false;
}

// 添加书签
function addBookmark() {
  console.log('添加书签');
}

// 继续阅读指定书籍
function continueReading(book) {
  console.log(`继续阅读: ${book.title}`);
}

// 切换收藏状态
function toggleFavorite(book) {
  console.log(`切换收藏状态: ${book.title}`);
}

// 从历史记录中删除
function removeFromHistory(book) {
  console.log(`从历史记录中删除: ${book.title}`);
}

// 查看概念详情
function viewConceptDetails(concept) {
  console.log(`查看概念详情: ${concept.name}, 掌握度: ${concept.masteryLevel}%`);
}

// 添加新的响应变量
const showGoalSettings = ref(false);
const showAchievementAnimation = ref(false);
const currentAchievement = ref('完成今日阅读目标');

// 调整学习目标
function adjustGoal(goalType, amount) {
  if (!learningState.value || !learningState.learningGoals) return;
  
  if (goalType === 'dailyReadingTime') {
    learningState.learningGoals.dailyReadingTime += amount;
    // 确保不小于5分钟
    if (learningState.learningGoals.dailyReadingTime < 5) {
      learningState.learningGoals.dailyReadingTime = 5;
    }
  } else if (goalType === 'weeklyPages') {
    learningState.learningGoals.weeklyPages += amount;
    // 确保不小于5页
    if (learningState.learningGoals.weeklyPages < 5) {
      learningState.learningGoals.weeklyPages = 5;
    }
  }
}

// 分享成就
function shareAchievement(achievement) {
  console.log(`分享成就: ${achievement.name}`);
  
  // 模拟成就动画展示
  currentAchievement.value = achievement.name;
  showAchievementAnimation.value = true;
  
  // 3秒后自动关闭
  setTimeout(() => {
    showAchievementAnimation.value = false;
  }, 3000);
}

onMounted(() => {
  // 初始状态同步
  isCollapsed.value = isSidebarCollapsed.value;
  
  // 为了演示效果，设置定时模拟AI处理
  setTimeout(() => {
    simulateAIProcessing();
  }, 2000);
});
</script>

<style scoped>
.sidebar-transition {
  transition: width 0.3s ease-in-out;
}

.sidebar-toggle-wrapper {
  z-index: 30;
}

.sidebar-toggle {
  width: 24px;
  height: 24px;
  background-color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  background-color: #6366f1;
}

.sidebar-collapsed .normal-content {
  display: none;
}

.sidebar-icons {
  display: none;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  height: 100%;
}

.sidebar-collapsed .sidebar-icons {
  display: flex;
}

.sidebar-icon {
  margin-bottom: 1rem;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  border-radius: 9999px;
}

.sidebar-icon:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.1);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.processing-animation {
  animation: processingPulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

@keyframes processingPulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

.thumbnail-actions {
  transition: opacity 0.2s ease-in-out;
}

.page-thumbnail:hover .thumbnail-actions {
  opacity: 1;
}

.thumbnail-action-btn {
  font-size: 0.6rem;
  padding: 0.2rem 0.4rem;
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
}

/* 下拉菜单动画 */
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s ease-out;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 书籍历史展开/折叠动画 */
.concept-item {
  transition: background-color 0.2s ease;
}

.concept-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 学习统计滑动动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* 成就徽章效果 */
.achievement-badge {
  transition: all 0.2s ease;
}

.achievement-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 成就动画效果 */
.achievement-animation-enter-active,
.achievement-animation-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.achievement-animation-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.achievement-animation-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

.achievement-pulse {
  animation: achievement-pulse 2s infinite;
}

@keyframes achievement-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(236, 201, 75, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(236, 201, 75, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(236, 201, 75, 0);
  }
}
</style>
