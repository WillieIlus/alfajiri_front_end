<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <UFormGroup label="Company Name">
      <UInput v-model="form.name" placeholder="Enter company name" />
    </UFormGroup>
    <UFormGroup label="Description">
      <UTextarea v-model="form.description" placeholder="Enter company description" />
    </UFormGroup>
    <UFormGroup label="Phone">
      <UInput v-model="form.phone" placeholder="Enter company phone" />
    </UFormGroup>
    <UFormGroup label="Email">
      <UInput v-model="form.email" placeholder="Enter company email" type="email" />
    </UFormGroup>
    <UFormGroup label="Logo">
      <input type="file" @change="onLogoChange" accept="image/*" ref="fileInput" />
    </UFormGroup>
    <LogoPreview :imageUrl="logoPreview" />
    <UButton type="submit" :disabled="submitting">Add Company</UButton>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useCompanyStore } from '~/store/companies'

const companyStore = useCompanyStore()

const emit = defineEmits(['company-added'])

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const logoPreview = ref<string | null>(null)

const schema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  logo: z.instanceof(File).optional(),
})

type FormData = z.infer<typeof schema>

const form = reactive<FormData>({
  name: '',
  description: '',
  phone: '',
  email: '',
  logo: null,
})

const onLogoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    form.logo = target.files[0]
    logoPreview.value = URL.createObjectURL(target.files[0])
  }
}

const onSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const validatedData = await schema.parseAsync(form)
    const formData = new FormData()

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    console.log('FormData contents:')
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

    const newCompany = await companyStore.createCompany(formData)

    successMessage.value = 'Company created successfully'
    emit('company-added', newCompany)

    // Reset form
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = '' as any
    })
    form.logo = null
    logoPreview.value = null
    if (fileInput.value) fileInput.value.value = ''

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      errorMessage.value = error.issues.map(issue => issue.message).join(', ')
    } else {
      errorMessage.value = 'Failed to create company'
    }
  } finally {
    submitting.value = false
  }
}
</script>