<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="w-full lg:w-2/3">
        <JobDetails :error="error" :loading="loading" :job="job"/>
      </div>
      <div class="w-full lg:w-1/3">
        <JobOverview :error="error" :loading="loading" :job="job" />
      </div>
    </div>
    <JobList 
      :jobs="relatedJobs || []" 
      :loading="loading" 
      :error="error"
      :hasMoreItems="false"  />
  </CustomContainer>
</template>


<script setup>
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useJobStore } from '~/store/jobs'
import { ref, watch } from 'vue'

const route = useRoute()
const jobStore = useJobStore()
const { job, loading, error } = storeToRefs(jobStore)

const relatedJobs = computed(() => jobStore.relatedJobs || [])

const breadcrumbs = ref([
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
])
const crumbTitle = ref('Job Title')

const fetchJob = async() => {
  await jobStore.fetchJob(route.params.slug)
}

onMounted(async () => {
  await fetchJob()
})

watch(job, (newJob) => {
  if (newJob) {
    crumbTitle.value = newJob.title
    breadcrumbs.value = [
      { label: 'Home', icon: 'i-heroicons-home', to: '/' },
      { label: newJob.title, icon: 'i-heroicons-briefcase' },
    ]
  }
})
</script>