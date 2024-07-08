<template>
  <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup name="name" label="Location Name">
      <UInput v-model="state.name" placeholder="Enter location name" />
    </UFormGroup>
    <UButton type="submit" :disabled="submitting">Add Location</UButton>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </UForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useLocationStore } from '~/store/locations'

const toast = useToast()
const locationStore = useLocationStore()

const emit = defineEmits(['location-added'])

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const schema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters'),
})

type Schema = z.infer<typeof schema>

const state = ref({
  name: '',
})

const getNextId = computed(() => {
  const locations = locationStore.locations
  return locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { name } = event.data

  try {
    const formData = new FormData()
    formData.append('name', name)
    // Append other files or data here if needed

    const newLocation = await locationStore.createLocation(formData)
    
    successMessage.value = 'Location created successfully'
    toast.add({ title: 'Success', description: 'Location created successfully' })
    
    const id = getNextId.value
    emit('location-added', { ...newLocation, id, value: id, label: name })
    state.value.name = '' // Reset the form
    
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'An error occurred. Please try again.'
    toast.add({ title: 'Error', description: 'Failed to add location', color: 'red' })
  } finally {
    submitting.value = false
  }
}
</script>
