<template>
  <div>
    <div v-if="loading">
      loading ...
    </div>
    <div v-else-if="error">
      error
    </div>
    <div v-else class="flex flex-wrap gap-x-4 gap-y-4">
      <div v-for="company in companies" :key="company.slug" class="flex justify-center items-center px-7 py-4">
        <img src="~/assets/images/logo.png" alt="Logo" class="min-h-10 max-h-14">
        <div>
          <ULink :to="`/companies/${company.slug}`">
            {{ company?.name || "Company name" }}
          </ULink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  companies: {
    type: Array,
    // required: true,
    default: () => []
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
