<!-- components/SeoMeta.vue -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Alfajirijobs',
  },
  description: {
    type: String,
    default: 'Find the best jobs in Kenya first on Alfajiri Jobs. As the name "Alfajiri" (Swahili for "Early Morning") suggests, get your job listings early and be the first to apply. The early bird catches the worm! Explore job vacancies, career opportunities, employment listings, and job openings across various industries.',
  },
  image: {
    type: String,
    default: '/default-image.jpg',
  },
  type: {
    type: String,
    default: 'website',
  },
  twitterSite: {
    type: String,
    default: '@AlfajiriJobs', // Assuming this is your Twitter handle
  }
})

const runtimeConfig = useRuntimeConfig()

const fullPath = computed(() => {
  return `${runtimeConfig.public.siteUrl}${route.fullPath}`
})

useSeoMeta({
  title: () => props.title,
  ogTitle: () => props.title,
  description: () => props.description,
  ogDescription: () => props.description,
  ogImage: () => props.image,
  ogUrl: () => fullPath.value,
  ogType: () => props.type,
  twitterCard: 'summary_large_image',
  twitterSite: () => props.twitterSite,
  twitterTitle: () => props.title,
  twitterDescription: () => props.description,
  twitterImage: () => props.image,
  canonical: () => fullPath.value,
})
</script>

<template>
  <!-- This component doesn't render anything visible -->
</template>