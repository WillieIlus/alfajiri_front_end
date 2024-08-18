<template>
  <UCard class="mb-6">
    <h2 class="mb-4 font-bold text-2xl">Apply for Job</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UFormGroup name="cover_letter" label="Cover Letter">
        <TiptapEditor ref="tiptapEditor" :modelValue="form.cover_letter"
          @update:modelValue="form.cover_letter = $event" />
      </UFormGroup>

      <UFormGroup name="resume" label="Resume">
        <input type="file" @change="onResumeChange" accept=".pdf,.doc,.docx" ref="fileInput" />
      </UFormGroup>

      <div class="pt-4">
        <UButton type="submit" :disabled="submitting">
          Submit Application
        </UButton>
        <UButton variant="outline" class="ml-2" @click="clearForm">
          Clear
        </UButton>
      </div>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useJobStore } from '~/store/jobs'

const props = defineProps<{
  jobId: number
}>()

const jobStore = useJobStore()
const tiptapEditor = ref(null)
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const schema = z.object({
  cover_letter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resume: z.any().refine(
    (val) => !val || (val instanceof File),
    'Resume must be a file'
  )
})

type FormData = z.infer<typeof schema>

const form = reactive<FormData>({
  cover_letter: '',
  resume: undefined
})

const onResumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    form.resume = target.files[0]
  }
}

const onSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const validatedData = await schema.parseAsync(form)
    await jobStore.applyForJob(props.jobId, validatedData)
    successMessage.value = 'Application submitted successfully'
    clearForm()
  } catch (error) {
    console.error('Submission error:', error)
    if (error instanceof z.ZodError) {
      errorMessage.value = error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join('\n')
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Failed to submit application'
    }
  } finally {
    submitting.value = false
  }
}

const clearForm = () => {
  Object.keys(form).forEach(key => {
    form[key as keyof FormData] = '' as any
  })
  if (tiptapEditor.value?.editor) {
    tiptapEditor.value.editor.commands.clearContent()
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>