<template>
       <UCard class="">
          <template #header>
            <h2 class="font-semibold text-2xl my-4"> Date Posted</h2>
          </template>
          <div class="space-y-3">
            <URadio v-for="method of methods" :key="method.value" v-model="selected" v-bind="method" size="xl" />
          </div>
        </UCard>
</template>


<script setup lang="ts">
const methods = [
  { value: 'last_hour', label: 'Last Hour' },
  { value: 'last_24', label: 'Last 24 Hours' },
  { value: 'last_07_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'all', label: 'All ' }
]

const selected = ref('all')

</script>