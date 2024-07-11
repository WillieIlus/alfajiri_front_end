<template>
  <div :class="['top-nav', { 'scrolled': isScrolled }]" :style="navStyle">
    <CustomContainer class="w-full">
      <div>
        <div class="flex justify-between items-center">
          <div class="font-semibold text-lg">

            <ULink to="/" active-class="text-primary"
              inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Jadrian
            </ULink>
          </div>
          <div class="flex flex-1 justify-center items-center mx-4">
            <UInput class="w-full" icon="i-heroicons-magnifying-glass-20-solid" size="xl" color="white" trailing
              placeholder="Search for jobs..." />
          </div>
          <!-- user menu -->
          <div class="flex flex-col sm:flex-row items-center gap-2">
            <div v-if="isLoggedIn">
              <span class="px-4">Hi {{ user?.first_name || 'user' }}</span>
              <span>
                <Logout />
              </span>
            </div>
            <div v-else>
              <UButton size="md" icon="i-heroicons-user" label="signup" class="pr-2" />
              <UButton size="md" icon="i-heroicons-lock-closed" variant="outline" label="login" to="/login" />
            </div>
            <USelect class="inline-block" v-model="$colorMode.preference" :options="['light', 'dark']" />
          </div>
          <!-- end user menu -->
        </div>
      </div>
    </CustomContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '~/store/accounts'

const accountStore = useAccountStore()
const { user, isLoggedIn } = storeToRefs(accountStore)

const isScrolled = ref(false)
const scrollPosition = ref(0)

const handleScroll = () => {
  scrollPosition.value = window.scrollY
  isScrolled.value = scrollPosition.value > 500
}

const navStyle = computed(() => {
  const opacity = Math.min(scrollPosition.value / 500, 1)
  return {
    backgroundColor: `rgba(48, 52, 149, ${opacity})`
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const links = [{
  label: 'Home',
  to: '/'
},
{
  label: 'Jobs',
  to: '/jobs'
},
{
  label: 'Companies',
  to: '/companies'
},
]

onMounted(() => {
  accountStore.getUser()
})
</script>

<style>
.top-nav {
  @apply h-20 flex items-center text-gray-200 fixed w-full transition-opacity duration-300;
  z-index: 10;
  /* Ensure the nav stays on top */
}
</style>
