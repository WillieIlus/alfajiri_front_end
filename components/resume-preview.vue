<template>
  <div v-if="fileUrl" class="mt-2">
    <a :href="fileUrl" target="_blank" class="block text-blue-500 hover:text-blue-700">
      View Resume
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  fileUrl: string | null
}>()
</script>