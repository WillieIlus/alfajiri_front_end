<template>
  <UContainer>
  <form @submit.prevent="updateUserProfile" class="space-y-4">
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Success!</strong>
      <span class="block sm:inline">{{ success }}</span>
    </div>
    <div>
      <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
      <input v-model="userForm.first_name" id="first_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>
    <div>
      <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
      <input v-model="userForm.last_name" id="last_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input v-model="userForm.email" id="email" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
      <input v-model="userForm.phone" id="phone" type="tel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>
    <div>
      <label for="avatar" class="block text-sm font-medium text-gray-700">Avatar</label>
      <input @change="handleFileUpload" id="avatar" type="file" accept="image/*" class="mt-1 block w-full">
    </div>
    <div>
      <button type="submit" :disabled="loading" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
        {{ loading ? 'Updating...' : 'Update Profile' }}
      </button>
    </div>
  </form>
  </UContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAccountStore } from '@/store/accounts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

const accountStore = useAccountStore()
const { loading, error } = storeToRefs(accountStore)

const userForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  avatar: null
})

const success = ref('')

onMounted(async () => {
  try {
    await accountStore.fetchCurrentUser()
    userForm.value = { ...accountStore.user }
  } catch (err) {
    error.value = 'Failed to load user data. Please try again.'
  }
})

const handleFileUpload = (event) => {
  userForm.value.avatar = event.target.files[0]
}

const updateUserProfile = async () => {
  try {
    error.value = ''
    success.value = ''

    const formData = new FormData()
    Object.keys(userForm.value).forEach(key => {
      if (userForm.value[key] !== null) {
        formData.append(key, userForm.value[key])
      }
    })

    await accountStore.updateUser(formData)
    success.value = 'Profile updated successfully!'
    router.push('/')
  } catch (err) {
    error.value = 'Failed to update profile. Please try again.'
  }
}
</script>