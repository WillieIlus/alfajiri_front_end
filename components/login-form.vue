<template>
  <UForm :schema="schema" :state="state" class="text-start" @submit="onSubmit">
    <div class="grid grid-cols-1">
      <UFormGroup label="Email Address:" name="email">
        <UInput v-model="state.email" type="email" placeholder="name@example.com" />
      </UFormGroup>

      <UFormGroup label="Password:" name="password">
        <UInput v-model="state.password" type="password" placeholder="Password" />
      </UFormGroup>

      <div class="mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center mb-0">
            <input
              class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
              type="checkbox" value="" id="RememberMe">
            <label class="form-checkbox-label text-slate-400" for="RememberMe">Remember me</label>
          </div>
          <NuxtLink to="/forgot-password" class="text-emerald-600">Forgot password?</NuxtLink>
        </div>
      </div>

      <UButton type="submit" :loading="submitting">
        Sign In
      </UButton>

      <div class="text-center mt-4">
        <span class="text-slate-400 me-2">Don't have an account? </span>
        <a href="#" @click.prevent="openSignupModal" class="text-black dark:text-white font-bold">Sign up</a>
      </div>
    </div>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </UForm>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAccountStore } from '~/store/accounts'

const toast = useToast()
const router = useRouter()
const accountStore = useAccountStore()

const emit = defineEmits(['login-successful'])
const openSignupModal = () => {
  emit('open-signup-modal')
}

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.infer<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const newLogin = await accountStore.login(state.email, state.password)
    successMessage.value = 'Login Successful'
    toast.add({ title: 'Success', description: 'Login Successful' })
    emit('login-successful')
    state.email = '' // Reset the form
    state.password = ''
    // router.push('/')
  } catch (err: any) {
    console.error(err)
    if (err.response && err.response.status === 401) {
      errorMessage.value = 'Invalid email or password'
      toast.add({ title: 'Error', description: 'Invalid email or password.', color: 'red' })
    } else {
      errorMessage.value = 'An error occurred. Please try again.'
      toast.add({ title: 'Error', description: 'An error occurred. Please try again.', color: 'red' })
    }
  } finally {
    submitting.value = false
  }
}
</script>
