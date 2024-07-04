<template>
  <div id="hero" :style="heroStyle"
    class="relative h-[20rem] flex items-center text-gray-200 mb-28 pt-24 bg-cover bg-center">
    <div class="absolute inset-0 bg-torea-bay-800 bg-opacity-80"></div>
    <CustomContainer class="relative text-center z-10  w-full">
      <div class="">
        <div class="font-semibold text-4xl mb-5">
          {{ title }}
        </div>
        <div class="flex justify-center">
          <UBreadcrumb :links="crumbs" />
        </div>
      </div>
    </CustomContainer>
  </div>
</template>


<script setup lang="ts">
import backgroundImage from '~/assets/images/background.jpg'

const heroStyle = {
  backgroundImage: `url(${backgroundImage})`
}

const props = defineProps({
  crumbs: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: Object,
    required: true
  }
})

</script>