<!-- <template>
  <div v-if="loading">
    Loading ...
  </div>
  <div v-else-if="error">
    Error ...
  </div>
  <div v-else class="space-y-6">
    <div v-if="job">
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
              {{ job?.timesince || "Not Specified" }}
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
        <ApplyJobButton :job="job" />
        <UButton block size='xl' label="Apply for the Job" class="my-5" />
      </UCard>
    </div>
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
</script>
 -->
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

      <JobApplicationForm :job="job" class="mt-5" />
    </UCard>
  </div>
  <div v-else>
    No job data available.
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const loading = ref(false)
const error = ref('')

// If you're fetching job data here, you might use something like this:
// const { data: job, pending: loading, error } = await useFetch(`/api/jobs/${props.jobId}`)
</script>
