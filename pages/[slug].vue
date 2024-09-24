<template>
  <SeoMeta :title="job?.title ? `${job.title} | Alfajiri Jobs` : 'Alfajiri Jobs'"
    :description="sanitizeDescription(job?.truncated_description)" :image="job?.get_company?.logo || defaultImage"
    :url="`https://alfajirijobs.com/${job?.slug}`" type="article" :structuredData="structuredData" />

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
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useJobStore } from '~/store/jobs'
import { useRuntimeConfig } from '#app'

import fullImagePath from '~/assets/images/background.jpg'

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const jobStore = useJobStore()
const { job, loading, error } = storeToRefs(jobStore)

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

const sanitizeDescription = (desc) => {
  if (!desc) return ''
  return desc.replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...'
}

onMounted(fetchJobData)

const structuredData = computed(() => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": job.value?.title,
  "description": sanitizeDescription(job.value?.description),
  "datePosted": job.value?.created_at,
  "validThrough": job.value?.deadline,
  "employmentType": job.value?.job_type,
  "hiringOrganization": {
    "@type": "Organization",
    "name": job.value?.get_company?.name,
    "sameAs": job.value?.get_company?.website || baseUrl
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": job.value?.get_location
    }
  },
  "baseSalary": job.value?.min_salary && job.value?.max_salary ? {
    "@type": "MonetaryAmount",
    "currency": job.value?.currency,
    "value": {
      "@type": "QuantitativeValue",
      "minValue": job.value?.min_salary,
      "maxValue": job.value?.max_salary,
      "unitText": job.value?.salary_type === "PM" ? "MONTH" : "YEAR"
    }
  } : undefined
}))

watch(() => route.params.slug, fetchJobData)

</script>