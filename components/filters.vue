<template>
  <div class="space-y-4">
    <!-- Job Title Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Job Title</h2>
      </template>
      <UInput v-model="title" placeholder="Search job titles" />
    </UCard>

    <!-- Location Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Location</h2>
      </template>
      <USelect v-model="location" :options="locationOptions" />
    </UCard>

    <!-- Category Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Category</h2>
      </template>
      <USelect v-model="category" :options="categoryOptions" />
    </UCard>

    <!-- Company Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Company</h2>
      </template>
      <USelect v-model="company" :options="companyOptions" />
    </UCard>

    <!-- Salary Range Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Salary Range</h2>
      </template>
      <div class="flex space-x-2">
        <UInput v-model="minSalary" type="number" placeholder="Min" />
        <UInput v-model="maxSalary" type="number" placeholder="Max" />
      </div>
    </UCard>

    <!-- Job Type Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Job Type</h2>
      </template>
      <URadio v-model="jobType" :options="jobTypeOptions" />
    </UCard>

    <!-- Vacancies Filter -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-2xl my-4">Vacancies</h2>
      </template>
      <UInput v-model="vacancies" type="number" placeholder="Minimum vacancies" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { useCompanyStore } from '~/store/companies'
import { useJobStore } from '~/store/jobs'

const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const companyStore = useCompanyStore()
const jobStore = useJobStore()

const { categories } = storeToRefs(categoryStore)
const { locations } = storeToRefs(locationStore)
const { companies } = storeToRefs(companyStore)

const title = ref('')
const location = ref('')
const category = ref('')
const company = ref('')
const minSalary = ref(null)
const maxSalary = ref(null)
const jobType = ref('')
const vacancies = ref(null)

const categoryOptions = computed(() => [
  { label: 'All Categories', value: '' },
  ...(categories.value?.map(cat => ({ label: cat.name, value: cat.id })) || [])
])

const locationOptions = computed(() => [
  { label: 'All Locations', value: '' },
  ...(locations.value?.map(loc => ({ label: loc.name, value: loc.id })) || [])
])

const companyOptions = computed(() => [
  { label: 'All Companies', value: '' },
  ...(companies.value?.map(comp => ({ label: comp.name, value: comp.id })) || [])
])

const jobTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Temporary', value: 'Temporary' },
  { label: 'Freelance', value: 'Freelance' },
]

const performSearch = () => {
  jobStore.fetchJobs({
    title: title.value,
    location: location.value,
    category: category.value,
    company: company.value,
    min_salary: minSalary.value,
    max_salary: maxSalary.value,
    job_type: jobType.value,
    vacancies: vacancies.value
  })
}

watch(
  [title, location, category, company, minSalary, maxSalary, jobType, vacancies],
  performSearch
)

onMounted(() => {
  categoryStore.fetchCategories()
  locationStore.fetchLocations()
  companyStore.fetchCompanies()
  jobStore.fetchJobs()
})
</script>