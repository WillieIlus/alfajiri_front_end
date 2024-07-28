<template>
  <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup name="name" label="Company Name">
      <UInput v-model="state.name" placeholder="Enter company name" />
    </UFormGroup>
    <UFormGroup name="description" label="Description">
      <UTextarea v-model="state.description" placeholder="Enter company description" />
    </UFormGroup>
    <UFormGroup name="phone" label="Phone">
      <UInput v-model="state.phone" placeholder="Enter company phone" />
    </UFormGroup>
    <UFormGroup name="email" label="Email">
      <UInput v-model="state.email" placeholder="Enter company email" type="email" />
    </UFormGroup>
    <UFormGroup name="logo" label="Logo">
      <UInput type="file" @change="onLogoChange" accept="image/*" />
    </UFormGroup>
    <UButton type="submit" :disabled="submitting">Add Company</UButton>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </UForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useCompanyStore } from '~/store/companies'
import { storeToRefs } from 'pinia'

const companyStore = useCompanyStore()
const { loading, error } = storeToRefs(companyStore)

const emit = defineEmits(['company-added'])

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const logo = ref<File | null>(null)

const schema = z.object({
  id: z.number(),
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
})

type Schema = z.infer<typeof schema>

const state = ref({
  id: 0,
  name: '',
  description: '',
  phone: '',
  email: '',
})

const getNextId = computed(() => {
  const companies = companyStore.companies || []
  return companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1
})

const onLogoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    logo.value = target.files[0]
  }
}

const onSubmit = async ({ data }: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const localId = getNextId.value

  try {
    const formData = new FormData()

    // Add all form fields to formData
    Object.keys(data).forEach(key => {
      if (key !== 'id') { // Skip the 'id' field when sending to backend
        formData.append(key, data[key])
      }
    })
    
    // Add the logo if it exists
    if (logo.value) {
      formData.append('logo', logo.value)
    }

    const newCompany = await companyStore.createCompany(formData)

    // Use the localId for the emit, but the actual data from the server response
    successMessage.value = 'Company created successfully'
    emit('company-added', { ...newCompany, id: localId })

    // Reset form
    state.value = {
      id: 0,
      name: '',
      description: '',
      phone: '',
      email: '',
    }
    logo.value = null

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to create company'
  } finally {
    submitting.value = false
  }
}
</script>
