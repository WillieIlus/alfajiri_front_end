<template>
  <div>
    <div v-if="loading" class="text-center my-4">Loading...</div>
    <div v-else-if="error" class="text-center my-4 text-red-500">{{ error }}</div>
    <div v-else-if="jobs.length === 0" class="text-center my-4">No jobs found.</div>
    <div v-else>
      <UCard v-for="job in jobs" :key="job.id"
        class="my-5 p-5 bg-white dark:bg-gray-700 shadow-lg rounded-lg transition transform hover:scale-105">
        <div class="flex flex-col md:flex-row gap-6 items-start">
          <img class="w-full md:w-[33%] md:rounded-lg rounded-full mx-auto shadow-md object-cover overflow-hidden"
            :src="logoSrc" alt="Company Logo" width="512" height="512" />
          <div class="text-center md:text-left space-y-4 flex-grow">
            <div class="flex justify-center md:justify-between items-center">
              <div class="flex-grow">
                <h2 class="font-semibold text-2xl text-gray-900 dark:text-gray-100">
                  {{ job?.title || ' ' }}
                </h2>
              </div>
              <div class="flex flex-col items-center md:ml-auto">
                <UButton block class="px-6">
                  details
                </UButton>
              </div>
            </div>
            <div class="flex justify-center md:justify-between items-center">
              <div class="flex-grow">
                <div class="font-light text-xs text-gray-600 dark:text-gray-300 flex">
                  <span class="flex items-center px-2">
                    <UIcon name="i-heroicons-adjustments-horizontal" class="pr-1" />{{ job?.get_category || ' ' }}
                  </span>
                  <span class="flex items-center px-2">
                    <UIcon name="i-heroicons-map-pin" class="pr-1" />{{ job?.address || '' }}, {{ job?.get_location || ' ' }}
                  </span>
                  <span class="flex items-center px-2">
                    <UIcon name="i-heroicons-eye" class="pr-1" /> {{ job?.view_count || '' }}
                  </span>
                </div>
              </div>
              <div class="flex flex-col items-center md:ml-auto">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ job?.timesince || '' }} ago</p>
              </div>
            </div>

            <div class="text-gray-700 dark:text-gray-300">
              <p>
                {{ job?.truncated_description || ' ' }}
              </p>
            </div>

          </div>
        </div>
      </UCard>
      <UButton v-if="hasMoreItems" @click="incrementItemsPerPage">Show more</UButton>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  jobs: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hasMoreItems: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['incrementItemsPerPage']);

const incrementItemsPerPage = () => {
  emit('incrementItemsPerPage');
};
</script>
