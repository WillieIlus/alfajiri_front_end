<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CompanyDetails :company="company" :error="error" :loading='loading' />
  <customContainer>
    <!-- <JobList :jobs="jobs" :error="error" :loading="loading"/> -->
  </CustomContainer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '~/store/companies'
import { useJobStore } from '~/store/jobs'

const companyStore = useCompanyStore()
const jobStore = useJobStore()

const { company, companies, loading, error } = storeToRefs(companyStore)
const { jobs } = storeToRefs(jobStore)

const route = useRoute()
const router = useRouter()

const fetchCompany = async () => {
  await companyStore.fetchCompany(route.params.slug)
}

// const fetchCompaniesByCategory = async () => {
//   await companyStore.fetchCompaniesByCategory()
// }

const fetchJobsByCompany = async () => {
  await jobStore.fetchJobsByCompany(route.params.slug)
}

const breadcrumbs = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Company List',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/companies'
},{
  label: 'Company Details',
  icon: 'i-heroicons-square-3-stack-3d',
}]

const crumbTitle = 'Company Details'

onMounted(() => {
  fetchCompany()
  // fetchCompaniesByCategory()
  fetchJobsByCompany()
})

</script>
