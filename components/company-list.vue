<template>
  <div v-if="loading">
    <spinner size="lg" :fullScreen="true" />
  </div>
  <div v-else-if="error">
    error
  </div>
  <div v-else class="flex flex-col items-center justify-center">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      <UCard
        v-for="company in companies"
        :key="company.slug"
        class="text-center flex flex-col items-center justify-center p-2 h-full"
      >
        <div class="font-thin text-sm mb-2 flex items-center justify-center">
          <img :src="company?.logo || noLogo" :alt="company?.name"  alt="Logo" class="min-h-10 max-h-14">
        </div>
        <div class="font-bold text-2xl mb-1">
          {{ company?.name || 'Finding Name' }}
        </div>
        <div class="font-normal text-xs mb-8">
          {{ company?.address || ' Not Specified' }}, {{ company?.get_location || '...' }}
        </div>
        <div>
          <UButton color="emerald" icon="i-heroicons-magnifying-glass" :to="`/companies/${company.slug}`" >
              Jobs Posted {{ company?.total_jobs }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>

import noLogo from '~/assets/images/no-image-01.jpg'

const props = defineProps({
  companies: {
    type: Array,
    // required: true,
    default: () => []
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