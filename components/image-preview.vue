<template>
  <div v-if="imageUrl" class="mt-2">
    <img :src="imageUrl" alt="Image preview" class="max-w-xs max-h-32 object-contain" />
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  imageUrl: string | null
}>()
</script>