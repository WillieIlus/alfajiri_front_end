<template>
  <form @submit.prevent="submitForm">
    <UInput v-model="companyName" placeholder="Enter company name" />
    <UButton type="submit">Add Company</UButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['company-added'])
const companyName = ref('')

const submitForm = () => {
  // Here you would typically make an API call to add the company
  // For this example, we'll just emit an event with a mock response
  emit('company-added', { id: Date.now(), name: companyName.value })
  companyName.value = ''
}
</script>