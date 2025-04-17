# AI 阅读助手

AI阅读助手是一个基于Vue 3开发的前端应用，为用户提供智能阅读体验。通过集成AI功能，帮助用户更好地理解和处理阅读内容。

## 功能特点

- 📚 电子书阅读与显示
- 🤖 AI助手实时交互与解答
- 🔍 文本选择、高亮与笔记功能
- 🌓 明暗主题切换
- 📱 响应式设计，支持桌面和移动设备

## 技术栈

- Vue 3 (组合式API)
- Tailwind CSS
- Marked (Markdown渲染)
- Font Awesome (图标)

## 目录结构

```
frontend/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 样式和图片资源
│   ├── components/     # Vue组件
│   ├── composables/    # 组合式API
│   ├── store/          # 数据存储
│   ├── views/          # 视图组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML模板
├── package.json        # 项目依赖
├── vite.config.js      # Vite配置
└── README.md           # 项目说明
```

## 开发说明

### 安装依赖

```
npm install
```

### 启动开发服务器

```
npm run dev
```

### 构建生产版本

```
npm run build
```

### 预览生产构建

```
npm run preview
```

## 后端集成

本项目计划与FastAPI后端集成，API交互点主要包括：

- 用户认证
- 书籍数据获取
- AI问答交互
- 笔记和高亮保存

## 开发状态

当前项目处于原型开发阶段，功能持续完善中。
