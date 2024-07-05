<template>
  <div class="flex items-center justify-center p-72">
    <div class="animate-spin rounded-full border-t-transparent border-blue-400 border-8" :class="[sizeClasses]"></div>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-8 w-8';
    case 'lg': return 'h-16 w-16';
    default: return 'h-12 w-12';
  }
});
</script>