<template>
  <form @submit.prevent="submitForm">
    <UInput v-model="categoryName" placeholder="Enter category name" />
    <UButton type="submit">Add Category</UButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['category-added'])
const categoryName = ref('')

const submitForm = () => {
  emit('category-added', { id: Date.now(), name: categoryName.value })
  categoryName.value = ''
}
</script>