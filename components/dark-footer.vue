<style>
footer {
  @apply w-full bg-gray-900 text-gray-200 py-8 mt-20 sm:mt-8 sm:w-full;
}

footer img {
  @apply h-8;
}

hr {
  @apply my-4 border-gray-700;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import logoImg from '~/assets/images/LogoWhite.png'

const logo = logoImg
const currentYear = ref(new Date().getFullYear())
const route = useRoute()

const links = [{
  label: 'Horizontal Navigation',
  to: `${route.path.startsWith('/dev') ? '/dev' : ''}/components/horizontal-navigation`
}, {
  label: 'Command Palette',
  to: '/components/command-palette'
}, {
  label: 'Table',
  to: '/components/table'
}]
</script>
<template>
  <footer class="w-full bg-gray-900 text-gray-200 py-8 mt-20 sm:mt-8 sm:w-full">
    <CustomContainer>
      <div class="flex flex-col sm:flex-row items-center justify-between">
        <div class="flex-auto">
          <div class="font-semibold text-lg">
            <ULink to="/" active-class="text-primary"
              inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <img :src="logo" alt="Logo" class="h-8" />
            </ULink>
          </div>
        </div>
        <div class="flex-auto flex justify-end">
          <UHorizontalNavigation :links="links">
            <template #default="{ link }">
              <span class="group-hover:text-primary relative">{{ link.label }}</span>
            </template>
          </UHorizontalNavigation>
        </div>
      </div>
      <hr class="my-4 border-gray-700" />
      <div class="flex justify-between items-center">
        <div class="flex-auto">
          &copy; {{ currentYear }} Alfajirijobs. All Rights Reserved
        </div>
        <div class="flex-auto flex justify-end space-x-4">
          <nuxt-link to="https://facebook.com">
            <div class="bg-gray-800 py-2 px-3 rounded-full">
              <UIcon name="i-fa6-brands:facebook-f" class="text-gray-200" dynamic />
            </div>
          </nuxt-link>
          <nuxt-link to="https://x.com">
            <div class="bg-gray-800 py-2 px-3 rounded-full">
              <UIcon name="i-fa6-brands:x-twitter" class="text-gray-200" dynamic />
            </div>
          </nuxt-link>
          <nuxt-link to="https://instagram.com">
            <div class="bg-gray-800 py-2 px-3 rounded-full">
              <UIcon name="i-fa6-brands:instagram" class="text-gray-200" dynamic />
            </div>
          </nuxt-link>
          <nuxt-link to="https://linkedin.com">
            <div class="bg-gray-800 py-2 px-3 rounded-full">
              <UIcon name="i-fa6-brands:linkedin-in" class="text-gray-200" dynamic />
            </div>
          </nuxt-link>
          <nuxt-link to="https://youtube.com">
            <div class="bg-gray-800 py-2 px-3 rounded-full">
              <UIcon name="i-fa6-brands:youtube" class="text-gray-200" dynamic />
            </div>
          </nuxt-link>
        </div>
      </div>
    </CustomContainer>
  </footer>
</template>

