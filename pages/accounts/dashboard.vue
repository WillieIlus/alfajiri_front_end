<template>
  <breadcrumbs/>
  <div v-if="loading" ></div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div v-if="user">
      Hello {{ user.first_name || '' }} {{ user.last_name || '' }}
    </div>
    <div v-else="userById">
      Welcome {{ userById.first_name || '' }} {{ userById.last_name || '' }}
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAccountStore } from '~/store/accounts'

const router = useRouter()
const accountStore = useAccountStore()

const { user, userById, loading, error } = storeToRefs(accountStore)


const editProfile = () => {
  router.push('/accounts/profile')
}

const changePassword = () => {
  router.push('/accounts/change-password')
}

const getUserById = async () => {
  await accountStore.getUserById()
}

const getUser = async () => {
  await accountStore.getUser()
}

onMounted(() => {
  if (!accountStore.isLoggedIn) {
    router.push('/login')
  }
  getUserById()
  getUser()
})

</script>