<template>
  <UCard class="mb-6">
    <h2 class="mb-4 font-bold text-2xl">{{ jobSlug ? 'Update Job Vacancy' : 'Add a new Job Vacancy' }}</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UFormGroup name="title" label="Title">
        <UInput v-model="form.title" @focus="checkAuth" />
      </UFormGroup>

      <div v-if="showDetails">
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
            <UFormGroup class="flex-auto" size="xl" name="company" label="Company">
              <UInputMenu v-model="form.company" :options="companyOptions" />
            </UFormGroup>
            <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('company')" />
          </div>

          <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
            <UFormGroup class="flex-auto" size="xl" name="category" label="Category">
              <UInputMenu v-model="form.category" :options="categoryOptions" />
            </UFormGroup>
            <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('category')" />
          </div>

          <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-nowrap gap-4 items-center">
            <UFormGroup class="flex-auto" size="xl" name="location" label="Location">
              <UInputMenu v-model="form.location" :options="locationOptions" />
            </UFormGroup>
            <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('location')" />
          </div>
        </div>

        <div class="flex flex-wrap">
          <UFormGroup class="w-full md:w-1/3 p-2" name="email" label="Email">
            <UInput v-model="form.email" placeholder="Enter email" />
          </UFormGroup>
          <UFormGroup class="w-full md:w-1/3 p-2" name="vacancies" label="Vacancies">
            <UInput v-model="form.vacancies" type="number" placeholder="Available positions" />
          </UFormGroup>
          <UFormGroup class="w-full md:w-1/3 p-2" name="address" label="Address">
            <UInput v-model="form.address" placeholder="Enter Specific Location" />
          </UFormGroup>
        </div>

        <UFormGroup name="description" label="Description">
          <TiptapEditor ref="tiptapEditor" :modelValue="form.description"
            @update:modelValue="form.description = $event" />
        </UFormGroup>

        <div v-if="!jobSlug">
          <!-- Additional job details -->
          <div class="flex flex-wrap">
            <UFormGroup class="w-full md:w-1/3 p-2" name="job_type" label="Job Type">
              <USelect v-model="form.job_type" :options="JOB_TYPE_CHOICES" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/3 p-2" name="image" label="Poster">
              <input type="file" @change="onImageChange" accept="image/*" ref="fileInput" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/3 p-2" name="work_experience" label="Work Experience">
              <UInput v-model="form.work_experience" placeholder="Required work experience" />
            </UFormGroup>
          </div>

          <!-- More additional fields -->
          <div class="flex flex-wrap">
            <UFormGroup class="w-full md:w-1/3 p-2" name="website" label="Website">
              <UInput v-model="form.website" placeholder="Enter website" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/3 p-2" name="phone" label="Phone">
              <UInput v-model="form.phone" placeholder="Enter phone" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/3 p-2" name="work_hours" label="Work Hours">
              <UInput v-model="form.work_hours" placeholder="Duration of work" />
            </UFormGroup>
          </div>

          <div class="flex flex-wrap">
            <UFormGroup class="w-full md:w-1/3 p-2" name="work_hour_type" label="Work Hour Type">
              <USelect v-model="form.work_hour_type" :options="WORK_HOUR_CHOICES" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/3 p-2" name="min_salary" label="Min Salary">
              <UInput v-model="form.min_salary" type="number" placeholder="Minimum salary" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/3 p-2" name="max_salary" label="Max Salary">
              <UInput v-model="form.max_salary" type="number" placeholder="Maximum salary" />
            </UFormGroup>
          </div>

          <div class="flex flex-wrap">
            <UFormGroup class="w-full md:w-1/2 p-2" name="salary_type" label="Salary Type">
              <USelect v-model="form.salary_type" :options="SALARY_TYPE_CHOICES" />
            </UFormGroup>
            <UFormGroup class="w-full md:w-1/2 p-2" name="currency" label="Currency">
              <USelect v-model="form.currency" :options="CURRENCY_CHOICES" />
            </UFormGroup>
          </div>
        </div>

        <ImagePreview :imageUrl="imagePreview" />

        <div class="pt-4">
          <UButton type="submit" :disabled="submitting">
            {{ jobSlug ? 'Update' : 'Submit' }}
          </UButton>
          <UButton variant="outline" class="ml-2" @click="clearForm">
            Clear
          </UButton>
        </div>
        <p v-if="successMessage">{{ successMessage }}</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </form>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import { useJobStore } from '~/store/jobs'
