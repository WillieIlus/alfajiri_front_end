<template>
  <div v-if="loading">
    <spinner size="lg" :fullScreen="true" />
  </div>
  <div v-else-if="error">
    error
  </div>
  <div v-else>

    <UCard v-for="company in companies" :key="company.slug" class="text-center items-center justify-center w-full sm:w-full md:w-1/3 lg:w-1/3 p-2">
          <div class="font-thin text-sm mb-2 flex items-center justify-center">
            <img src="~/assets/images/Alfajiri jobs Logo-01.png" alt="Logo" class="min-h-10 max-h-14">
          </div>

          <div class="font-bold text-2xl mb-1">
            {{ company.name }}
          </div>
          <div class="font-normal text-xs mb-8">
            {{ company.address }}, {{ company.get_location }}
          </div>
          <div>
            <UButton color="emerald" icon="i-heroicons-magnifying-glass" >
             <ULink :to="`/companies/${company.slug}`">
               Jobs Posted {{ company.total_jobs }}
             </ULink>
            </UButton>
          </div>
      </UCard>
      
  </div>
</template>
<script setup>

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