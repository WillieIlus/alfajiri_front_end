<template>
  <div>
    <USlideover v-model="localIsOpen" :overlay="false">
      <div class="p-4 flex-1">
        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10" square padded @click="localIsOpen = false" />
        <Filters />
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isOpen']);

const localIsOpen = ref(props.isOpen);

watch(() => props.isOpen, (newVal) => {
  localIsOpen.value = newVal;
});

watch(localIsOpen, (newVal) => {
  emit('update:isOpen', newVal);
});
</script>

