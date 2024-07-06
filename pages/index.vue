<template>
  <div>
    <Hero />
    <CustomContainer>
      <div class="flex gap-[28px]">
        <div class="w-1/4">
          <Filters /><TiptapEditor/>
        </div>
        <div class="w-3/4">
          <AddJob @jobCreated="fetchJobs" />
          <JobList 
            :jobs="paginatedJobs" 
            :loading="loading" 
            :error="error" 
            :hasMoreItems="hasMoreItems" 
            @incrementItemsPerPage="incrementItemsPerPage" 
          />
        </div>
        </div>
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
const { loading, error, paginatedJobs, totalPages, currentPage } = storeToRefs(jobStore)

const incrementItemsPerPage = () => {
  jobStore.itemsPerPage += 10;
};

const hasMoreItems = computed(() => {
  return jobStore.itemsPerPage < jobStore.totaljobs;
});

const fetchJobs = async () => {
  await jobStore.fetchJobs()
}

onMounted(async () => {
  await fetchJobs()
  await categoryStore.fetchCategories()
  await locationStore.fetchLocations()
})

</script>
