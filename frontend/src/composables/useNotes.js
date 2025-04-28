import { ref, computed } from 'vue';
import { useNotesStore } from '../store/modules/notes';
import { useBookStore } from '../store/modules/book';

export function useNotes() {
  const notesStore = useNotesStore();
  const bookStore = useBookStore();
  
  // 页面加载状态
  const isLoading = ref(false);
  
  // 当前被选中的文本
  const selectedText = ref('');
  
  // 正在创建/编辑的笔记
  const activeNote = ref(null);
  
  // 当前页面的笔记
  const currentPageNotes = computed(() => {
    if (!bookStore.currentBook) return [];
    return notesStore.getPageNotes(bookStore.currentPage).value;
  });
  
  // 按添加时间排序的笔记
  const sortedNotes = computed(() => {
    return [...currentPageNotes.value].sort((a, b) => {
      // 将创建时间转换为时间戳进行比较
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA; // 从新到旧排序
    });
  });
  
  // 更新当前选中的文本
  function updateSelectedText(text) {
    selectedText.value = text;
  }
  
  // 为选中的文本创建新笔记
  function createNoteFromSelection() {
    if (!selectedText.value || !bookStore.currentBook) return null;
    
    try {
      isLoading.value = true;
      const newNote = notesStore.addNoteToSelection(bookStore.currentPage, selectedText.value);
      
      // 清空选中的文本
      selectedText.value = '';
      
      // 设置当前活动的笔记
      activeNote.value = newNote;
      
      return newNote;
    } catch (error) {
      console.error('创建笔记失败:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 创建空白笔记
  function createEmptyNote() {
    if (!bookStore.currentBook) return null;
    
    try {
      isLoading.value = true;
      const newNote = notesStore.addEmptyNote(bookStore.currentPage);
      
      // 设置当前活动的笔记
      activeNote.value = newNote;
      
      return newNote;
    } catch (error) {
      console.error('创建空白笔记失败:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 保存笔记内容
  function saveNoteContent(noteId, content) {
    try {
      isLoading.value = true;
      const updatedNote = notesStore.saveNote(noteId, content);
      
      // 如果保存的是当前活动的笔记
      if (activeNote.value && activeNote.value.id === noteId) {
        // 如果笔记被删除（内容为空时）
        if (!updatedNote) {
          activeNote.value = null;
        } else {
          activeNote.value = updatedNote;
        }
      }
      
      return updatedNote;
    } catch (error) {
      console.error('保存笔记失败:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 编辑指定笔记
  function editNote(noteId) {
    try {
      isLoading.value = true;
      const note = notesStore.showNoteContent(noteId);
      
      if (note) {
        activeNote.value = note;
      }
      
      return note;
    } catch (error) {
      console.error('编辑笔记失败:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 删除指定笔记
  function deleteNote(noteId) {
    try {
      isLoading.value = true;
      const deletedNote = notesStore.deleteNote(noteId);
      
      // 如果删除的是当前活动的笔记
      if (activeNote.value && activeNote.value.id === noteId) {
        activeNote.value = null;
      }
      
      return deletedNote;
    } catch (error) {
      console.error('删除笔记失败:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 关闭笔记编辑器
  function closeNoteEditor() {
    notesStore.closeNoteEditor();
    activeNote.value = null;
  }
  
  // 在所有笔记中搜索
  function searchInNotes(searchText) {
    if (!searchText || !searchText.trim()) {
      return [];
    }
    
    return notesStore.searchNotes(searchText);
  }
  
  // 查找包含指定文本的笔记
  function findNotesWithText(text) {
    return notesStore.getNotesWithText(bookStore.currentPage, text);
  }
  
  // 导出所有笔记
  function exportAllNotes() {
    if (!bookStore.currentBook || !notesStore.pageNotes.length) {
      return null;
    }
    
    const notesData = {
      bookId: bookStore.currentBook.id,
      bookTitle: bookStore.currentBook.title,
      notes: notesStore.pageNotes,
      exportDate: new Date().toISOString()
    };
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(notesData, null, 2);
    
    // 创建Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${bookStore.currentBook.title.replace(/\s+/g, '-')}.json`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    return notesData;
  }
  
  // 获取特定页面的笔记数量
  function getPageNotesCount(pageIndex) {
    return notesStore.getPageNotes(pageIndex).value.length;
  }
  
  return {
    isLoading,
    selectedText,
    activeNote,
    currentPageNotes,
    sortedNotes,
    updateSelectedText,
    createNoteFromSelection,
    createEmptyNote,
    saveNoteContent,
    editNote,
    deleteNote,
    closeNoteEditor,
    searchInNotes,
    findNotesWithText,
    exportAllNotes,
    getPageNotesCount
  };
}
