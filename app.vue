<template>
  <div class="bg-gray-100 dark:bg-gray-800">
    <TopNav/>
    <NuxtPage />
    <DarkFooter />
  </div>
  <UNotifications />
  <UModals />
</template>

<script setup>
import { useAccountStore } from '~/store/accounts';
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();
const { user } = storeToRefs(accountStore);

onMounted(async () => {

  await accountStore.fetchCurrentUser();

});
</script>
