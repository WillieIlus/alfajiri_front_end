<template>
  <div id="title" class="w-full h-96 bg-torea-bay-800 flex items-center text-gray-200 relative">
    <CustomContainer class="text-center">
      <div class="font-bold text-3xl mb-6">
        Find Jobs Across these Companies
      </div>
      <p class="font-light text-xs">
        Using real content during design can distract designers and design review teams alike away from the design
        review teams alike away from the design
      </p>
    </CustomContainer>
  </div>

  <div id="companies" class="relative min-h-80 -mt-28">
    <CustomContainer>
      <UCard>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-7">
          <featuredCompanyList :loading="loading" :error="error" :companies="companies"/>
           <!-- <div v-for="company in companies" :key="company.slug">
            {{ company?.name || 'company name' }}
           </div> -->
        </div>
      </UCard>
    </CustomContainer>
  </div>

  <CustomContainer>
    <div class="flex items-center justify-between">
      <div class="w-9/12">
        <div class="font-bold text-2xl text-torea-bay-950 dark:text-torea-bay-400 ">
          Make a Difference with Your Online Jadrian!
        </div>
        <div class="font-normal text-xs">
          Browse hundreds of job offers and find the best suitable position!
        </div>
      </div>
      <div class="w-3/12 text-right">
        <UButton block color="emerald" class=" px-9 py-3 ">
          Full Time
        </UButton>
      </div>
    </div>
  </CustomContainer>

</template>
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useCompanyStore } from '~/store/companies'
import { storeToRefs } from 'pinia'

const companyStore = useCompanyStore()
const { companies, loading, error } = storeToRefs(companyStore)

const fetchCompanies = async () => {
  await companyStore.fetchCompanies()
}

onMounted(() => {
  fetchCompanies()
})

</script>