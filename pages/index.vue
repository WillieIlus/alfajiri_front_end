<template>
  <div>
    <Hero />
    <CustomContainer>
      <div class="flex gap-[28px]">
        <div class="hidden w-full lg:block lg:w-1/4">
          <Filters />
        </div>
        <div class="w-full lg:w-3/4">
          <div class="block lg:hidden">
          <UButton class="px-4 mb-2"  icon="i-heroicons-adjustments-horizontal" size="sm" color="primary" variant="solid" label="Filters"  
            :trailing="false" />
            </div>
          <JobForm @jobCreated="fetchJobs" />
          <JobList :jobs="paginatedJobs" :loading="loading" :error="error" :hasMoreItems="hasMoreItems"
            @incrementItemsPerPage="incrementItemsPerPage" />
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