import { useCompanyStore } from '~/store/companies'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { useAccountStore } from '~/store/accounts'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const jobStore = useJobStore()
const companyStore = useCompanyStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const accountStore = useAccountStore()

const { companies } = storeToRefs(companyStore)
const { categories } = storeToRefs(categoryStore)
const { locations } = storeToRefs(locationStore)

const props = defineProps<{
  jobSlug?: string
}>()

const emit = defineEmits(['jobCreated', 'jobUpdated'])

const isModalOpen = ref(false)
const activeModal = ref('')
const tiptapEditor = ref(null)
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDetails = ref(false)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const JOB_TYPE_CHOICES = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Temporary', value: 'Temporary' },
  { label: 'Freelance', value: 'Freelance' },
]

const CURRENCY_CHOICES = [
  { label: 'Kenya Shilling', value: 'KSH' },
  { label: 'US Dollar', value: 'USD' },
  { label: 'Uganda Shilling', value: 'UGH' },
  { label: 'Tanzania Shilling', value: 'TSH' },
  { label: 'Euro', value: 'EUR' },
  { label: 'British Pound', value: 'GBP' },
]

const SALARY_TYPE_CHOICES = [
  { label: 'Per Hour', value: 'PH' },
  { label: 'Per Day', value: 'PD' },
  { label: 'Per Week', value: 'PW' },
  { label: 'Per Month', value: 'PM' },
  { label: 'Per Year', value: 'PY' },
]

const WORK_HOUR_CHOICES = [
  { label: 'Per Day', value: 'PD' },
  { label: 'Per Week', value: 'PW' },
  { label: 'Per Month', value: 'PM' },
  { label: 'Per Year', value: 'PY' },
]

