<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <ul>
        <li v-for="job in jobs" :key="job.id" class="mb-4">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">{{ job.title }}</h3>
            </template>
            <p>{{ job.company.name }}</p>
            <p>{{ job.location.name }}</p>
            <p>{{ job.category.name }}</p>
            <template #footer>
              <div class="flex justify-between">
                <UButton @click="$emit('editJob', job.slug)" color="primary" variant="outline">
                  Edit
                </UButton>
                <UButton @click="viewJob(job.slug)" color="primary">
                  View Details
                </UButton>
              </div>
            </template>
          </UCard>
        </li>
      </ul>
      <div v-if="hasMoreItems" class="mt-4">
        <UButton @click="$emit('incrementItemsPerPage')" color="primary" variant="outline">
          Load More
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hasMoreItems: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['incrementItemsPerPage']);

const incrementItemsPerPage = () => {
  emit('incrementItemsPerPage');
};
</script>
