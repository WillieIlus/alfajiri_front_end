<template>
  <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup name="name" label="Category Name">
      <UInput v-model="state.name" placeholder="Enter category name" />
    </UFormGroup>
    <UButton type="submit" :disabled="submitting">Add Category</UButton>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </UForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useCategoryStore } from '~/store/categories'
import { storeToRefs } from 'pinia'

const toast = useToast()
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const emit = defineEmits(['category-added'])

const schema = z.object({
  name: z.string().min(3, 'Must be at least 3 characters'),
})

type Schema = z.infer<typeof schema>

const state = ref({
  name: '',
})

const getNextId = computed(() => {
  const categoryList = categories.value || []
  return categoryList.length > 0 ? Math.max(...categoryList.map(c => c.id)) + 1 : 1
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const { name } = event.data
  const id = getNextId.value

  // Prepare FormData
  const formData = new FormData()
  formData.append('id', id.toString())
  formData.append('name', name)

  try {
    await categoryStore.createCategory(formData)
    successMessage.value = 'Category added successfully'
    emit('category-added')
  } catch (error) {
    errorMessage.value = error.message || 'Failed to add category'
  } finally {
    submitting.value = false
  }
}
</script>
