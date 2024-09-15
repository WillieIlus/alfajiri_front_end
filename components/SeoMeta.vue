<!-- components/SeoMeta.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

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
    default: '/assets/images/Banner (1)-03.jpg',
  },
  type: {
    type: String,
    default: 'website',
  },
  twitterSite: {
    type: String,
    default: '@AlfajiriJobs',
  },
  slug: {
    type: String,
    default: '',
  },
  customUrl: {
    type: String,
    default: '',
  },
})

const fullPath = computed(() => {
  if (props.customUrl) {
    return `${runtimeConfig.public.siteUrl}${props.customUrl}`
  }
  if (props.slug) {
    return `${runtimeConfig.public.siteUrl}/${props.slug}`
  }
  return `${runtimeConfig.public.siteUrl}${route.fullPath}`
})

const fullImagePath = computed(() => {
  if (props.image.startsWith('http')) {
    return props.image
  }
  return `${runtimeConfig.public.siteUrl}${props.image}`
})

useSeoMeta({
  title: () => props.title,
  ogTitle: () => props.title,
  description: () => props.description,
  ogDescription: () => props.description,
  ogImage: () => fullImagePath.value,
  ogUrl: () => fullPath.value,
  ogType: () => props.type,
  twitterCard: 'summary_large_image',
  twitterSite: () => props.twitterSite,
  twitterTitle: () => props.title,
  twitterDescription: () => props.description,
  twitterImage: () => fullImagePath.value,
  canonical: () => fullPath.value,
})
</script>

<template>
  <!-- This component doesn't render anything visible -->
</template>