<template>
  <div>
    <!-- This div is empty as all meta tags will be added to the head -->
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  image: String,
  url: String,
  type: {
    type: String,
    default: 'website'
  },
  structuredData: Object
})

useHead({
  title: props.title,
  meta: [
    { name: 'description', content: props.description },
    // Open Graph
    { property: 'og:title', content: props.title },
    { property: 'og:description', content: props.description },
    { property: 'og:image', content: props.image },
    { property: 'og:url', content: props.url },
    { property: 'og:type', content: props.type },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.title },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: props.image },
  ],
  link: [
    { rel: 'canonical', href: props.url }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(props.structuredData)
    }
  ]
})
</script>