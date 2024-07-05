<template>
  <div :class="['top-nav', { 'scrolled': isScrolled }]" :style="navStyle">
    <CustomContainer class="w-full">
      <div>
        <div class="flex justify-between">
          <div class="font-semibold text-lg">
            Jadrian
          </div>

          <!-- menu start -->
          <div class="hidden sm:flex justify-center items-center">
            <UHorizontalNavigation :links="links" />
          </div>
          <!-- end menu -->

          <!-- user menu -->
          <div class="flex flex-col sm:flex-row items-center gap-2">
            <div v-if="isLoggedIn">
              <span class="px-4">Hi {{ user?.first_name || 'user' }}</span>
              <span>
              <Logout />
              </span>
            </div>
            <div v-else>
              <UButton size="md" icon="i-heroicons-user" label="signup" />
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
