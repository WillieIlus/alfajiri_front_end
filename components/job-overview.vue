<template>
  <div v-if="loading" class="p-4">
    Loading ...
  </div>
  <div v-else-if="error" class="p-4 text-red-600">
    Error: {{ error }}
  </div>
  <div v-else-if="job" class="space-y-6 max-w-3xl mx-auto p-4">
    <h3 class="font-bold text-2xl mb-6">
      Job Overview
    </h3>
    <UCard class="mb-6">
      <div class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-calendar" class="text-3xl text-purple-500" />
        <div>
          <h5 class="font-semibold text-lg">
            Date Posted:
          </h5>
          <p class="text-gray-600">
            {{ job.timesince || "Not Specified" }}
          </p>
        </div>
      </div>

      <div class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-clock" class="text-3xl text-purple-500" />
        <div>
          <h5 class="font-semibold text-lg">
            Days Left:
          </h5>
          <p class="text-gray-600">
            {{ job?.days_left || "Not Specified" }}
          </p>
        </div>
      </div>

      <div class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-currency-dollar" class="text-3xl text-purple-500" />
        <div>
          <h5 class="font-semibold text-lg">
            Salary:
          </h5>
          <p class="text-gray-600">
            {{ job?.min_salary || "Not Specified" }} -
            {{ job?.max_salary || "Not Specified" }}
          </p>
        </div>
      </div>

      <div class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-tag" class="text-3xl text-purple-500" />
        <div>
          <h5 class="font-semibold text-lg">
            Category:
          </h5>
          <p class="text-gray-600">
            {{ job?.get_category || "Not Specified" }}
          </p>
        </div>
      </div>

      <div v-if="job && job.get_company" class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-building-office-2" class="text-3xl text-purple-500" />
        <div>
          <h5 class="font-semibold text-lg">Company:</h5>
          <p class="text-gray-600">{{ job?.get_company?.name || "Not Specified" }}</p>
        </div>
      </div>


      <div class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-map-pin" class="text-3xl text-purple-500" />
        <div>
          <h5 class="font-semibold text-lg">
            Location:
          </h5>
          <p class="text-gray-600">
            {{ job?.address || "Not Specified" }}, {{ job?.get_location || "Not Specified" }}
          </p>
        </div>
      </div>
      <UButton :label="props.job.days_left > 0 ? 'Apply' : 'Closed'" icon="i-heroicons-paper-airplane" size="sm"
        :color="props.job.days_left > 0 ? 'primary' : 'red'" :variant="props.job.days_left > 0 ? 'solid' : 'soft'"
        @click="handleApply" :disabled="loading || props.job.days_left <= 0">
      </UButton>

    </UCard>

    <UCard>
      <div class="flex items-center gap-4">
        <p class="font-medium">Share this post:</p>
        <SocialShare v-for="network in ['facebook', 'twitter', 'whatsapp', 'linkedin', 'email']" :key="network"
          :network="network" :url="`https://alfajirijobs.com/${job.slug}`" :title="`Check out this job: ${job.title}`"
          :description="truncatedDescription" :image="job.image || defaultImage" :styled="true" :label="false"
          class="p-2 rounded-full text-white hover:opacity-80 transition-opacity" />
      </div>
    </UCard>




    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Apply for {{ job?.title || 'Job' }}</h3>
        </template>
        <JobApplicationForm :job-id="job.id" @application-submitted="onApplicationSubmitted" />
      </UCard>
    </UModal>
  </div>
  <div v-else class="p-4 text-gray-600">
    No job data available.
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import defaultImage from '~/assets/images/background.jpg'

const router = useRouter()

const props = defineProps({
  job: {
    type: Object,
    required: true,
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


const handleApply = () => {
  if (props.job.application_contact && props.job.application_contact.startsWith('http')) {
    try {
      const newWindow = window.open(props.job.application_contact, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        throw new Error('Popup blocked');
      }
    } catch (error) {
      console.error('Failed to open application URL:', error);
      // Show a user-friendly message
    }
  } else if (props.job.application_contact === 'email') {
    openModal();
  } else {
    console.error('Invalid application contact method');
    // Show a user-friendly error message
  }
}

const showModal = ref(false)

const openModal = (job) => {
  if (job.days_left > 0) {
    selectedJob.value = job
    showModal.value = true
  }
}

const onApplicationSubmitted = () => {
  showModal.value = false
  emit('refresh-job-data')
}

const sanitizeDescription = (desc) => {
  if (!desc) return ''
  return desc.replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...'
}

// Compute the truncated description
const truncatedDescription = computed(() => {
  return sanitizeDescription(props.job?.truncated_description || '')
})

const emit = defineEmits(['refresh-job-data'])

watch(() => props.job, (newJob) => {
  console.log('Job prop updated in JobOverview:', newJob)
})
</script>