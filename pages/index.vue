<template>
  <div>
    <Hero />
    <CustomContainer>
      <div class="flex gap-[28px]">
        <div class="lg:hidden">
          <SlideOver v-model:isOpen="isSlideOverOpen" />
        </div>
        <div class="hidden lg:block">
          <Filters v-model:title="searchTitle" v-model:location="selectedLocation" v-model:category="selectedCategory"
            v-model:company="selectedCompany" v-model:minSalary="minSalary" v-model:maxSalary="maxSalary"
            v-model:jobType="jobType" v-model:vacancies="vacancies" />
        </div>
        <div class="w-full lg:w-3/4">
          <div class="block lg:hidden">
            <UButton class="px-4 mb-2" icon="i-heroicons-adjustments-horizontal" size="sm" color="primary"
              variant="solid" label="Filters" :trailing="false" @click="isSlideOverOpen = !isSlideOverOpen" />
          </div>
          <JobForm :jobSlug="currentJobSlug" @jobCreated="handleJobCreated" @jobUpdated="handleJobUpdated" />
          <JobList :jobs="paginatedJobs" :loading="loading" :error="error" :hasMoreItems="hasMoreItems"
            :refreshing="refreshing" @incrementItemsPerPage="incrementItemsPerPage" @editJob="editJob"
            @refreshData="refreshData" :totalJobs="totalJobs"/>
        </div>
      </div>
    </CustomContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useJobStore } from '~/store/jobs'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'

const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const jobStore = useJobStore()
const { loading, error, paginatedJobs, hasMoreItems, totalJobs } = storeToRefs(jobStore)

const searchTitle = ref('')
const selectedLocation = ref('')
const selectedCategory = ref('')
const selectedCompany = ref('')
const minSalary = ref(null)
const maxSalary = ref(null)
const jobType = ref('')
const vacancies = ref(null)

const currentJobSlug = ref(null)
const isSlideOverOpen = ref(false)
const refreshing = ref(false)

const incrementItemsPerPage = () => {
  jobStore.itemsPerPage += 10
}

// const hasMoreItems = computed(() => {
//   return jobStore.itemsPerPage < jobStore.totalJobs
// })

const fetchJobs = async () => {
  await jobStore.fetchJobs()
}

const editJob = (jobSlug) => {
  currentJobSlug.value = jobSlug
}

// const handleJobCreated = async () => {
//   await fetchJobs()
//   currentJobSlug.value = null
// }

// const handleJobUpdated = async () => {
//   await fetchJobs()
//   currentJobSlug.value = null
// }

const handleJobCreated = async () => {
  await performSearch()
  currentJobSlug.value = null
}

const handleJobUpdated = async () => {
  await performSearch()
  currentJobSlug.value = null
}

const performSearch = async () => {
  try {
    const filters = {
      title: searchTitle.value,
      location: selectedLocation.value,
      category: selectedCategory.value,
      company: selectedCompany.value,
      min_salary: minSalary.value,
      max_salary: maxSalary.value,
      job_type: jobType.value,
      vacancies: vacancies.value,
    }

    const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})

    await jobStore.fetchJobs(cleanedFilters)
  } catch (error) {
    console.error('Error performing search:', error)
  }
}

const debouncedSearch = useDebounceFn(performSearch, 300)

watch([searchTitle, selectedLocation, selectedCategory, selectedCompany, minSalary, maxSalary, jobType, vacancies], debouncedSearch)

const applyFilters = () => {
  jobStore.setFilters({
    title: searchTitle.value,
    location: selectedLocation.value,
    category: selectedCategory.value,
    company: selectedCompany.value,
    min_salary: minSalary.value,
    max_salary: maxSalary.value,
    job_type: jobType.value,
    vacancies: vacancies.value,
  })
}

const refreshData = async () => {
  refreshing.value = true
  try {
    await performSearch()
  } catch (e) {
    console.error("Failed to refresh data:", e)
  } finally {
    refreshing.value = false
  }
}

onMounted(async () => {
  await performSearch()
  await fetchJobs()
  await categoryStore.fetchCategories()
  await locationStore.fetchLocations()
})

// Compute meta description
const metaDescription = computed(() => {
  return `Find the latest job opportunities on Alfajirijobs. Browse through more than 93,178+ job listings in various categories and locations.`
})

// Use Nuxt 3's useHead composable for meta tags
useHead({
  title: 'Latest Job Listings - Alfajirijobs',
  meta: [
    { name: 'description', content: metaDescription.value },
    { property: 'og:title', content: 'Latest Job Listings - Alfajirijobs' },
    { property: 'og:description', content: metaDescription.value },
    { property: 'og:url', content: 'https://alfajirijobs.com' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://alfajirijobs.com/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Latest Job Listings - Alfajirijobs' },
    { name: 'twitter:description', content: metaDescription.value },
    { name: 'twitter:image', content: 'https://alfajirijobs.com/twitter-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://alfajirijobs.com' }
  ]
})
</script>