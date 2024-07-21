<template>
  <div class="relative h-[30rem] mb-28 pt-12 pb-6 bg-torea-bay-800">
    <UContainer class="relative overflow-hidden h-full">
      <img :src="backgroundImageMobile" alt="Background" class="object-cover w-full h-full absolute inset-0 sm:hidden" />
      <img :src="backgroundImageTablet" alt="Background" class="object-cover w-full h-full absolute inset-0 hidden md:block lg:hidden" />
      <img :src="backgroundImage" alt="Background" class="object-cover w-full h-full absolute inset-0 hidden lg:block" />
    </UContainer>
  </div>
</template>

<script setup>
import backgroundImage from '~/assets/images/Banner-02.png'
import backgroundImageTablet from '~/assets/images/Banner-04.png'
import backgroundImageMobile from '~/assets/images/Banner-06.png'
</script>
