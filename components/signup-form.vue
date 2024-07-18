<template>
  <UForm :schema="schema" :state="state" class="text-start" @submit="onSubmit">
    <div class="grid grid-cols-1">
      <UFormGroup label="Your Name:" name="first_name">
        <UInput v-model="state.first_name" type="text" placeholder="Harry" />
      </UFormGroup>

      <UFormGroup label="Phone:" name="phone">
        <UInput v-model="state.phone" type="text" placeholder="Phone number" />
      </UFormGroup>

      <UFormGroup label="Email Address:" name="email">
        <UInput v-model="state.email" type="email" placeholder="name@example.com" />
      </UFormGroup>

      <UFormGroup label="Password:" name="password">
        <UInput v-model="state.password" type="password" placeholder="Password" />
      </UFormGroup>

      <UFormGroup label="Confirm Password:" name="password_confirmation">
        <UInput v-model="state.password_confirmation" type="password" placeholder="Confirm Password" />
      </UFormGroup>

      <div class="mb-4">
        <div class="flex items-center mb-0">
          <input
            class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
            type="checkbox" value="" id="Accept:T&C">
          <label class="form-checkbox-label text-slate-400" for="Accept:T&C">I Accept <NuxtLink to="/terms"
              class="text-emerald-600">Terms And Condition</NuxtLink></label>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex items center mb-0">
          <input
            class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
            type="checkbox" value="" id="Accept:PrivacyPolicy">
          <label class="form-checkbox-label text-slate-400" for="Accept:PrivacyPolicy">I Accept <NuxtLink to="/privacy"
              class="text-emerald-600">Privacy Policy</NuxtLink></label>
        </div>
      </div>

      <UButton type="submit" :loading="submitting">
        Sign Up
      </UButton>
      <div class="text-center mt-4">
        <span class="text-slate-400 me-2">Already have an account? </span>
        <a href="#" @click.prevent="openLoginModal" class="text-black dark:text-white font-bold">Sign in</a>
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

const emit = defineEmits(['signup-successful', 'open-login-modal'])

const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const schema = z.object({
  first_name: z.string().min(3, 'Must be at least 3 characters'),
  phone: z.string().min(6, 'Must be at least 6 characters').max(15, 'Must be at most 15 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})

type Schema = z.infer<typeof schema>

const state = reactive({
  first_name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const { password_confirmation, ...signupData } = state
    const newSignup = await accountStore.signup(signupData)
    successMessage.value = 'Account Created Successfully'
    toast.add({ title: 'Success', description: 'Account Created Successfully' })
    emit('signup-successful')
    Object.assign(state, {
      first_name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
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

const openLoginModal = () => {
  emit('open-login-modal')
}
</script>