<template>
  <div>
    <!-- <Hero /> -->
    <SearchFilter />
    <CustomContainer>
      <AddJob @jobCreated="fetchJobs" />
    </CustomContainer>
    <CustomContainer>
      <JobList :jobs="paginatedJobs" :loading="loading" :error="error" 
      :hasMoreItems="hasMoreItems"
      @incrementItemsPerPage="incrementItemsPerPage"
      />
    </CustomContainer>
    
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useJobStore } from '~/store/jobs'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { storeToRefs } from 'pinia'

const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const jobStore = useJobStore()
const { jobs, loading, error, paginatedJobs } = storeToRefs(jobStore)

const incrementItemsPerPage = () => {
  jobStore.itemsPerPage += 10
}

const hasMoreItems = computed(() => {
  return jobStore.itemsPerPage < jobStore.totalJobs
})

const fetchJobs = async () => {
  await jobStore.fetchJobs()
}

onMounted(async () => {
  await fetchJobs()
  await categoryStore.fetchCategories()
  await locationStore.fetchLocations()
})

</script>
