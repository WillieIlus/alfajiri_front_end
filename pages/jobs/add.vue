<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs"/>
  <SearchFilter />
  <CustomContainer>
    <JobsForm :user="user"/>
  </CustomContainer>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAccountStore } from '~/store/accounts'

const router = useRouter()
const accountStore = useAccountStore()

const { user, loading, error } = storeToRefs(accountStore)

const breadcrumbs = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Jobs',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/jobs'
},{
  label: 'Add a Job',
  icon: 'i-heroicons-square-3-stack-3d',
}]

const crumbTitle = 'Add a job'

onMounted(() => {
  if (!accountStore.isLoggedIn) {
    router.push('/login')
  }
  getUserById()
  getUser()
})

</script>