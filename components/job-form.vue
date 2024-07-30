<template>
  <UCard class="mb-6">
    <h2 class="mb-4 font-bold text-2xl">{{ jobSlug ? 'Update Job Vacancy' : 'Add a new Job Vacancy' }}</h2>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup name="title" label="Title">
        <UInput v-model="state.title" @focus="checkAuth" />
      </UFormGroup>

      <div v-if="showDetails">
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
            <UFormGroup class="flex-auto" size="xl" name="company" label="Company">
              <UInputMenu v-model="state.company" :options="companyOptions" />
            </UFormGroup>
            <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('company')" />
          </div>

          <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
            <UFormGroup class="flex-auto" size="xl" name="category" label="Category">
              <UInputMenu v-model="state.category" :options="categoryOptions" />
            </UFormGroup>
            <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('category')" />
          </div>

          <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
            <UFormGroup class="flex-auto" size="xl" name="location" label="Location">
              <UInputMenu v-model="state.location" :options="locationOptions" />
            </UFormGroup>
            <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('location')" />
          </div>
        </div>

        <UFormGroup name="description" label="Description">
          <TiptapEditor ref="tiptapEditor" :modelValue="state.description"
            @update:modelValue="(newValue) => state.description = newValue" />
        </UFormGroup>

        <div v-if="jobSlug">
          <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="job_type" label="Job Type">
                <USelect v-model="state.job_type" :options="JOB_TYPE_CHOICES" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" name="image" label="Poster" size="xl">
                <UInput type="file" @change="onImageChange" accept="image/*" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="address" label="Address">
                <UInput v-model="state.address" placeholder="Enter Specific Location" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="email" label="Email">
                <UInput v-model="state.email" placeholder="Enter email" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="website" label="Website">
                <UInput v-model="state.website" placeholder="Enter website" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="phone" label="Phone">
                <UInput v-model="state.phone" placeholder="Enter phone" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="vacancies" label="Vacancies">
                <UInput v-model="state.vacancies" placeholder="Available vacant positions" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="work_experience" label="Work Experience">
                <UInput v-model="state.work_experience" placeholder="Required work experience" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="work_hours" label="Work Hours">
                <UInput v-model="state.work_hours" placeholder="Duration of work" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="work_hour_type" label="Work Hour Type">
                <USelect v-model="state.work_hour_type" :options="WORK_HOUR_CHOICES" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="min_salary" label="Min Salary">
                <UInput v-model="state.min_salary" placeholder="Minimum salary" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="max_salary" label="Max Salary">
                <UInput v-model="state.max_salary" placeholder="Maximum salary" />
              </UFormGroup>
            </div>
          </div>

          <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="salary_type" label="Salary Type">
                <USelect v-model="state.salary_type" :options="SALARY_TYPE_CHOICES" />
              </UFormGroup>
            </div>

            <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
              <UFormGroup class="flex-auto" size="xl" name="currency" label="Currency">
                <USelect v-model="state.currency" :options="CURRENCY_CHOICES" />
              </UFormGroup>
            </div>
          </div>
        </div>
        <div class="pt-4">
          <UButton type="submit" :disabled="submitting">
            {{ jobSlug ? 'Update' : 'Submit' }}
          </UButton>
          <UButton variant="outline" class="ml-2" @click="clearForm">
            Clear
          </UButton>
          <p v-if="successMessage">{{ successMessage }}</p>
          <p v-if="errorMessage">{{ errorMessage }}</p>
        </div>
      </div>
    </UForm>
  </UCard>

  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <h3 class="text-xl font-semibold">{{ modalTitle }}</h3>
      </template>
      <CompanyForm v-if="activeModal === 'company'" @company-added="handleCompanyAdded" />
      <CategoryForm v-if="activeModal === 'category'" @category-added="handleCategoryAdded" />
      <LocationForm v-if="activeModal === 'location'" @location-added="handleLocationAdded" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useJobStore } from '~/store/jobs'
import { useCompanyStore } from '~/store/companies'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { useAccountStore } from '~/store/accounts'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  jobSlug?: string
}>()

const emit = defineEmits(['jobCreated', 'jobUpdated'])

const router = useRouter()
const route = useRoute()
const toast = useToast()
const jobStore = useJobStore()
const companyStore = useCompanyStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const accountStore = useAccountStore()

const { companies } = storeToRefs(companyStore)
const { categories } = storeToRefs(categoryStore)
const { locations } = storeToRefs(locationStore)

const isModalOpen = ref(false)
const activeModal = ref('')
const tiptapEditor = ref(null)
const form = ref()
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDetails = ref(false)

const state = ref({
  title: '',
  company: null,
  category: null,
  location: null,
  description: '',
  job_type: '',
  image: null,
  address: '',
  email: '',
  website: '',
  phone: '',
  vacancies: '',
  work_experience: '',
  work_hours: '',
  work_hour_type: '',
  min_salary: '',
  max_salary: '',
  salary_type: '',
  currency: '',
})

const JOB_TYPE_CHOICES = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Temporary', value: 'Temporary' },
  { label: 'Freelance', value: 'Freelance' },
];

const CURRENCY_CHOICES = [
  { label: 'Kenya Shilling', value: 'KSH' },
  { label: 'US Dollar', value: 'USD' },
  { label: 'Uganda Shilling', value: 'UGH' },
  { label: 'Tanzania Shilling', value: 'TSH' },
  { label: 'Euro', value: 'EUR' },
  { label: 'British Pound', value: 'GBP' },
];

