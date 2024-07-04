<template>
  <CustomContainer>
    <div class="grid items-center text-center  ">
      <div class=" mb-6 font-bold text-4xl text-torea-bay-900 dark:text-torea-bay-500 ">Featured Jobs Listings</div>
      <p class="mb-20 font-normal text-sm text-torea-bay-600 dark:text-torea-bay-100 ">
        Surprisingly, there is a very vocal faction of the design community that wants to see filler text banished to
        the
        original sources from whence it came perhaps not surprisingly
      </p>
    </div>

    <div class="grid grid-cols-2 gap-8">
      <FeaturedJobList :jobs="jobs" :error="error" :loading="loading"/>
    </div>
    <UButton color="emerald" class="flex mx-auto px-10 py-4 my-16" variant="outline" label="Load more Listings" />
  </CustomContainer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useJobStore } from '~/store/jobs'
import { useCategoryStore } from '~/store/categories'
import { useLocationStore } from '~/store/locations'

const jobStore = useJobStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()

const { jobs, loading, error } = storeToRefs(jobStore)
const route = useRoute()
const router = useRouter()

const { fetchJob, fetchJobsByCategory } = jobStore

onMounted(async () => {
  await fetchJob(route.params.slug)
})

</script>