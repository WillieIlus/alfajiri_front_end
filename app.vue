<template>
  <div class="bg-gray-100 dark:bg-gray-800">
    <TopNav/>
    <NuxtPage />
    <DarkFooter />
  </div>
  <UNotifications />
  <UModals />
  <ScrollToTop />
</template>

<script setup>
import { useAccountStore } from '~/store/accounts';
import { useJobStore } from '~/store/jobs'
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();
const jobStore = useJobStore()
const { user } = storeToRefs(accountStore);

onMounted(async () => {
  await accountStore.fetchCurrentUser();
  // await jobStore.initializeBookmarks();
});

</script>