<!-- <template>
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
</script> -->
<!-- pages/jobs.vue -->
<template>
  <div>
    <h1>Job Listings</h1>
    
    <!-- Search input -->
    <input v-model="jobFilter.filters.title" placeholder="Search jobs...">
    
    <!-- Location filter -->
    <select v-model="jobFilter.filters.location">
      <option :value="null">All Locations</option>
      <option v-for="location in jobStore.locations" :key="location.id" :value="location.id">
        {{ location.name }}
      </option>
    </select>
    
    <!-- Category filter -->
    <select v-model="jobFilter.filters.category">
      <option :value="null">All Categories</option>
      <option v-for="category in jobStore.categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
    
    <!-- Salary range filter -->
    <input v-model.number="jobFilter.filters.minSalary" type="number" placeholder="Min Salary">
    <input v-model.number="jobFilter.filters.maxSalary" type="number" placeholder="Max Salary">
    
    <!-- Job type filter -->
    <select v-model="jobFilter.filters.jobType">
      <option :value="null">All Job Types</option>
      <option v-for="type in jobTypes" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>
    
    <!-- Job listings -->
    <div v-if="jobStore.loading">Loading...</div>
    <div v-else-if="jobStore.error">Error: {{ jobStore.error }}</div>
    <ul v-else>
      <li v-for="job in filteredJobs" :key="job.id">
        {{ job.title }} - {{ job.location.name }} - {{ job.category.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useJobStore } from '~/stores/jobStore'
import useJobFilter from '~/composables/useJobFilter'

const jobStore = useJobStore()
const jobFilter = useJobFilter()

const jobTypes = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
]

const filteredJobs = computed(() => {
  return jobFilter.applyFilters(jobStore.jobs)
})

onMounted(async () => {
  await Promise.all([
    jobStore.fetchJobs(),
    jobStore.fetchLocations(),
    jobStore.fetchCategories(),
  ])
})
</script>