<template>

  <CustomContainer class="">
    <div v-if="loading">
      <spinner size="lg" :fullScreen="true" />
    </div>
    <div v-else-if="error">
      error ...
    </div>
    <div v-else>
      <h3 class="font-semibold text-2xl py-2 text-gray-900 dark:text-gray-100">
        About {{ company?.name || " the Company" }}
      </h3>
      <UCard class="mb-6 h-64 p-0 overflow-hidden rounded-lg shadow-lg" :style="backgroundStyle">
        <div class="h-full w-full flex items-center justify-center  bg-opacity-0">
        </div>
      </UCard>
      <div class="relative min-h-80 -mt-28">
        <div class="w-2/3 mx-auto">
          <UCard>
            <div class="flex flex-col md:flex-row sm:items-center sm:justify-between">
              <div id="logo" class="flex flex-grow-o items-center justify-center sm:justify-start sm:w-1/2">
                <div class="font-thin text-sm mb-2 flex items-center justify-center sm:mb-0">
                  <img src="~/assets/images/Alfajiri jobs Logo-01.png"alt="Logo" class="min-h-10 max-h-14">
                </div>
              </div>
              <div id="details" class="flex-grow text-center sm:text-left sm:w-1/2">
                <div class="font-bold text-2xl mb-1">
                  {{ company?.name || 'the Company' }}
                </div>
                <div class="font-normal">
                  {{ company?.address || " " }}, {{ company?.get_location || " " }}
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <div class="mb-6 -mt-28">
        <UCard class="p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus at autem veritatis. Et ducimus
            eligendi
            reiciendis tempore, esse voluptatem repudiandae id quibusdam?
          </p>

          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores nisi soluta perspiciatis ipsa
            voluptatibus
            libero dolores ut delectus qui inventore eaque officiis, reprehenderit ea deserunt. Beatae explicabo sit
            placeat
            ullam!
          </p>

          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero illum, ea natus repellat voluptas
            consequuntur
            molestias quidem.
          </p>
        </UCard>
      </div>
    </div>
  </CustomContainer>
</template>

<script setup>
import backgroundImage from '~/assets/images/background.jpg'

const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const props = defineProps({
  company: {
    type: Object,
  },
  error: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
