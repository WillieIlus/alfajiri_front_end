<template>
  <div class="container mx-auto px-4">
    <div v-if="loading" class="flex justify-center items-center my-8">
      <spinner size="lg" :fullScreen="true" />
    </div>
    <div v-else-if="error || jobs.length === 0" class="text-center my-8">
      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
      <p v-else class="text-gray-600 dark:text-gray-400 mb-4">No jobs found.</p>
      <UButton @click="$emit('refreshData')" icon="i-heroicons-arrow-path" label="Refresh" :loading="refreshing" 
        class="bg-blue-500 hover:bg-blue-600 text-white" />
    </div>

    <div v-else>
      <ul class="space-y-6">
        <li v-for="job in jobs" :key="job.slug">
          <UCard class="shadow-lg hover:rounded-lg transition transform hover:scale-105">
            <div class="p-6">
              <div class="flex flex-col md:flex-row gap-6 items-start">
                <img class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg mx-auto md:mx-0"
                  :src="job.get_company?.logo || noLogo" :alt="job.get_company?.name" />
                <div class="flex-grow space-y-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {{ job?.get_company?.name || 'Company Name' }}
                    </p>
                    <h2 class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                      <NuxtLink :to="`/${job.slug}`" class="hover:text-blue-600 dark:hover:text-blue-400">
                        {{ job?.title || ' ' }}
                      </NuxtLink>
                    </h2>
                  </div>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-adjustments-horizontal-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.get_category || ' ' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-map-pin-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.address ? job.address + ', ' : '' }}{{ job?.get_location || ' ' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-eye-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.view_count || '1' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-bookmark-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.bookmarks || '0' }}
                    </span>
                  </div>
                  <div class="text-gray-700 dark:text-gray-300 prose max-w-none dark:prose-invert">
                    <p v-html="job?.truncated_description || '&nbsp;'" class="line-clamp-3"></p>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-between items-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ job?.timesince || '' }} ago</p>
                <div class="flex items-center space-x-4">
                  <div class="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    <BookmarkButton :job-post="job" />
                  </div>
                  <UButton :to="`/${job.slug}`" color="primary" size="sm">
                    View Details
                  </UButton>
                  <UButton v-if="job.get_user === user.email" @click="$emit('editJob', job.slug)" color="yellow" size="sm">
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </li>
      </ul>
      <div v-if="hasMoreItems" class="mt-8 text-center">
        <UButton @click="$emit('incrementItemsPerPage')" color="primary" variant="outline">
          Load More
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import noLogo from '~/assets/images/no-image-01.jpg'
import { useAccountStore } from '~/store/accounts'
import { useJobStore } from '~/store/jobs'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()
const jobStore = useJobStore()
const { user } = storeToRefs(accountStore)
const refreshing = ref(false)
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
  },
  refreshing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['incrementItemsPerPage', 'editJob', 'refreshData'])

onMounted(async () => {
  await accountStore.fetchCurrentUser()
})
</script>