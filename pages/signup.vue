<template>
  <section
    class="h-screen flex items-center justify-center relative overflow-hidden bg-[url('../../assets/images/background.jpg')] bg-no-repeat bg-center bg-cover">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    <div class="container">
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <div class="relative overflow-hidden bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
          <div class="p-6">
            <a href="">
              <img src="assets/images/Logo.png" class="mx-auto h-[24px] block dark:hidden" alt="">
              <img src="assets/images/logoWhite.png" class="mx-auto h-[24px] dark:block hidden" alt="">
            </a>
            <h5 class="my-6 text-xl font-semibold">Signup</h5>
            <UForm :schema="schema" :state="state" class="text-start" @submit="onSubmit">
              <div class="grid grid-cols-1">
                <UFormGroup label="Your Name:" name="first_name">
                  <UInput v-model="state.first_name" type="text" placeholder="Harry"/>
                </UFormGroup>

                <UFormGroup label="Phone:" name="phone">
                  <UInput v-model="state.phone" type="text" placeholder="Phone number"/>
                </UFormGroup>

                <UFormGroup label="Email Address:" name="email">
                  <UInput v-model="state.email" type="email" placeholder="name@example.com"/>
                </UFormGroup>

                <UFormGroup label="Password:" name="password">
                  <UInput v-model="state.password" type="password" placeholder="Password"/>
                </UFormGroup>

                <UFormGroup label="Confirm Password:" name="password_confirmation">
                  <UInput v-model="state.password_confirmation" type="password" placeholder="Confirm Password"/>
                </UFormGroup>

                <div class="mb-4">
                  <div class="flex items-center mb-0">
                    <input
                      class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
                      type="checkbox" value="" id="Accept:T&C">
                    <label class="form-checkbox-label text-slate-400" for="Accept:T&C">I Accept <NuxtLink to="/terms" class="text-emerald-600">Terms And Condition</NuxtLink></label>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="flex items center mb-0">
                    <input
                      class="form-checkbox rounded border-gray-200 dark:border-gray-800 text-emerald-600 focus:border-emerald-300 focus:ring focus:ring-offset-0 focus:ring-emerald-200 focus:ring-opacity-50 me-2"
                      type="checkbox" value="" id="Accept:PrivacyPolicy">
                    <label class="form-checkbox-label text-slate-400" for="Accept:PrivacyPolicy">I Accept <NuxtLink to="/privacy" class="text-emerald-600">Privacy Policy</NuxtLink></label>
                  </div>
                </div>

                <UButton type="submit" :loading="submitting">
                  Sign Up
                </UButton>

                <div class="text-center mt-4">
                  <span class="text-slate-400 me-2">Already have an account ? </span> 
                  <NuxtLink to="/login"
                    class="text-black dark:text-white font-bold">Sign in</NuxtLink>
                </div>
              </div>
            </UForm>
            <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { useAccountStore } from '~/store/accounts'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth'
})

const accountStore = useAccountStore()
const router = useRouter()

const submitting = ref(false)
const error = ref(null)

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

const state = reactive({
  first_name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const onSubmit = async (event) => {
  const { data } = event
  submitting.value = true
  error.value = ''

  try {
    console.log('Submitting Sign Up...')
    const { password_confirmation, ...signupData } = data
    await accountStore.signup(signupData)
    console.log('Account Created Successfully')
    router.push('/login')
  } catch (err) {
    console.error(err)
    if (err.response && err.response.data) {
      error.value = Object.entries(err.response.data)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join('; ')
    } else {
      error.value = err.message || 'An error occurred. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>