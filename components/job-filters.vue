<!-- // composables/useJobFilter.ts
import { ref, computed } from 'vue'

export default function useJobFilter() {
  const filters = ref({
    title: '',
    location: null,
    category: null,
    minSalary: null,
    maxSalary: null,
    jobType: null,
    vacancies: null,
  })

  const applyFilters = (jobs) => {
    return jobs.filter(job => {
      return (
        (!filters.value.title || job.title.toLowerCase().includes(filters.value.title.toLowerCase())) &&
        (!filters.value.location || job.location.id === filters.value.location) &&
        (!filters.value.category || job.category.id === filters.value.category) &&
        (!filters.value.minSalary || job.minSalary >= filters.value.minSalary) &&
        (!filters.value.maxSalary || job.maxSalary <= filters.value.maxSalary) &&
        (!filters.value.jobType || job.jobType === filters.value.jobType) &&
        (!filters.value.vacancies || job.vacancies >= filters.value.vacancies)
      )
    })
  }

  return {
    filters,
    applyFilters,
  }
} -->
  <template>
    nothing here
  </template>