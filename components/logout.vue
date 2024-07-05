<template>
  <div>
    <UButton size="md" icon="i-heroicons-lock-open" variant="outline" label="logout" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Logout?
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <p>Are you sure you want to log out?</p>
        <template #footer>
          <UButton @click="confirmLogout">Yes</UButton>
        </template>
      </UCard>
    </UModal>

    </UModal>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { useAccountStore } from '~/store/accounts'

const accountStore = useAccountStore()
const isOpen = ref(false)

const confirmLogout = () => {
  accountStore.logout()
  isOpen.value = false
}

const cancelLogout = () => {
  showConfirmation.value = false
}
</script>
