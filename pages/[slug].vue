<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <div class="flex gap-8">
      <div class="flex-1 md:flex-none md:w-2/3">
        <JobDetails :error="error" :loading="loading" :job="job"/>
      </div>
      <div class="flex-1 md:flex-none md:w-1/3">
        <JobOverview :error="error" :loading="loading" :job="job" />
      </div>
    </div>
    <JobList :jobs="jobs" :loading="loading" :error="error" />
  </CustomContainer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useJobStore } from '~/store/jobs'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const jobStore = useJobStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()

const { job, jobs, loading, error } = storeToRefs(jobStore)
const { fetchJob, fetchJobsByCategory } = jobStore

const breadcrumbs = ref([{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, 
])

const crumbTitle = ref('Job Title')

onMounted(async () => {
  await fetchJob(route.params.slug)
  await fetchJobsByCategory(job.value.category.slug)
})

watch(job, (newJob) => {
  if (newJob) {
    crumbTitle.value = newJob.title
    breadcrumbs.value.push({
      label: newJob.title,
      icon: 'i-heroicons-briefcase',
    })
  }
})
</script>
