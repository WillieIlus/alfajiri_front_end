<template>
  <form @submit.prevent="submitForm">
    <UInput v-model="locationName" placeholder="Enter location name" />
    <UButton type="submit">Add Location</UButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['location-added'])
const locationName = ref('')

const submitForm = () => {
  emit('location-added', { id: Date.now(), name: locationName.value })
  locationName.value = ''
}
</script>