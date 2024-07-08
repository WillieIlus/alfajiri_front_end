<template>
  <CustomContainer>
    <div class="min-w-screen min-h-screen flex justify-center items-center">
      <UCard class="md:w-7/8 w-2/3">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </UCard>
    </div>
  </CustomContainer>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAccountStore } from '~/store/accounts';
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

const router = useRouter()
const accountStore = useAccountStore()

const submitting = ref(false)
const error = ref('')

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.infer<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data } = event
  submitting.value = true
  error.value = ''

  try {
    console.log('Submitting login...')
    await accountStore.login(data.email, data.password);
    console.log('Login successful');
    router.push('/');
  } catch (err) {
    console.log(err)
    if (err.response && err.response.status === 401) {
      error.value = 'Invalid email or password';
    } else {
      error.value = 'An error occurred. Please try again.';
    }
    console.log(error.value);
  } finally {
    submitting.value = false;
  }
}
</script>
