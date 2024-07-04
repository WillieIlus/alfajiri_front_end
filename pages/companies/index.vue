<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <CompanyList :companies="companies" :error="error" :loading="loading" />
  </CustomContainer>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '~/store/companies'
import { useCategoryStore } from '~/store/categories'
import { useAccountStore } from '~/store/accounts'
import { useLocationStore } from '~/store/locations'

const companyStore = useCompanyStore()
const categoriesStore = useCategoryStore()
const accountStore = useAccountStore()
const locationStore = useLocationStore()

const { companies, loading, error } = storeToRefs(companyStore)
const { categories } = storeToRefs(categoriesStore)

const fetchCompanies = async () => {
  await companyStore.fetchCompanies()
}

const fetchCategories = async () => {
  await categoriesStore.fetchCategories()
}

const crumbTitle = 'Company List'

const breadcrumbs = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Company List',
  icon: 'i-heroicons-square-3-stack-3d',
}]

onMounted(() => {
  fetchCompanies()
  fetchCategories()
})
</script>