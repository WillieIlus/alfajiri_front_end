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
    <div class="mt-24">

      <JobList
      :jobs="relatedJobs || []" 
      :loading="loading" 
      :error="error"
      :hasMoreItems="false"  />
  </div>
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

const canonicalUrl = computed(() => {
  return `https://alfajirijobs.com/jobs/${route.params.slug}`
})

const baseUrl = 'https://alfajirijobs.com'
const defaultImage = `${baseUrl}/og-image.jpg`

const metaTitle = computed(() => job.value?.title ? `${job.value.title} - Alfajirijobs` : 'Job Details - Alfajirijobs')
const metaDescription = computed(() => job.value?.description ? `${job.value.description.substring(0, 160)}...` : 'Find the latest job opportunities on Alfajirijobs.')
const metaUrl = computed(() => job.value?.slug ? `${baseUrl}/jobs/${job.value.slug}` : baseUrl)
const metaImage = computed(() => job.value?.image || defaultImage)

watch(() => job.value, () => {
  updateMetadata()
})

const updateMetadata = () => {
  useSeoMeta({
    title: metaTitle.value,
    description: metaDescription.value,
    ogTitle: metaTitle.value,
    ogDescription: metaDescription.value,
    ogImage: metaImage.value,
    ogUrl: metaUrl.value,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: metaTitle.value,
    twitterDescription: metaDescription.value,
    twitterImage: metaImage.value,
  })

  useHead({
    link: [
      { rel: 'canonical', href: metaUrl.value }
    ]
  })
}

onMounted(async () => {
  await fetchJob(route.params.slug)
  updateMetadata()
  if (job.value && job.value.category) {
    await fetchJobsByCategory(job.value.category.slug)
  }
})

</script>