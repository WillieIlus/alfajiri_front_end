<!-- components/EditProfile.vue -->
<script setup>
import { useAccountStore } from '@/store/accounts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const accountStore = useAccountStore()
const { user, loading } = storeToRefs(accountStore)

const emit = defineEmits(['close'])

const formData = ref({
  first_name: user.value.first_name,
  last_name: user.value.last_name,
  email: user.value.email,
  bio: user.value.bio,
})

const updateProfile = async () => {
  try {
    await accountStore.updateUser(formData.value)
    emit('close')
  } catch (error) {
    console.error('Failed to update profile:', error)
    // You might want to show an error message here
  }
}
</script>

<template>
  <form @submit.prevent="updateProfile">
    <UFormGroup label="First Name">
      <UInput v-model="formData.first_name" />
    </UFormGroup>
    <UFormGroup label="Last Name">
      <UInput v-model="formData.last_name" />
    </UFormGroup>
    <UFormGroup label="Email">
      <UInput v-model="formData.email" type="email" />
    </UFormGroup>
    <UFormGroup label="Bio">
      <UTextarea v-model="formData.bio" />
    </UFormGroup>
    <div class="mt-4 flex justify-end space-x-2">
      <UButton label="Cancel" @click="emit('close')" />
      <UButton type="submit" color="primary" :loading="loading" label="Update Profile" />
    </div>
  </form>
</template>