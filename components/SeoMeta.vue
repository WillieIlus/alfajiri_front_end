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
    default: '/Banner (1)-03.jpg',
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

const sanitizeDescription = (desc) => {
  return desc.replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...'
}

useSeoMeta({
  title: () => props.title,
  ogTitle: () => props.title,
  description: () => sanitizeDescription(props.description),
  ogDescription: () => sanitizeDescription(props.description),
  ogImage: () => fullImagePath.value,
  ogUrl: () => fullPath.value,
  ogType: () => props.type,
  twitterCard: 'summary_large_image',
  twitterSite: () => props.twitterSite,
  twitterTitle: () => props.title,
  twitterDescription: () => sanitizeDescription(props.description),
  twitterImage: () => fullImagePath.value,
  canonical: () => fullPath.value,
})
</script>