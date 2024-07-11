<template>
  <div>
    <Hero />
    <CustomContainer>
      <div class="flex gap-[28px]">
        <div class="hidden w-full lg:block lg:w-1/4">
          <Filters /><TiptapEditor/>
        </div>
        <div class="w-full lg:w-3/4">
          <UButton class="-mt-6 z-10 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-plus" size="sm" color="primary"
              :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal('company')" />
          <JobForm @jobCreated="fetchJobs" />
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
