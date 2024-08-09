<template>
  <div v-if="loading">
    <spinner size="lg" :fullScreen="true" />
  </div>
  <div v-else-if="error">
    error ...
  </div>
  <div v-else class="space-y-6">
    <h3 class="font-semibold text-xl">
      {{ job?.title || "Not Specified" }}
    </h3>
    <UCard class="mb-6 p-0 overflow-hidden rounded-lg shadow-lg" :style="jobStyle">
      <img :src="job?.image || defaultBackgroundImage" alt="Job Background" class="w-full h-auto object-cover" />
    </UCard>

    <UCard class="d bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 class="font-semibold text-2xl py-2 text-gray-900 dark:text-gray-100"> Job Description </h1>

      <div class="prose max-w-none dark:prose-invert text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
        v-html="job?.description || '&nbsp;'"></div>

    </UCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import defaultBackgroundImage from '~/assets/images/background.jpg'

const props = defineProps({
  job: {
    type: Object,
    default: () => ({})
  },
  error: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const jobStyle = computed(() => {
  const backgroundImage = props.job?.image || defaultBackgroundImage
  return {
    backgroundImage: `url(${backgroundImage})`,
    height: 'auto' // Ensures that the height adjusts to the image
  }
})
</script>
