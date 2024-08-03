 <template>
  <div v-if="loading">
    Loading ...
  </div>
  <div v-else-if="error">
    Error: {{ error }}
  </div>
  <div v-else-if="job" class="space-y-6">
    <h3 class="font-semibold text-xl">
      Job Overview
    </h3>
    <UCard class="mb-6">
      <div class="p-4 flex items-start gap-4">
        <UIcon name="i-heroicons-calendar" size="xl" class="py-4 bg-purple-500" variant="soft" />
        <div>
          <h5 class="font-semibold text-xl">
            Date Posted:
          </h5>
          <p class="font-light text-sm">
            {{ job.timesince || "Not Specified" }}
          </p>
        </div>
      </div>

      <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-clock" size="xl" class="py-4 bg-purple-500" variant="soft" />
          <div>
            <h5 class="font-semibold text-xl">
              Days Left:
            </h5>
            <p class="font-light text-sm">
              {{ job?.days_left || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-currency-dollar" size="xl" class="py-4 bg-purple-500" variant="soft" />
          <div>
            <h5 class="font-semibold text-xl">
              Salary:
            </h5>
            <p class="font-light text-sm">
              {{ job?.min_salary || "Not Specified" }} -
              {{ job?.max_salary || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-tag" size="xl" class="py-4 bg-purple-500" variant="soft" />
          <div>
            <h5 class="font-semibold text-xl">
              Category:
            </h5>
            <p class="font-light text-sm">
              {{ job?.get_category || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-building-office-2" size="xl" class="py-4 bg-purple-500" variant="soft" />
          <div>
            <h5 class="font-semibold text-xl">
              Company:
            </h5>
            <p class="font-light text-sm">
              {{ job.get_company?.name || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-map-pin" size="xl" class="py-4 bg-purple-500" variant="soft" />
          <div>
            <h5 class="font-semibold text-xl">
              Location:
            </h5>
            <p class="font-light text-sm">
              {{ job?.address || "Not Specified" }}, {{ job?.get_location || "Not Specified" }}
            </p>
          </div>
        </div>
        <UButton class="mt-6" label="apply for job" block icon="i-heroicons-clipboard-document-list" size="sm" color="primary"
         variant="solid" @click="showModal = true"
        :disabled="loading" />
    </UCard>

  <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Apply for {{ job?.title || 'Job' }}</h3>
        </template>
        <JobApplicationForm 
          :job-id="job.id" 
          @application-submitted="onApplicationSubmitted"
        />
      </UCard>
    </UModal>
  </div>
  <div v-else>
    No job data available.
  </div>
</template>

<script setup>
import { ref} from 'vue'
import backgroundImage from '~/assets/images/background.jpg'

const jobStyle = {
  backgroundImage: `url(${backgroundImage})`
}

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

const showModal = ref(false)


const onApplicationSubmitted = () => {
  showModal.value = false
  emit('refresh-job-data')
}

const emit = defineEmits(['refresh-job-data'])

watch(() => props.job, (newJob) => {
  console.log('Job prop updated in JobOverview:', newJob)
})

</script>
