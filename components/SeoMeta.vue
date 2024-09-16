<!-- components/SeoMeta.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useImage } from '#imports'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const image = useImage()

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Alfajirijobs',
  },
  description: {
    type: String,
    default: 'Find the best jobs in Kenya first on Alfajiri Jobs. As the name "Alfajiri" (Swahili for "Early Morning") suggests, get your job listings early and be the first to apply.',
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
  return image(props.image, { width: 1200, height: 630 })
})

useSeoMeta({
  title: () => props.title,
  ogTitle: () => props.title,
  description: () => props.description,
  ogDescription: () => props.description,
  // Explicitly set og:image
  ogImage: () => fullImagePath.value,
  // Also set these additional OG image properties
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => `Image for ${props.title}`,
  ogUrl: () => fullPath.value,
  ogType: () => props.type,
  twitterCard: 'summary_large_image',
  twitterSite: () => props.twitterSite,
  twitterTitle: () => props.title,
  twitterDescription: () => props.description,
  twitterImage: () => fullImagePath.value,
  canonical: () => fullPath.value,
  url: () => fullPath.value,
})
</script>