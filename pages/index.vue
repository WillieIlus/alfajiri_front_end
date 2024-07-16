<template>
  <div>
    <Hero />
    <CustomContainer>
      <div class="flex gap-[28px]">
        <div class="lg:hidden">
          <SlideOver v-model:isOpen="isSlideOverOpen"/>
        </div>
        <div class="hidden lg:block">
          <Filters />
        </div>
        <div class="w-full lg:w-3/4">
          <div class="block lg:hidden">
            <UButton class="px-4 mb-2" icon="i-heroicons-adjustments-horizontal" size="sm" color="primary"
              variant="solid" label="Filters" :trailing="false" @click="isSlideOverOpen = !isSlideOverOpen"/>
          </div>
          <JobForm 
            :jobSlug="currentJobSlug" 
            @jobCreated="handleJobCreated" 
            @jobUpdated="handleJobUpdated"
          />
          <JobList 
            :jobs="paginatedJobs" 
            :loading="loading" 
            :error="error" 
            :hasMoreItems="hasMoreItems"
            @incrementItemsPerPage="incrementItemsPerPage" 
            @editJob="editJob"
          />
        </div>
      </div>
    </CustomContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJobStore } from '~/store/jobs'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { storeToRefs } from 'pinia'

const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const jobStore = useJobStore()
const { loading, error, paginatedJobs, totalPages, currentPage } = storeToRefs(jobStore)

const currentJobSlug = ref(null)
const isSlideOverOpen = ref(false)

const incrementItemsPerPage = () => {
  jobStore.itemsPerPage += 10
}

const hasMoreItems = computed(() => {
  return jobStore.itemsPerPage < jobStore.totaljobs
})

const fetchJobs = async () => {
  await jobStore.fetchJobs()
}

const editJob = (jobSlug) => {
  currentJobSlug.value = jobSlug
}

const handleJobCreated = async () => {
  await fetchJobs()
  currentJobSlug.value = null
}

const handleJobUpdated = async () => {
  await fetchJobs()
  currentJobSlug.value = null
}

onMounted(async () => {
  await fetchJobs()
  await categoryStore.fetchCategories()
  await locationStore.fetchLocations()
})

// Compute meta description
const metaDescription = computed(() => {
  return `Find the latest job opportunities on Alfajirijobs. Browse through ${paginatedJobs.value.length} job listings in various categories and locations.`
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