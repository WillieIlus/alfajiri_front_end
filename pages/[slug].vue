<template>
      <SeoMeta 
      :title="job.title"
      :description="job.description"
      :image="job.image"
      :slug="`${job.slug}`"
      type="article"
    />
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="w-full lg:w-2/3">
        <JobDetails :error="error" :loading="loading" :job="job" />
      </div>
      <div class="w-full lg:w-1/3">
        <JobOverview :error="error" :loading="loading" :job="job" />
      </div>
    </div>
    <div class="mt-24">
      <JobList :jobs="relatedJobs" :loading="loading" :error="error" :hasMoreItems="false" />
    </div>
  </CustomContainer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useJobStore } from '~/store/jobs'

const route = useRoute()
const jobStore = useJobStore()
const { job, loading, error } = storeToRefs(jobStore)

const pageType = ref('article')
const baseUrl = 'https://alfajirijobs.com'
const defaultImage = `${baseUrl}/og-image.jpg`

const relatedJobs = computed(() => jobStore.relatedJobs || [])

const breadcrumbs = computed(() => [
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
  { label: job.value?.title || 'Job Details', icon: 'i-heroicons-briefcase' },
])

const crumbTitle = computed(() => job.value?.title || 'Job Details')

const fetchJobData = async () => {
  await jobStore.fetchJob(route.params.slug)
  if (job.value?.category) {
    await jobStore.fetchJobsByCategory(job.value.category.slug)
  }
}

onMounted(fetchJobData)

watch(() => route.params.slug, fetchJobData)
</script>