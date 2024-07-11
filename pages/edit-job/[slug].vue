<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Edit Job</h1>
    <JobForm :jobSlug="jobSlug" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const jobSlug = route.params.slug;

</script>
