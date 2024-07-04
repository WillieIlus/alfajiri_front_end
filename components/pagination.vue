<!-- <template>
  <UPagination class="justify-self-end my-4"
    :first-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'First', color: 'gray' }"
    :last-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Last', color: 'gray' }"
    :model-value="1"
    :total="100"
    show-first
    show-last
  />
</template> -->
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
