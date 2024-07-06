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
    <UCard class="mb-6 h-64 p-0 overflow-hidden rounded-lg shadow-lg bg-cover bg-center bg-no-repeat" :style="jobStyle">
    </UCard>

    <UCard class="d bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 class="font-semibold text-2xl py-2 text-gray-900 dark:text-gray-100"> Job Description </h1>

      <div class="prose max-w-none dark:prose-invert text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
        v-html="job?.description || '&nbsp;'"></div>

    </UCard>
  </div>
</template>

<script setup>
import backgroundImage from '~/assets/images/background.jpg'

const jobStyle = {
  backgroundImage: `url(${backgroundImage})`
}

const props = defineProps({
  job: {
    type: Object,
    default: () => []
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
</script>
