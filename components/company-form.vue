<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Add New Company</h2>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <UFormGroup label="Company Name" name="name" :error="errors.name">
        <UInput v-model="form.name" placeholder="Enter company name" />
      </UFormGroup>      
      <UFormGroup label="Phone" name="phone" :error="errors.phone">
        <UInput v-model="form.phone" placeholder="Enter company phone" />
      </UFormGroup>
      
      <UFormGroup label="Email" name="email" :error="errors.email">
        <UInput v-model="form.email" placeholder="Enter company email" type="email" />
      </UFormGroup>
      <LogoPreview v-if="logoPreview" :imageUrl="logoPreview" class="mt-4" />
      <UFormGroup label="Logo" name="logo" :error="errors.logo">
        <div class="flex items-center space-x-4">
          <UButton
            icon="i-heroicons-photo"
            color="gray"
            variant="soft"
            @click="$refs.fileInput.click()"
          >
            Choose File
          </UButton>
          <span v-if="form.logo" class="text-sm text-gray-600">
            {{ form.logo.name }}
          </span>
          <input
            type="file"
            ref="fileInput"
            @change="onLogoChange"
            accept="image/*"
            class="hidden"
          />
        </div>
      </UFormGroup>

      <UFormGroup label="Description" name="description" :error="errors.description">
        <TiptapEditor
          ref="tiptapEditor"
          :modelValue="form.description"
          @update:modelValue="form.description = $event"
          class="min-h-[150px] border border-gray-300 rounded-md p-2"
        />
      </UFormGroup>

      <div class="flex justify-end space-x-4 pt-6">
        <UButton
          variant="outline"
          color="gray"
          @click="clearForm"
          :disabled="submitting"
        >
          Clear
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :loading="submitting"
          :disabled="submitting"
        >
          Add Company
        </UButton>
      </div>
    </form>
    
    <UAlert
      v-if="successMessage"
      color="green"
      variant="soft"
      icon="i-heroicons-check-circle"
      class="mt-6"
    >
      {{ successMessage }}
    </UAlert>
    
    <UAlert
      v-if="errorMessage"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-circle"
      class="mt-6"
    >
      {{ errorMessage }}
    </UAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useCompanyStore } from '~/store/companies'

const companyStore = useCompanyStore()

const emit = defineEmits(['company-added'])

const successMessage = ref('')
const errorMessage = ref('')
const tiptapEditor = ref(null)
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
  logo: undefined,
})

const errors = reactive({
  name: '',
  description: '',
  phone: '',
  email: '',
  logo: '',
})

const onLogoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    form.logo = target.files[0]
    logoPreview.value = URL.createObjectURL(target.files[0])
  }
}

const clearForm = () => {
  Object.keys(form).forEach(key => {
    form[key as keyof FormData] = '' as any
  })
  form.logo = undefined
  logoPreview.value = null
  if (tiptapEditor.value?.editor) {
    tiptapEditor.value.editor.commands.clearContent()
  }
  if (fileInput.value) fileInput.value.value = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const onSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  try {
    const validatedData = await schema.parseAsync(form)
    const formData = new FormData()

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    const newCompany = await companyStore.createCompany(formData)

    successMessage.value = 'Company created successfully'
    emit('company-added', newCompany)

    clearForm()

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof typeof errors] = issue.message
        }
      })
    } else {
      errorMessage.value = 'Failed to create company'
    }
  } finally {
    submitting.value = false
  }
}
</script>