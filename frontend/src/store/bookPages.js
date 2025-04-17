import { ref } from 'vue'

export function useBookPages() {
  // 当前页码索引
  const currentPageIndex = ref(0)
  
  // 书籍页面内容数组
  const bookPages = ref([
    // 这里模拟样例书籍内容，实际应用中会从API获取
    `# 第一章：深度学习概述

在过去十年中，深度学习已经彻底改变了计算机视觉、自然语言处理和许多其他领域。本章我们将介绍深度学习的基本概念和它的发展历史。

## 什么是深度学习？

深度学习是机器学习的一个子领域，它关注使用深度神经网络（具有多个隐藏层的人工神经网络）从数据中学习表示。与传统机器学习方法相比，深度学习的独特优势在于它能够**自动学习特征**，无需手动特征工程。

## 深度学习的历史

深度学习的历史可以追溯到20世纪40年代人工神经网络的概念首次被提出的时候。然而，直到近年来计算能力的显著提升和大数据的可用性，深度学习才真正展现出其强大的能力。`,
    
    `## 深度学习的关键突破

几个关键的突破促进了深度学习的发展：

1. **计算能力的增强**：GPU的出现为训练大型神经网络提供了必要的计算能力。

2. **大规模数据集**：ImageNet等大型标注数据集的出现，为训练深度模型提供了足够的数据。

3. **算法的改进**：从反向传播到更复杂的神经网络架构，算法的不断创新推动了深度学习的进步。

## 深度学习与传统机器学习

下表比较了深度学习与传统机器学习方法的区别：

| 特点 | 传统机器学习 | 深度学习 |
|------|------------|---------|
| 特征工程 | 需要手动 | 自动学习 |
| 数据量要求 | 一般较小 | 通常很大 |
| 计算资源 | 要求较低 | 要求高 |
| 可解释性 | 较强 | 较弱（黑盒） |
| 性能 | 在小数据上可能更好 | 在大数据上通常更优 |`,

    `## 深度学习的应用领域

深度学习已被成功应用于多个领域：

1. **计算机视觉**：图像分类、目标检测、图像分割、人脸识别等。

2. **自然语言处理**：机器翻译、情感分析、文本摘要、问答系统等。

3. **语音识别**：将语音转换为文本，语音助手等应用。

4. **推荐系统**：个性化内容推荐，如电影、音乐、产品等。

5. **医疗诊断**：从医学图像中检测疾病，预测患者风险等。

6. **自动驾驶**：环境感知、路径规划等。

深度学习的强大之处在于其适应性和泛化能力，使其能够在各种复杂任务中表现出色。`,

    `# 第二章：神经网络基础

本章将介绍神经网络的基本概念和工作原理，为理解更复杂的深度学习模型奠定基础。

## 人工神经元

人工神经元是神经网络的基本单元，其设计灵感来源于生物神经元的工作方式。一个人工神经元包括以下组件：

1. **输入**: 来自其他神经元或外部数据的信号。
2. **权重**: 分配给每个输入的重要性参数。
3. **偏置**: 调整神经元激活阈值的参数。
4. **加权求和**: 输入与对应权重的乘积之和，再加上偏置。
5. **激活函数**: 将加权求和转换为输出的非线性函数。

数学表示:
$y = f(\sum_{i=1}^{n} w_i x_i + b)$

其中，$f$ 是激活函数，$w_i$ 是权重，$x_i$ 是输入，$b$ 是偏置。`
  ])
  
  // 页面导航
  function navigatePage(index) {
    if (index >= 0 && index < bookPages.value.length) {
      currentPageIndex.value = index
    }
  }
  
  // 渲染页面内容（可以添加更多功能如高亮、注释等）
  function renderPage(index) {
    return bookPages.value[index] || ''
  }
  
  // 加载书籍数据的方法（实际应用中会调用API）
  async function loadBookData(bookId) {
    try {
      // 这里模拟API调用
      console.log(`加载书籍数据，ID: ${bookId}`)
      
      // 实际应用中会从后端获取数据
      // const response = await fetch(`/api/books/${bookId}`)
      // const data = await response.json()
      // bookPages.value = data.pages
      
      // 重置到第一页
      currentPageIndex.value = 0
      
      return true
    } catch (error) {
      console.error('加载书籍数据失败:', error)
      return false
    }
  }
  
  // 添加书签
  function addBookmark(pageIndex, note = '') {
    // 实际应用中会保存到后端或本地存储
    console.log(`在第${pageIndex + 1}页添加书签: ${note}`)
  }
  
  // 添加高亮
  function addHighlight(pageIndex, text, color = 'yellow') {
    // 实际应用中会保存到后端或本地存储
    console.log(`在第${pageIndex + 1}页高亮文本: "${text}" (颜色: ${color})`)
  }
  
  // 添加笔记
  function addNote(pageIndex, text, noteContent) {
    // 实际应用中会保存到后端或本地存储
    console.log(`在第${pageIndex + 1}页为文本 "${text}" 添加笔记: "${noteContent}"`)
  }
  
  return {
    bookPages,
    currentPageIndex,
    navigatePage,
    renderPage,
    loadBookData,
    addBookmark,
    addHighlight,
    addNote
  }
}
