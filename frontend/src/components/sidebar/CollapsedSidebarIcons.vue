<template>
  <div class="sidebar-icons">
    <div class="sidebar-icon" title="拍照">
      <i class="fas fa-camera"></i>
    </div>
    <div class="sidebar-icon" title="笔记">
      <i class="fas fa-sticky-note"></i>
    </div>
    <div class="sidebar-icon" title="书籍">
      <i class="fas fa-book"></i>
    </div>
    <div class="sidebar-icon" title="历史">
      <i class="fas fa-history"></i>
    </div>
    <div class="sidebar-icon" title="设置">
      <i class="fas fa-cog"></i>
    </div>
  </div>
</template>

<script setup>
// 这个组件只包含折叠状态下的图标，不需要额外的逻辑
</script>

<style scoped>
.sidebar-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  height: 100%;
}

.sidebar-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 50%;
  transition: transform 0.2s, background-color 0.2s;
}

.sidebar-icon:hover {
  transform: scale(1.1);
  background-color: #3b82f6;
}
</style>
