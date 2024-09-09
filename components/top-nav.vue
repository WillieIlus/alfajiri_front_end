<template>
  <div :class="['top-nav', { 'scrolled': isScrolled }]" :style="navStyle">
    <CustomContainer class="w-full">
      <div>
        <div class="flex justify-between items-center">
          <div class="font-semibold text-lg">
            <ULink to="/" active-class="text-primary"
              inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <img :src="logo" alt="Logo" class="h-8" />
            </ULink>
          </div>
          <div class="flex flex-1 justify-center items-center mx-16 ">
            <UInput class="w-full" icon="i-heroicons-magnifying-glass-20-solid" size="xl" color="white" trailing
              placeholder="Search for jobs..." />
          </div>
          <!-- user menu -->


          <div class="flex flex-col sm:flex-row items-center gap-2">
            <div v-if="isLoggedIn" class="flex justify-center items-center gap-4">
              <span class="px-4">Hi <ULink to="/accounts/profile" active-class="text-primary"
                  inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  {{ user?.first_name || 'user' }}</ULink></span>
              <span>
                <Logout />
              </span>
            </div>
            <div v-else>
              <UButton size="md" icon="i-heroicons-user" label="signup" @click="openModal('signup')" class="mr-2" />
              <UButton size="md" icon="i-heroicons-lock-closed" variant="outline" label="login"
                @click="openModal('login')" />
            </div>
            <ColorMode />
          </div>
          <!-- end user menu -->
        </div>
      </div>
    </CustomContainer>
  </div>
  <!-- modal  -->
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <NuxtLink to="/">
          <img src="assets/images/Logo.png" class="mx-auto h-[24px] block dark:hidden" alt="">
          <img src="assets/images/logo-white.png" class="mx-auto h-[24px] dark:block hidden" alt="">
        </NuxtLink>
        <h3 class="my-6 text-xl font-semibold">Login</h3>
      </template>
      <LoginForm v-if="activeModal === 'login'" @login-successful="handleLogin"
        @open-signup-modal="switchToSignupModal" />
      <SignupForm v-else-if="activeModal === 'signup'" @signup-successful="handleSignup"
        @open-login-modal="switchToLoginModal" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '~/store/accounts'
import logoImg from '~/assets/images/LogoWhite.png'

const toast = useToast()

const accountStore = useAccountStore()
const { user, isLoggedIn } = storeToRefs(accountStore)
const logo = logoImg // Assign the imported logo image to a variable

const isScrolled = ref(false)
const scrollPosition = ref(0)
const isModalOpen = ref(false)
const activeModal = ref('')
const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'login': return 'login'
    case 'signup': return 'signup'
    default: return ''
    
  }
})

const openModal = (type: 'login' | 'signup') => {
  activeModal.value = type
  isModalOpen.value = true
}

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

const handleLogin = async (newLogin) => {
  isModalOpen.value = false
}

const handleSignup = async (newSignup) => {
  isModalOpen.value = false
}

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

const switchToLoginModal = () => {
  activeModal.value = 'login'
}

const switchToSignupModal = () => {
  activeModal.value = 'signup'
}

onMounted(() => {
  accountStore.fetchCurrentUser()
})
</script>

<style>
.top-nav {
  @apply h-20 flex items-center text-gray-200 fixed w-full transition-opacity duration-300;
  z-index: 10;
  /* Ensure the nav stays on top */
}

.top-nav img {
  height: 32px;
  /* Adjust the height of the logo image as needed */
}
</style>
