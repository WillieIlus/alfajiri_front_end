<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAccountStore } from '~/store/accounts'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()
const { user, loading, error } = storeToRefs(accountStore)

onMounted(async () => {
  if (!accountStore.isLoggedIn) {
    navigateTo('/login')
  } else {
    await accountStore.fetchCurrentUser()
  }
})

const showEditModal = ref(false)
const showPasswordModal = ref(false)

const openEditModal = () => {
  showEditModal.value = true
}

const openPasswordModal = () => {
  showPasswordModal.value = true
}

const crumbTitle = computed(() => user.value?.first_name || 'User Profile')

const breadcrumbs = computed(() => [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: crumbTitle.value,
    icon: 'i-heroicons-user-20-solid',
  }
])
</script>

<template>
  <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
  <CustomContainer>
    <div class="flex gap-8">
      <UCard v-if="loading">
        <USkeleton class="h-32 w-32 rounded-full" />
        <USkeleton class="h-8 w-64 mt-4" />
        <USkeleton class="h-4 w-full mt-2" :count="3" />
      </UCard>

      <UCard v-else-if="user" class="max-w-4xl mx-auto">
        <template #header>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome, {{ user.first_name }}!
          </h1>
        </template>

        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/3 flex flex-col items-center">
            <img :src="user.avatar || '/default-avatar.png'" :alt="user.first_name"
              class="w-32 h-32 rounded-full object-cover" />
            <h2 class="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
              {{ user.first_name }} {{ user.last_name }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ user.email }}
            </p>
          </div>

          <div class="md:w-2/3 mt-6 md:mt-0 md:ml-8">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Bio</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ user.bio || "No bio available." }}
            </p>

            <div class="mt-6 space-y-4">
              <UButton icon="i-heroicons-pencil-square" label="Edit Profile" @click="openEditModal" />
              <UButton icon="i-heroicons-key" label="Change Password" @click="openPasswordModal" />
            </div>
          </div>
        </div>
      </UCard>

      <UCard v-else-if="error" class="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{{ error }}</span>
      </UCard>

      <UModal v-model="showEditModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Edit Profile</h3>
          </template>
          <EditProfile @close="showEditModal = false" />
        </UCard>
      </UModal>

      <UModal v-model="showPasswordModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Change Password</h3>
          </template>
          <!-- Add form for changing password here -->
        </UCard>
      </UModal>
    </div>
  </CustomContainer>
</template>