<template>
  <div class="relative h-[32rem] mb-28 pt-24 pb-12 bg-torea-bay-800">
    <UContainer class="relative overflow-hidden h-full">
      <img :src="backgroundImageMobile" alt="Background" class="object-cover w-full h-full absolute inset-0 md:hidden" />
      <img :src="backgroundImage" alt="Background" class="object-cover w-full h-full absolute inset-0 hidden md:block" />
    </UContainer>
  </div>
</template>

<script setup>
import backgroundImage from '~/assets/images/Banner-02.png'
import backgroundImageMobile from '~/assets/images/Banner-04.png'
</script>
