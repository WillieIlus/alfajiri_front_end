<template>
  <div>
    <div v-if="loading" class="text-center my-4">
      <spinner size="lg" :fullScreen="true" />
    </div>
    <div v-else-if="error" class="text-center my-4 text-red-500">{{ error }}</div>
    <div v-else-if="jobs.length === 0" class="text-center my-4">No jobs found.</div>
    <div v-else>
      <ul>
        <li v-for="job in jobs" :key="job.slug">
          <UCard class="my-5 p-5 bg-white dark:bg-gray-700 shadow-lg rounded-lg transition transform hover:scale-105">
            <div class="flex flex-col md:flex-row gap-6 items-start">
              <img class="m-5 w-full md:w-[16%] md:rounded-lg rounded-full mx-auto object-cover overflow-hidden"
                :src="job.get_company.logo || noLogo" :alt="job.get_company.name" width="512" height="512" />
              <div class="text-center md:text-left space-y-4 flex-grow">
                <div class="flex justify-center md:justify-between items-center">
                  <div class="flex-grow">
                    <NuxtLink :to="`/${job.slug}`" class="font-semibold text-2xl text-gray-900 dark:text-gray-100">
                      {{ job?.title || ' ' }}
                    </NuxtLink>
                  </div>
                  <div class="flex items-center justify-center md:ml-auto gap-2">
                    <UButton :to="`/${job.slug}`" color="primary">
                      View Details
                    </UButton>
                    <UButton @click="$emit('editJob', job.slug)" color="yellow">
                      Edit
                    </UButton>
                  </div>
                </div>
                <div class="flex justify-center md:justify-between items-center">
                  <div class="flex-grow">

                    <div class="font-light text-xs text-gray-600 dark:text-gray-300 flex">
                      <span class="flex items-center px-2">
                        <UIcon name="i-heroicons-adjustments-horizontal" class="pr-9 text-torea-bay-400 text-2xl" />
                        {{ job?.get_category || ' ' }}
                      </span>
                      <span class="flex items-center px-2">
                        <UIcon name="i-heroicons-map-pin" class="pr-9 text-torea-bay-400 text-2xl" />
                        {{ job?.address ? job.address + ', ' : '' }}{{ job?.get_location || ' ' }}
                      </span>
                      <span class="flex items-center px-4">
                        <UIcon name="i-heroicons-eye" class="pr-9 text-torea-bay-400 text-2xl" />
                        {{ job?.view_count || '' }}
                      </span>

                    </div>
                  </div>
                  <div class="flex flex-col items-center md:ml-auto">
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ job?.timesince || '' }} ago</p>
                  </div>
                </div>

                <div class="text-gray-700 dark:text-gray-300 prose max-w-none dark:prose-invert">
                  <p v-html="job?.truncated_description || '&nbsp;'"></p>
                </div>

              </div>
            </div>
          </UCard>
        </li>
      </ul>
      <div v-if="hasMoreItems" class="mt-4">
        <UButton @click="$emit('incrementItemsPerPage')" color="primary" variant="outline">
          Load More
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import noLogo from '@/assets/images/no-image-01.jpg'

const router = useRouter()
const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
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
