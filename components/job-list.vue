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
      <h4 class="text-xl mb-6 ">
        {{ totalJobs }} Job{{ totalJobs !== 1 ? 's' : '' }} you May Like
      </h4>
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
                      {{ job?.view_count || '1' }} View{{ job?.view_count !== 1 ? 's' : '' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-heart-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.bookmarks || '0' }} Bookmark{{ job?.bookmarks !== 1 ? 's' : '' }}
                    </span>
                    <span class="flex items-center">
                      <UIcon name="i-heroicons-users-20-solid" class="w-5 h-5 mr-2 text-torea-bay-400" />
                      {{ job?.apply_count || '0' }} application{{ job?.apply_count !== 1 ? 's' : '' }}
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
                  <div class="text-torea-bay-500 dark:text-torea-bay-300 max-w-none">
                    <p v-html="job?.truncated_description || '&nbsp;'"></p>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex flex-wrap justify-between items-center">
                <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="flex items-center">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                    {{ job?.timesince || '' }} ago
                  </span>
                  <span class="text-gray-300 dark:text-gray-600">|</span>
                  <span class="flex items-center">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                    {{ job?.days_left > 0 ? `${job?.days_left} days left` : 'Closed' }}
                  </span>
                </div>
                <div class="flex items-center space-x-3 mt-3 sm:mt-0">
                  <UTooltip text="Bookmark">
                    <div
                      class="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                      <BookmarkButton :job-post="job" />
                    </div>
                  </UTooltip>
                  <UButton :label="job.days_left > 0 ? 'Apply' : 'Closed'" icon="i-heroicons-paper-airplane" size="sm"
                    :color="job.days_left > 0 ? 'primary' : 'red'" :variant="job.days_left > 0 ? 'solid' : 'soft'"
                    @click="handleApply(job)" :disabled="loading || job.days_left <= 0">
                  </UButton>
                  <UButton v-if="user && job.get_user === user.email" @click="$emit('editJob', job.slug)" color="yellow"
                    size="sm" icon="i-heroicons-pencil-square">
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
            <div :class="getJobBgClass(job)" class="min-w-full h-1 mt-3 -mb-6 -mx-6 rounded-b-lg"></div>
          </UCard>
        </li>
      </ul>

      <UModal v-if="selectedJob" v-model="showModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Apply for {{ selectedJob.title }}</h3>
          </template>
          <JobApplicationForm :job-id="selectedJob.id" @application-submitted="onApplicationSubmitted" />
        </UCard>
      </UModal>

      <div v-if="hasMoreItems" class="mt-8 text-center">
        <UButton v-if="hasMoreItems" @click="$emit('incrementItemsPerPage')">Load More</UButton>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import noLogo from '~/assets/images/no-image-01.jpg'
import { useAccountStore } from '~/store/accounts'
import { useJobStore } from '~/store/jobs'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()
const jobStore = useJobStore()
// const { user } = storeToRefs(accountStore)

const refreshing = ref(false)
const router = useRouter()

const user = computed(() => accountStore.user)

const showModal = ref(false)
const selectedJob = ref(null)

const handleApply = (job) => {
  if (job.days_left <= 0) {
    console.error('This job is no longer accepting applications');
    return;
  }

  if (job.application_contact && job.application_contact.startsWith('http')) {
    window.open(job.application_contact, '_blank', 'noopener,noreferrer');
  } else {
    openModal(job);
  }
}

const openModal = (job) => {
  selectedJob.value = job
  showModal.value = true
}

const onApplicationSubmitted = () => {
  showModal.value = false
  emit('refresh-job-data')
}

defineProps(['jobs', 'loading', 'error', 'hasMoreItems', 'refreshing', 'totalJobs'])
defineEmits(['incrementItemsPerPage', 'editJob', 'refreshData'])

onMounted(async () => {
  await accountStore.fetchCurrentUser()
})


const getJobBgClass = (job) => {
  if (job.days_left === null) {
    return 'bg-gray-500';
  } else if (job.days_left <= 0) {
    return 'bg-red-950';
  } else if (job.days_left > 10) {
    return 'bg-blue-500';
  } else if (job.days_left < 6) {
    return 'bg-orange-600';
  } else {
    return 'bg-green-500';
  }
}
</script>