const schema = z.object({
  title: z.string().min(4, 'Must be at least 4 characters'),
  company: z.object({ label: z.string(), value: z.number() }).nullable(),
  description: z.string().min(26, 'Must be at least 26 characters'),
  category: z.object({ label: z.string(), value: z.number() }).nullable(),
  location: z.object({ label: z.string(), value: z.number() }).nullable(),  
  job_type: z.enum(JOB_TYPE_CHOICES.map(choice => choice.value)).optional().nullish().or(z.literal('')),
  image: z.any().optional().refine(
    (val) => !val || (typeof File !== 'undefined' && val instanceof File),
    'Must be a File object'
  ),
  address: z.string().optional().nullish().or(z.literal('')),
  email: z.string().email('Invalid email'),
  website: z.string().url('Invalid URL').optional().nullish().or(z.literal('')),
  phone: z.string().optional().nullish().or(z.literal('')),
  vacancies: z.number().int('Must be an integer').positive('Must be positive').optional().nullish().or(z.literal('')),
  work_experience: z.number().int('Must be an integer').nonnegative('Must be non-negative').optional().nullish().or(z.literal('')),
  work_hours: z.number().int('Must be an integer').positive('Must be positive').optional().nullish().or(z.literal('')),
  work_hour_type: z.enum(WORK_HOUR_CHOICES.map(choice => choice.value)).optional().nullish().or(z.literal('')),
  min_salary: z.number().positive('Must be positive').optional().nullish().or(z.literal('')),
  max_salary: z.number().positive('Must be positive').optional().nullish().or(z.literal('')),
  salary_type: z.enum(SALARY_TYPE_CHOICES.map(choice => choice.value)).optional().nullish().or(z.literal('')),
  currency: z.enum(CURRENCY_CHOICES.map(choice => choice.value)).optional().nullish().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

const form = reactive<FormData>({
  title: '',
  company: null,
  category: null,
  location: null,
  description: '',
  job_type: '',
  image: undefined,
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

const onImageChange = (e: Event) => {
  if (typeof window !== 'undefined') {
    const target = e.target as HTMLInputElement
    if (target && target.files && target.files.length > 0) {
      form.image = target.files[0]
      imagePreview.value = URL.createObjectURL(target.files[0])
    }
  }
}

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'company': return 'Add New Company'
    case 'category': return 'Add New Category'
    case 'location': return 'Add New Location'
    default: return ''
  }
})

const companyOptions = computed(() => {
  const currentUserEmail = accountStore.user?.email
  return (companies.value || [])
    .filter(company => company.user?.email === currentUserEmail)
    .map(company => ({
      label: company.name,
      value: company.id
    }))
})

const categoryOptions = computed(() => {
  return (categories.value || []).map(category => ({
    label: category.name,
    value: category.id
  }))
})

const locationOptions = computed(() => {
  return (locations.value || []).map(location => ({
    label: location.name,
    value: location.id
  }))
})

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

const onSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const validatedData = await schema.parseAsync(form)

    const apiData = {
      ...validatedData,
      company: validatedData.company?.value,
      category: validatedData.category?.value,
      location: validatedData.location?.value,
    }

    console.log('Data to be sent to API:', apiData)

    const formData = new FormData()

    Object.entries(apiData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    const newJob = await jobStore.createJob(formData)

    successMessage.value = 'Job created successfully'
    emit('jobCreated', newJob)

    clearForm()

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Validation or submission error:', error)
    if (error instanceof z.ZodError) {
      errorMessage.value = error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join('\n')
    } else if (error.response && error.response.data) {
      const serverErrors = Object.entries(error.response.data)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n')
      errorMessage.value = `Server validation failed:\n${serverErrors}`
    } else {
      errorMessage.value = 'Failed to create Job'
    }
  } finally {
    submitting.value = false
  }
}


const fetchJobDetails = async () => {
  if (props.jobSlug) {
    await jobStore.fetchJob(props.jobSlug)
    if (jobStore.job) {
      Object.assign(form, jobStore.job)
      form.description = jobStore.job.description || ''

      // Properly set company, category, and location
      if (jobStore.job.company) {
        form.company = { label: jobStore.job.get_company.name, value: jobStore.job.company }
      }
      if (jobStore.job.category) {
        form.category = { label: jobStore.job.get_category, value: jobStore.job.category }
      }
      if (jobStore.job.location) {
        form.location = { label: jobStore.job.get_location, value: jobStore.job.location }
      }

      showDetails.value = true
    }
  } else {
    clearForm()
  }
}

const handleCompanyAdded = async () => {
  await companyStore.fetchCompanies()
  isModalOpen.value = false
  const addedCompany = companies.value[companies.value.length - 1]
  form.company = { label: addedCompany.name, value: addedCompany.id }
}

const handleCategoryAdded = async () => {
  await categoryStore.fetchCategories()
  isModalOpen.value = false
  const addedCategory = categories.value[categories.value.length - 1]
  form.category = { label: addedCategory.name, value: addedCategory.id }
}

const handleLocationAdded = async () => {
  await locationStore.fetchLocations()
  isModalOpen.value = false
  const addedLocation = locations.value[locations.value.length - 1]
  form.location = { label: addedLocation.name, value: addedLocation.id }
}

const clearForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = null
  })
  form.title = ''
  form.description = ''
  showDetails.value = false
  if (tiptapEditor.value?.editor) {
    tiptapEditor.value.editor.commands.clearContent()
  }
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