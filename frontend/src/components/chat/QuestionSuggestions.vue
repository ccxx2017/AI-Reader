<template>
  <!-- 智能提问建议 - 可折叠 -->
  <div class="border-t border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center px-4 py-2 cursor-pointer" @click="$emit('toggle-suggestions')">
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
          @click="$emit('use-suggestion', suggestion.text)"
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
            @click="$emit('use-suggestion', question)"
            class="px-3 py-1.5 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showSuggestions: {
    type: Boolean,
    required: true
  },
  questionSuggestions: {
    type: Array,
    default: () => []
  },
  relatedHistoryQuestions: {
    type: Array,
    default: () => []
  }
});

defineEmits(['toggle-suggestions', 'use-suggestion']);
</script>
