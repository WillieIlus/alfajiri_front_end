<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
        <Form />
      </div>
    </UCard>
  </UModal>
</template>
<script lang="ts" setup>

defineProps({
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['success'])

function onSuccess() {
  emit('success')
}
</script>
