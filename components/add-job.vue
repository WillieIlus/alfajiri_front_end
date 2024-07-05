<template>
  <UCard>
    <h2 class="mb-4 font-bold text-2xl"> Add a new Job Vacancy </h2>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup name="title" label="Title">
        <UInput v-model="state.title" @focus="checkAuth" />
      </UFormGroup>

      <div v-if="showDetails">
        <UFormGroup name="company" label="Company">
          <UInputMenu v-model="state.company" :options="companyOptions" />
        </UFormGroup>

        <UFormGroup name="description" label="Description">
          <UTextarea v-model="state.description" />
        </UFormGroup>

        <UButton type="submit" :disabled="submitting">Submit</UButton>
        <UButton variant="outline" class="ml-2" @click="clearForm">
          Clear
        </UButton>
        <p v-if="successMessage">{{ successMessage }}</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </UForm>


  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useJobStore } from '~/store/jobs'
import { useCompanyStore } from '~/store/companies'
import { useAccountStore } from '~/store/accounts'
import { useRouter } from 'vue-router'

const toast = useToast()

const router = useRouter()
const jobStore = useJobStore()
const companyStore = useCompanyStore()
const accountStore = useAccountStore()
const emit = defineEmits(['jobCreated'])

const { companies } = storeToRefs(companyStore)

const fetchCompanies = async () => {
  await companyStore.fetchCompanies()
}

const companyOptions = computed(() => {
  return (companies.value || []).map(company => ({
    label: company.name,
    value: company.id
  }));
});

const state = ref({
  company: null,
  title: '',
  description: '',
});

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

const checkAuth = () => {
  if (!accountStore.isLoggedIn) {
    router.push('/login')
  } else {
    showDetails.value = true
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''

  const { data } = event
  try {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('company', data.company)
    formData.append('description', data.description)

    await jobStore.createJob(formData)
    successMessage.value = 'Job vacancy added successfully!'
    errorMessage.value = ''
    toast.add({ title: successMessage.value, type: 'success' })
    state.value = {
      company: null,
      title: '',
      description: '',
    };
    emit('jobCreated')
  } catch (error) {
    successMessage.value = ''
    errorMessage.value = 'Failed to add job vacancy.'
    toast.add({ title: errorMessage.value, type: 'error' })
  } finally {
    submitting.value = false
    successMessage.value = ''
    errorMessage.value = ''
  }
}

const clearForm = () => {
  form.value.reset()
  showDetails.value = false
}

onMounted(() => {
  fetchCompanies()
})

</script>
