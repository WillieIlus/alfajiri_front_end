<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <div class="flex gap-8">
      <div class="flex-1 w-full lg:w-2/3">
        <JobDetails :error="error" :loading="loading" :job="job"/>
      </div>
      <div class="flex-1 w-full  lg:w-1/3">
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
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const jobStore = useJobStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()

const { job, jobs, loading, error } = storeToRefs(jobStore)
const { fetchJob, fetchJobsByCategory } = jobStore

const breadcrumbs = computed(() => [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: 'Job List',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/jobs'
  },
  {
    label: job.value?.title || 'Job Details',
    icon: 'i-heroicons-square-3-stack-3d',
  }
])

const crumbTitle = computed(() => job.value?.title || 'Job Details')

onMounted(async () => {
  await fetchJob(route.params.slug)
  if (job.value && job.value.category) {
    await fetchJobsByCategory(job.value.category.slug)
  }
})

watch(() => job.value, (newJob) => {
  console.log('Job data updated:', newJob)
})

</script>

<!-- <template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <div class="flex gap-8">
      <div class="flex-1 w-full lg:w-2/3">
        <JobDetails :error="error" :loading="loading" :job="job"/>
      </div>
      <div class="flex-1 w-full  lg:w-1/3">
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

const route = useRoute()
const router = useRouter()

const jobStore = useJobStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()

const { job, jobs, loading, error } = storeToRefs(jobStore)
const { fetchJob, fetchJobsByCategory } = jobStore

const breadcrumbs = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Job List',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/jobs'
},{
  label: 'Job List',
  icon: 'i-heroicons-square-3-stack-3d',
}]

const crumbTitle = 'Job Title'

onMounted(async () => {
  await fetchJob(route.params.slug)
  await fetchJobsByCategory(job.value.category.slug)
})

</script> -->
