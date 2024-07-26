<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">User Profile</h1>
    <div v-if="loading" class="text-center">
      <p class="text-gray-600">Loading user data...</p>
    </div>
    <UpdateUserForm v-else />
  </div>
</template>

<script setup>
import { useAccountStore } from '@/store/accounts'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()
const router = useRouter()
const { loading } = storeToRefs(accountStore)

onMounted(async () => {
  if (!accountStore.isLoggedIn) {
    router.push('/login')
  } else {
    try {
      await accountStore.fetchCurrentUser()
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      // You might want to show an error message here
    }
  }
})
</script>