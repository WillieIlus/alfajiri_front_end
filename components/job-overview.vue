<template>
  <div v-if="loading">
    loading ...
  </div>
  <div v-else-if="error">
    error ...
  </div>
  <div v-else class="space-y-6">
    <div v-if="job">
      <h3 class="font-semibold text-xl">
        Job Overview
      </h3>
      <UCard class="mb-6">
        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-globe-europe-africa" size="xl" class="py-4 bg-purple-500" />
          <div class="">
            <h5 class="font-semibold text-xl">
              Date Posted:
            </h5>
            <p class="font-l font-thin text-sm">
              {{ job?.timesince || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-globe-europe-africa" size="xl" class="py-4 bg-purple-500" />
          <div class="">
            <h5 class="font-semibold text-xl">
              Days Left:
            </h5>
            <p class="font-l font-thin text-sm">
              {{ job?.days_left || "Not Specified" }}
            </p>
          </div>
        </div>


        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-globe-europe-africa" size="xl" class="py-4 bg-purple-500" />
          <div class="">
            <h5 class="font-semibold text-xl">
              Salary:
            </h5>
            <p class="font-l font-thin text-sm">
              {{ job?.min_salary || "Not Specified" }} -
              {{ job?.max_salary || "Not Specified" }}
            </p>
          </div>
        </div>


        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-globe-europe-africa" size="xl" class="py-4 bg-purple-500" />
          <div class="">
            <h5 class="font-semibold text-xl">
              Category:
            </h5>
            <p class="font-l font-thin text-sm">
              {{ job?.get_category || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-globe-europe-africa" size="xl" class="py-4 bg-purple-500" />
          <div class="">
            <h5 class="font-semibold text-xl">
              Company:
            </h5>
            <p class="font-l font-thin text-sm">
              {{ job?.get_company || "Not Specified" }}
            </p>
          </div>
        </div>

        <div class="p-4 flex items-start gap-4">
          <UIcon name="i-heroicons-globe-europe-africa" size="xl" class="py-4 bg-purple-500" />
          <div class="">
            <h5 class="font-semibold text-xl">
              Location:
            </h5>
            <p class="font-l font-thin text-sm">
              {{ job?.address || "Not Specified" }}, {{ job?.get_location || "Not Specified" }}
            </p>
          </div>
        </div>
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
