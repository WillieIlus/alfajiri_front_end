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


// Compute meta description
const metaDescription = computed(() => {
  if (job.value) {
    return `${job.value.title} - ${job.value.company} - ${job.value.location}. ${job.value.description.substring(0, 150)}...`
  }
  return 'Find your next job opportunity with Alfajirijobs.'
})

// Compute canonical URL
const canonicalUrl = computed(() => {
  return `https://alfajirijobs.com/jobs/${route.params.slug}`
})

// Use Nuxt 3's useHead composable for dynamic meta tags
useHead(() => ({
  title: job.value ? `${job.value.title} - Alfajirijobs` : 'Job Details - Alfajirijobs',
  meta: [
    { name: 'description', content: metaDescription.value },
    { property: 'og:title', content: job.value ? `${job.value.title} - Alfajirijobs` : 'Job Details - Alfajirijobs' },
    { property: 'og:description', content: metaDescription.value },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: job.value?.company_logo || 'https://alfajirijobs.com/default-og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: job.value ? `${job.value.title} - Alfajirijobs` : 'Job Details - Alfajirijobs' },
    { name: 'twitter:description', content: metaDescription.value },
    { name: 'twitter:image', content: job.value?.company_logo || 'https://alfajirijobs.com/default-twitter-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl.value }
  ]
}))


</script>