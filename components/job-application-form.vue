<template>
  <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup name="cover_letter" label="Cover Letter">
      <UTextarea v-model="state.cover_letter" placeholder="Enter your cover letter" />
    </UFormGroup>
    <UFormGroup name="resume" label="Resume">
      <UInput type="file" @change="onResumeChange" accept=".pdf,.doc,.docx" />
    </UFormGroup>
    <UButton type="submit" :disabled="submitting">Submit Application</UButton>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </UForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useJobStore } from '~/store/jobs'
import { storeToRefs } from 'pinia'

const jobStore = useJobStore()
const { loading, error } = storeToRefs(jobStore)

const emit = defineEmits(['application-submitted'])
const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const props = defineProps<{
  jobId: number
}>()

const resume = ref<File | null>(null)

const schema = z.object({
  cover_letter: z.string().min(10, 'Cover letter must be at least 10 characters'),
  resume: z.instanceof(File).optional(),
})

type Schema = z.infer<typeof schema>

const state = ref({
  cover_letter: '',
})

const onResumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    resume.value = target.files[0]
  }
}

const onSubmit = async ({ data }: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = {
      cover_letter: data.cover_letter,
      resume: resume.value
    }

    await jobStore.applyForJob(props.jobId, formData)

    successMessage.value = 'Application submitted successfully'
    emit('application-submitted')

    // Reset form
    state.value = { cover_letter: '' }
    resume.value = null

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to submit application'
  } finally {
    submitting.value = false
  }
}

</script>
