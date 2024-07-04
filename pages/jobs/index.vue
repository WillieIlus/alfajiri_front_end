<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <SearchFilter />
  <CustomContainer>
    <div class="flex gap-[28px]">
      <div class="w-1/4">
        <Filters />
      </div>
      <div class="w-3/4">
        <div v-if="loading">
          loading...
        </div>
        <div v-else-if="error">
          error
        </div>
        <div v-else>
          <JobList 
            :jobs="paginatedJobs" 
            :loading="loading" 
            :error="error" 
            :hasMoreItems="hasMoreItems" 
            @incrementItemsPerPage="incrementItemsPerPage" 
          />
        </div>
      </div>
    </div>
  </CustomContainer>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useJobStore } from '~/store/jobs';
import { useCategoryStore } from '~/store/categories';
import { useLocationStore } from '~/store/locations';
import { storeToRefs } from 'pinia';

const categoryStore = useCategoryStore();
const locationStore = useLocationStore();
const jobStore = useJobStore();
const route = useRoute();

const { categories } = storeToRefs(categoryStore);
const { locations } = storeToRefs(locationStore);
const { loading, error, paginatedJobs, totalPages, currentPage } = storeToRefs(jobStore);

const incrementItemsPerPage = () => {
  jobStore.itemsPerPage += 10;
};

const hasMoreItems = computed(() => {
  return jobStore.itemsPerPage < jobStore.totaljobs;
});

const crumbTitle = 'Job List';

const breadcrumbs = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Job List',
  icon: 'i-heroicons-square-3-stack-3d'
}];

onMounted(async () => {
  await jobStore.fetchJobs();
  await categoryStore.fetchCategories();
  await locationStore.fetchLocations();
});
</script>
