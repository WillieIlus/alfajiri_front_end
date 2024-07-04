<template>
  <div v-if="loading">
    loading ... </div>
  <div v-else-if="error">
    error </div>
  <div v-else>
    <UCard v-for="job in jobs" :key="job.id" class="" >
      <ULink :to="'/jobs/' + job.slug">
      <div class="flex items-center justify-between">
        <div class="w-7/12">
          <!-- Replace this with your actual logo -->
          <img src="~/assets/images/logo.png" alt="Logo" class="min-h-10 max-h-14">
        </div>
        <div class="w-5/12 text-right">
          <UButton color="emerald" class=" px-9 py-3 ">
            {{ job?.get_job_type || " " }}
          </UButton>
          <p class="text-torea-bay-900 dark:text-torea-bay-200  text-xs font-light mt-2">
            {{ job?.timesince || " " }}
          </p>
        </div>
      </div>
      <div class="mt-4">
        <div class="text-xl font-bold text-torea-bay-950 dark:text-torea-bay-400">
          {{ job?.title || 'Not Specified' }}
        </div>
        <div class="text-carnation-600 dark:text-carnation-300 mt-2 flex items-center">
          <span class="mr-1">
            <UIcon name="i-heroicons-map-pin-20-solid" />
          </span>
          <span class="p p-">{{ job?.address || "" }}, {{ job?.get_location || "" }} </span>
        </div>
      </div>
      </ULink>
    </UCard>
  </div>
</template>

<script setup>

const props = defineProps({
  jobs: {
    type: Array,
    // required: true,
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