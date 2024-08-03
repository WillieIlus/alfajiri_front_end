<template>
  <button 
    @click="handleBookmarkClick"
    class="w-full h-full flex items-center justify-center"
    :class="[
      isBookmarked ? 'text-green-500' : 'text-gray-500',
      !isLoggedIn && 'opacity-60 cursor-not-allowed'
    ]"
    :disabled="!isLoggedIn"
  >
    <UIcon 
      :name="isBookmarked ? 'i-heroicons-heart-20-solid' : 'i-heroicons-heart'"
      class="w-5 h-5"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useJobStore } from '~/store/jobs'
import { useAccountStore } from '~/store/accounts'

const props = defineProps({
  jobPost: {
    type: Object,
    required: true,
    validator: (value) => {
      return typeof value.id === 'number' && typeof value.title === 'string'
    }
  }
})

const jobStore = useJobStore()
const accountStore = useAccountStore()

const isLoggedIn = computed(() => accountStore.isLoggedIn)
const isBookmarked = computed(() => jobStore.isBookmarked(props.jobPost.id))

const handleBookmarkClick = () => {
  if (isLoggedIn.value) {
    jobStore.toggleBookmark(props.jobPost.id)
  }
}
</script>