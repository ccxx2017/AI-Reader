import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useNotesStore = defineStore('notes', () => {
  // 所有页面的笔记
  const pageNotes = ref([]);
  
  // 当前活动的笔记ID
  const activeNoteId = ref(null);
  
  // 计算当前页面的笔记
  const getPageNotes = (pageIndex) => {
    return computed(() => {
      return pageNotes.value.filter(note => note.page === pageIndex);
    });
  };
  
  // 添加空白笔记
  function addEmptyNote(pageIndex) {
    // 创建新笔记
    const newNote = {
      id: `note-${Date.now()}`,
      page: pageIndex,
      sourceText: '',
      text: '', // 初始为空
      timestamp: new Date().toLocaleString(),
      editing: true, // 自动进入编辑模式
      active: true
    };
    
    // 添加到笔记列表
    pageNotes.value.push(newNote);
    
    // 把旧笔记设为非激活状态
    pageNotes.value.forEach(note => {
      if (note.id !== newNote.id) {
        note.active = false;
      }
    });
    
    // 设置当前活动笔记
    activeNoteId.value = newNote.id;
    
    // 保存到本地存储
    saveNotesToLocalStorage();
    
    return newNote;
  }
  
  // 为选中文本添加笔记
  function addNoteToSelection(pageIndex, selectedText) {
    if (!selectedText) return null;
    
    // 创建新笔记
    const newNote = {
      id: `note-${Date.now()}`,
      page: pageIndex,
      sourceText: selectedText,
      text: '', // 初始为空
      timestamp: new Date().toLocaleString(),
      editing: true, // 自动进入编辑模式
      active: true
    };
    
    // 添加到笔记列表
    pageNotes.value.push(newNote);
    
    // 把旧笔记设为非激活状态
    pageNotes.value.forEach(note => {
      if (note.id !== newNote.id) {
        note.active = false;
      }
    });
    
    // 设置当前活动笔记
    activeNoteId.value = newNote.id;
    
    // 保存到本地存储
    saveNotesToLocalStorage();
    
    return newNote;
  }
  
  // 显示笔记内容进行编辑
  function showNoteContent(noteId) {
    // 查找笔记索引
    const noteIndex = pageNotes.value.findIndex(note => note.id === noteId);
    
    // 验证索引是否有效
    if (noteIndex >= 0) {
      // 设置当前笔记为编辑状态
      pageNotes.value[noteIndex].editing = true;
      
      // 激活当前笔记，其他笔记设为非激活
      pageNotes.value.forEach((note, i) => {
        note.active = i === noteIndex;
      });
      
      // 设置当前活动笔记
      activeNoteId.value = noteId;
      
      return pageNotes.value[noteIndex];
    }
    
    return null;
  }
  
  // 保存笔记
  function saveNote(noteId, text) {
    // 查找笔记索引
    const noteIndex = pageNotes.value.findIndex(note => note.id === noteId);
    
    // 验证索引是否有效
    if (noteIndex >= 0) {
      // 更新笔记内容
      pageNotes.value[noteIndex].text = text;
      
      // 退出编辑模式
      pageNotes.value[noteIndex].editing = false;
      
      // 更新时间戳
      pageNotes.value[noteIndex].timestamp = new Date().toLocaleString() + ' (已编辑)';
      
      // 如果笔记内容为空，则删除该笔记
      if (!text.trim()) {
        return deleteNote(noteId);
      }
      
      // 保存到本地存储
      saveNotesToLocalStorage();
      
      return pageNotes.value[noteIndex];
    }
    
    return null;
  }
  
  // 删除笔记
  function deleteNote(noteId) {
    // 查找笔记索引
    const noteIndex = pageNotes.value.findIndex(note => note.id === noteId);
    
    // 验证索引是否有效
    if (noteIndex >= 0) {
      // 从数组中移除
      const deletedNote = pageNotes.value.splice(noteIndex, 1)[0];
      
      // 如果删除的是当前活动笔记，则重置活动笔记
      if (activeNoteId.value === noteId) {
        activeNoteId.value = null;
      }
      
      // 更新本地存储
      saveNotesToLocalStorage();
      
      return deletedNote;
    }
    
    return null;
  }
  
  // 关闭笔记编辑框
  function closeNoteEditor() {
    pageNotes.value.forEach(note => {
      note.editing = false;
    });
  }
  
  // 保存笔记到本地存储
  function saveNotesToLocalStorage() {
    localStorage.setItem('pageNotes', JSON.stringify(pageNotes.value));
  }
  
  // 从本地存储加载笔记
  function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem('pageNotes');
    if (savedNotes) {
      try {
        pageNotes.value = JSON.parse(savedNotes);
      } catch (error) {
        console.error('加载笔记失败:', error);
      }
    }
  }
  
  // 搜索笔记
  function searchNotes(query) {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const queryLower = query.toLowerCase();
    return pageNotes.value.filter(note => {
      return (
        note.text.toLowerCase().includes(queryLower) || 
        note.sourceText.toLowerCase().includes(queryLower)
      );
    });
  }
  
  // 获取指定页面上包含指定文本的笔记
  function getNotesWithText(pageIndex, text) {
    if (!text || text.trim() === '') {
      return [];
    }
    
    const textLower = text.toLowerCase();
    return pageNotes.value.filter(note => {
      return (
        note.page === pageIndex && 
        (note.text.toLowerCase().includes(textLower) || 
         note.sourceText.toLowerCase().includes(textLower))
      );
    });
  }
  
  // 初始化
  function init() {
    loadNotesFromLocalStorage();
  }
  
  return {
    pageNotes,
    activeNoteId,
    getPageNotes,
    addEmptyNote,
    addNoteToSelection,
    showNoteContent,
    saveNote,
    deleteNote,
    closeNoteEditor,
    searchNotes,
    getNotesWithText,
    init
  };
});
