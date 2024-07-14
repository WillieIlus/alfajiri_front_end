<template>
  <UCard>
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

        <UButton type="submit" :disabled="submitting">
          {{ jobSlug ? 'Update' : 'Submit' }}
        </UButton>
        <UButton variant="outline" class="ml-2" @click="clearForm">
          Clear
        </UButton>
        <p v-if="successMessage">{{ successMessage }}</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </UForm>
  </UCard>
  <!-- modal  -->
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <h3 class="text-xl font-semibold">{{ modalTitle }}</h3>
      </template>
      <CompanyForm v-if="activeModal === 'company'" @company-added="handleCompanyAdded" />
      <CategoryForm v-else-if="activeModal === 'category'" @category-added="handleCategoryAdded" />
      <LocationForm v-else-if="activeModal === 'location'" @location-added="handleLocationAdded" />
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
import { useRouter } from 'vue-router'

const toast = useToast()

const isModalOpen = ref(false)
const activeModal = ref('')
const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'company': return 'Add New Company'
    case 'category': return 'Add New Category'
    case 'location': return 'Add New Location'
    default: return ''
  }
})

const openModal = (type: 'company' | 'category' | 'location') => {
  activeModal.value = type
  isModalOpen.value = true
}

const props = defineProps({
  jobSlug: {
    type: String,
    default: null
  }
})

const router = useRouter()
const route = useRoute()
const jobStore = useJobStore()
const companyStore = useCompanyStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const accountStore = useAccountStore()
const emit = defineEmits(['jobCreated', 'jobUpdated'])

const { companies } = storeToRefs(companyStore)
const { categories } = storeToRefs(categoryStore)
const { locations } = storeToRefs(locationStore)

const fetchCompanies = async () => {
  await companyStore.fetchCompanies()
}

const fetchCategories = async () => {
  await categoryStore.fetchCategories()
}

const fetchLocations = async () => {
  await locationStore.fetchLocations()
}

const companyOptions = computed(() => {
  return (companies.value || []).map(company => ({
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

const tiptapEditor = ref(null)
const jobSlug = route.params.slug

const state = ref({
  company: null,
  category: null,
  location: null,
  title: '',
  description: '',
});

const schema = z.object({
  title: z.string().min(4, 'Must be at least 4 characters'),
  company: z.any(),
  category: z.any(),
  location: z.any(),
  description: z.string().min(26, 'Must be at least 26 characters'),
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
    console.log('Form data:', data);
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('company', data.company.value.toString())
    formData.append('category', data.category.value.toString())
    formData.append('location', data.location.value.toString())
    formData.append('description', data.description)

    console.log('FormData content:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    let response;
    if (props.jobSlug) {
      // Update existing job
      response = await jobStore.updateJob(props.jobSlug, Object.fromEntries(formData));
      successMessage.value = 'Job vacancy updated successfully!';
      emit('jobUpdated')
    } else {
      // Create new job
      response = await jobStore.createJob(formData);
      successMessage.value = 'Job vacancy added successfully!';
      emit('jobCreated')
    }

    errorMessage.value = ''
    toast.add({ title: successMessage.value, type: 'success' })
    clearForm()
  } catch (error) {
    successMessage.value = ''
    errorMessage.value = props.jobSlug ? 'Failed to update job vacancy.' : 'Failed to add job vacancy.'
    toast.add({ title: errorMessage.value, type: 'error' })
  } finally {
    submitting.value = false
  }
}

const fetchJobDetails = async () => {
  if (props.jobSlug) {
    await jobStore.fetchJob(props.jobSlug)
    if (jobStore.job) {
      state.value = {
        title: jobStore.job.title,
        company: { label: jobStore.job.company.name, value: jobStore.job.company.id },
        category: { label: jobStore.job.category.name, value: jobStore.job.category.id },
        location: { label: jobStore.job.location.name, value: jobStore.job.location.id },
        description: jobStore.job.description,
      }
      showDetails.value = true
    }
  } else {
    clearForm()
  }
}

const clearForm = () => {
  state.value = {
    company: null,
    category: null,
    location: null,
    title: '',
    description: '',
  };
  showDetails.value = false
  if (tiptapEditor.value && tiptapEditor.value.editor) {
    tiptapEditor.value.editor.commands.clearContent()
  }
}

const handleCompanyAdded = async (newCompany) => {
  await companyStore.fetchCompanies()
  isModalOpen.value = false
  const addedCompany = companies.value[companies.value.length - 1]
  state.value.company = { label: addedCompany.name, value: addedCompany.id }
}

const handleCategoryAdded = async (newCategory) => {
  await categoryStore.fetchCategories()
  isModalOpen.value = false
  const addedCategory = categories.value[categories.value.length - 1]
  state.value.category = { label: addedCategory.name, value: addedCategory.id }
}

const handleLocationAdded = async (newLocation) => {
  await locationStore.fetchLocations()
  isModalOpen.value = false
  const addedLocation = locations.value[locations.value.length - 1]
  state.value.location = { label: addedLocation.name, value: addedLocation.id }
}

watch(() => props.jobSlug, fetchJobDetails, { immediate: true })

onMounted(() => {
  fetchCompanies()
  fetchCategories()
  fetchLocations()
})
</script>