<template>
  <div class="flex justify-center mt-4">
    <button 
      v-for="page in totalPages" 
      :key="page"
      @click="$emit('page-changed', page)"
      :class="['mx-1 px-3 py-1 rounded', currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200']"
    >
      {{ page }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number
})

defineEmits(['page-changed'])
</script>