const SALARY_TYPE_CHOICES = [
  { label: 'Per Hour', value: 'PH' },
  { label: 'Per Day', value: 'PD' },
  { label: 'Per Week', value: 'PW' },
  { label: 'Per Month', value: 'PM' },
  { label: 'Per Year', value: 'PY' },
];

const WORK_HOUR_CHOICES = [
  { label: 'Per Day', value: 'PD' },
  { label: 'Per Week', value: 'PW' },
  { label: 'Per Month', value: 'PM' },
  { label: 'Per Year', value: 'PY' },
];

const schema = z.object({
  title: z.string().min(4, 'Must be at least 4 characters'),
  company: z.any().optional(),
  description: z.string().min(26, 'Must be at least 26 characters'),
  category: z.any().optional().nullish().or(z.literal('')),
  location: z.any().optional().nullish().or(z.literal('')),
  job_type: z.enum(JOB_TYPE_CHOICES).optional().nullish().or(z.literal('')),
  image: z.any().optional().nullish().or(z.literal('')),
  address: z.string().optional().nullish().or(z.literal('')),
  email: z.string().email('Invalid email').optional().nullish().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().nullish().or(z.literal('')),
  phone: z.string().optional().nullish().or(z.literal('')),
  vacancies: z.number().int('Must be an integer').positive('Must be positive').optional().nullish().or(z.literal('')),
  work_experience: z.number().int('Must be an integer').nonnegative('Must be non-negative').optional().nullish().or(z.literal('')),
  work_hours: z.number().int('Must be an integer').positive('Must be positive').optional().nullish().or(z.literal('')),
  work_hour_type: z.enum(WORK_HOUR_CHOICES).optional().nullish().or(z.literal('')),
  min_salary: z.number().positive('Must be positive').optional().nullish().or(z.literal('')),
  max_salary: z.number().positive('Must be positive').optional().nullish().or(z.literal('')),
  salary_type: z.enum(SALARY_TYPE_CHOICES).optional().nullish().or(z.literal('')),
  currency: z.enum(CURRENCY_CHOICES).optional().nullish().or(z.literal('')),
});

const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    state.value.image = file
  }
}
type Schema = z.infer<typeof schema>

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'company': return 'Add New Company'
    case 'category': return 'Add New Category'
    case 'location': return 'Add New Location'
    default: return ''
  }
})

// const companyOptions = computed(() => {
//   return (companies.value || []).map(company => ({
//     label: company.name,
//     value: company.id
//   }));
// });

const companyOptions = computed(() => {
  const currentUserEmail = accountStore.user?.email;
  return (companies.value || [])
    .filter(company => company.user?.email === currentUserEmail)
    .map(company => ({
      label: company.name,
      value: company.id
    }));
});

const categoryOptions = computed(() => {
  return (categories.value || []).map(category => ({
    label: category.name,
    value: category.id,
    name: category.name
  }));
});

const locationOptions = computed(() => {
  return (locations.value || []).map(location => ({
    label: location.name,
    value: location.id,
    name: location.name
  }));
});


const openModal = (type: 'company' | 'category' | 'location') => {
  activeModal.value = type
  isModalOpen.value = true
}

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
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof Object ? value.value : value)
      }
    })

    let response
    if (props.jobSlug) {
      response = await jobStore.updateJob(props.jobSlug, formData)
      successMessage.value = 'Job vacancy updated successfully!'
      emit('jobUpdated')
    } else {
      response = await jobStore.createJob(formData)
      successMessage.value = 'Job vacancy added successfully!'
      emit('jobCreated')
    }

    toast.add({ title: successMessage.value, type: 'success' })
    clearForm()
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = props.jobSlug
      ? 'Failed to update job vacancy.'
      : 'Failed to add job vacancy.'
    toast.add({ title: errorMessage.value, type: 'error' })
  } finally {
    submitting.value = false
  }
}

const fetchJobDetails = async () => {
  if (props.jobSlug) {
    await jobStore.fetchJob(props.jobSlug)
    if (jobStore.job) {
      Object.assign(state.value, jobStore.job)
      state.value.description = jobStore.job.description || ''
      showDetails.value = true
    }
  } else {
    clearForm()
  }
}

const clearForm = () => {
  Object.keys(state.value).forEach(key => {
    state.value[key] = null
  })
  state.value.title = ''
  state.value.description = ''
  showDetails.value = false
  if (tiptapEditor.value?.editor) {
    tiptapEditor.value.editor.commands.clearContent()
  }
}

const handleCompanyAdded = async () => {
  await companyStore.fetchCompanies()
  isModalOpen.value = false
  const addedCompany = companies.value[companies.value.length - 1]
  state.value.company = { label: addedCompany.name, value: addedCompany.id }
}

const handleCategoryAdded = async () => {
  await categoryStore.fetchCategories()
  isModalOpen.value = false
  const addedCategory = categories.value[categories.value.length - 1]
  state.value.category = { label: addedCategory.name, value: addedCategory.id }
}

const handleLocationAdded = async () => {
  await locationStore.fetchLocations()
  isModalOpen.value = false
  const addedLocation = locations.value[locations.value.length - 1]
  state.value.location = { label: addedLocation.name, value: addedLocation.id }
}

watch(() => props.jobSlug, fetchJobDetails, { immediate: true })

onMounted(async () => {
  await fetchJobDetails()
  await Promise.all([
    companyStore.fetchCompanies(),
    categoryStore.fetchCategories(),
    locationStore.fetchLocations()
  ])
})
</script>