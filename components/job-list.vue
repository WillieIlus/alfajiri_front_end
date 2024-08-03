<template>
  <div class="container mx-auto">
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
          <UCard class="shadow-md hover:rounded-lg transition transform hover:scale-105">
            <div class="p-2">
              <div class="flex flex-col md:flex-row gap-6 items-start">
                <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <img class="w-full h-full object-cover object-center" :src="job.get_company?.logo || noLogo"
                    :alt="job.get_company?.name" />
                </div>
                <div class="flex-grow space-y-4">
                  <div>
                    <p class="text-sm font-light text-torea-bay-500 dark:text-torea-bay-400">
                      {{ job?.get_company?.name || 'Company Name' }}
                    </p>
                    <h2 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      <NuxtLink :to="`/${job.slug}`" class="hover:text-blue-600 dark:hover:text-blue-400">
                        {{ job?.title || ' ' }}
                      </NuxtLink>
                    </h2>
                  </div>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-map-pin-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.address ? job.address + ', ' : '' }}{{ job?.get_location || ' ' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-eye-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      Views: {{ job?.view_count || '1' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-heart-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      Bookmarks: {{ job?.bookmarks || '0' }}
                    </span>
                    <span v-if="job.applicants_count" class="flex items-center">
                      <UIcon name="i-heroicons-users-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      applicants: {{ job?.applicants || '' }}
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-4 text-sm">
                    <span class="flex items-center">
                      <UBadge color="primary" variant="soft">{{ job?.get_category || ' ' }}</UBadge>
                    </span>
                    <span class="flex items-center">
                      <UBadge color="orange" variant="soft">{{ job?.job_type || ' ' }}</UBadge>
                    </span>
                    <span class="flex items-center">
                      <UBadge color="primary" variant="soft"> vacancies: {{ job?.vacancies || '1' }}</UBadge>
                    </span>
                  </div>
                  <div class="text-torea-bay-500 dark:text-torea-bay-300  max-w-none">
                    <p v-html="job?.truncated_description || '&nbsp;'"></p>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-between items-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ job?.timesince || '' }} ago</p>
                <div class="flex items-center space-x-4">
                  <div
                    class="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    <BookmarkButton :job-post="job" />
                  </div>
                  <UButton label="apply for job" icon="i-heroicons-clipboard-document-list" size="sm" color="primary"
                    variant="solid" @click="openModal(job)" :disabled="loading" />
                  <UButton v-if="job.get_user === user.email" @click="$emit('editJob', job.slug)" color="yellow"
                    size="sm">
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </li>
      </ul>

      <UModal v-if="selectedJob" v-model="showModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Apply for {{ selectedJob.title }}</h3>
          </template>
          <JobApplicationForm :job-id="selectedJob.id" @application-submitted="onApplicationSubmitted" />
          <!-- <JobApplicationForm :job="selectedJob" @application-submitted="onApplicationSubmitted" /> -->
        </UCard>
      </UModal>


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
  // jobId: {
  //   type: [Number, String],
  //   required: true
  // },
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

const showModal = ref(false)
const selectedJob = ref(null)

const openModal = (job) => {
  selectedJob.value = job
  showModal.value = true
}
const onApplicationSubmitted = () => {
  showModal.value = false
  emit('refresh-job-data')
}

const emit = defineEmits(['incrementItemsPerPage', 'editJob', 'refreshData', 'refresh-job-data'])

onMounted(async () => {
  await accountStore.fetchCurrentUser()
})
</script>