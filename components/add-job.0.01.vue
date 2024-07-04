<template>
  <UCard>
    <h2 class="mb-4 font-bold text-2xl "> Add a new Job Vacancy </h2>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit.prevent="onSubmit">
      <UFormGroup name="title" label="Title">
        <UInput v-model="state.title" />
      </UFormGroup>

      <UFormGroup name="company" label="Company">
        <UInputMenu v-model="state.company" :options="companyOptions" />
      </UFormGroup>

      <UFormGroup name="description" label="Description">
        <UTextarea v-model="state.description" />
      </UFormGroup>

      <UButton variant="outline" class="ml-2" @click="form.clear()">
        Clear
      </UButton>

      <UButton type="submit" :disabled="submitting">Submit</UButton>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </UForm>
  </UCard>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useJobStore } from '~/store/jobs'
import { useCompanyStore } from '~/store/companies'
import { useRouter } from 'vue-router'

const router = useRouter()
const jobStore = useJobStore()
const companyStore = useCompanyStore()

const { companies } = storeToRefs(companyStore)

const fetchCompanies = async () => {
  await companyStore.fetchCompanies()
}

const companyOptions = computed(() => {
  return (companies.value || []).map(company => ({
    label: company.name,
    value: company.id
  }));
});

const state = ref({
  company: null,
  title: '',
  // location: null,
  // category: null,
  description: '',
  // salary: '',
  // image: null 
});

const schema = z.object({
  title: z.string().min(10, 'Must be at least 10 characters'),
  company: z.any(),
  description: z.string().min(100, 'Must be at least 100 characters'),
})

type Schema = z.infer<typeof schema>

const form = ref()

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const onSubmit = async (event) => {
  submitting.value = true;
  errorMessage.value = '';

  const { data } = event; // Extract the form data from the event
  try {
    const data = new FormData();
    data.append('title', state.value.title);
    data.append('company', state.value.company);
    // data.append('location', state.value.location);
    // data.append('category', state.value.category);
    data.append('description', state.value.description);
    // data.append('salary', state.value.salary);
    // if (state.value.image) {
    //   data.append('image', state.value.image);
    // }
    console.log('FormData:', data);
    await jobStore.createJob(data);
    successMessage.value = 'Job created successfully';
    router.push(`/jobs/`);
  } catch (error) {
    errorMessage.value = 'Failed to create job';
    console.log(error);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchCompanies()
})

</script>
