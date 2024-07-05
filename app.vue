<!-- <template>
  <div class=" bg-gray-100 bg dark:bg-gray-800">
    <TopNav />
    <NuxtPage />
    <DarkFooter />
  </div>
</template>
<script setup>
import { useAccountStore } from '~/store/accounts'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()
const { user } = storeToRefs(accountStore)

onMounted(() => {
    accountStore.getUser()
})
</script> -->
<template>
  <div class="bg-gray-100 dark:bg-gray-800">
    <TopNav />
    <NuxtPage />
    <DarkFooter />
  </div>
  <UNotifications />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAccountStore } from '~/store/accounts';
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();
const { user } = storeToRefs(accountStore);

onMounted(async () => {
  try {
    console.log('Fetching user...');
    await accountStore.getUser();
    console.log('User fetched:', user.value);
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
});
</script>
