<template>
  <div id="hero" :style="heroStyle" class="relative h-[32rem] flex items-center text-gray-200 mb-28 pt-36 bg-cover bg-center">
    <div class="absolute inset-0 bg-torea-bay-800 bg-opacity-80"></div>
    <CustomContainer class="relative text-center z-10">
      <div class="w-5/6">
        <div class="font-thin text-sm mb-5">
          THINK OUTSIDE THE BOX
        </div>
        <div class="font-semibold text-3xl mb-5">
          Explore <p class="text-emerald-600 inline-block"> Thousands of Jobs </p> around you. Create a free User Account.
        </div>
        <div class="font-normal text-xs mb-8">
          Surprisingly, there is a very vocal faction of the design community that wants to see filler text banished to
          the original sources from whence it came perhaps not surprisingly.
        </div>
        <div>
          <UButton class="px-8 py-5" color="emerald" icon="i-heroicons-magnifying-glass">
            FIND YOUR DREAM JOB
          </UButton>
        </div>
      </div>
    </CustomContainer>
  </div>
</template>

<script setup>
import backgroundImage from '~/assets/images/background.jpg'

const heroStyle = {
  backgroundImage: `url(${backgroundImage})`
}
</script>
