<template>
  <UCard>
    <h2 class="mb-4 font-bold text-2xl">{{ isEditMode ? 'Edit Job Vacancy' : 'Add a new Job Vacancy' }}</h2>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit.prevent="onSubmit">
      <UFormGroup name="title" label="Title">
        <UInput v-model="state.title" @focus="showDetails = true" />
      </UFormGroup>

      <template v-if="showDetails">
        <UFormGroup name="company" label="Company">
          <UInputMenu v-model="state.company" :options="companyOptions" />
        </UFormGroup>

        <UFormGroup name="description" label="Description">
          <UTextarea v-model="state.description" />
        </UFormGroup>

        <UButton variant="outline" class="ml-2" @click="form.clear()">
          Clear
        </UButton>

        <UButton type="submit" :disabled="submitting">{{ isEditMode ? 'Update' : 'Submit' }}</UButton>
        <p v-if="successMessage">{{ successMessage }}</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </template>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import { useJobStore } from '~/store/jobs'
import { useCompanyStore } from '~/store/companies'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const jobStore = useJobStore()
const companyStore = useCompanyStore()

const { companies } = storeToRefs(companyStore)

const fetchCompanies = async () => {
  await companyStore.fetchCompanies()
}

const companyOptions = computed(() => {
  return (companies.value || []).map(company => ({
    label: company.name,
    value: company.id
  }))
})

const state = ref({
  company: null,
  title: '',
  description: '',
})

const schema = z.object({
  title: z.string().min(10, 'Must be at least 10 characters'),
  company: z.any(),
  description: z.string().min(100, 'Must be at least 100 characters'),
})

type Schema = z.infer<typeof schema>

const form = ref()

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDetails = ref(false)
const isEditMode = ref(false)

const slug = route.params.slug // assuming the slug is passed as a route parameter

const loadJob = async () => {
  if (slug) {
    const job = await jobStore.getJob(slug) // assuming getJob fetches a job by slug
    state.value.title = job.title
    state.value.company = job.company
    state.value.description = job.description
    showDetails.value = true
    isEditMode.value = true
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  const { data } = event
  try {
    const formData = new FormData()
    formData.append('title', state.value.title)
    formData.append('company', state.value.company)
    formData.append('description', state.value.description)

    if (isEditMode.value) {
      await jobStore.updateJob(slug, formData)
      successMessage.value = 'Job updated successfully'
    } else {
      await jobStore.createJob(formData)
      successMessage.value = 'Job created successfully'
      // router.push('/jobs/')
    }
  } catch (error) {
    errorMessage.value = 'Failed to save job'
    console.log(error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCompanies()
  loadJob()
})
</script>
