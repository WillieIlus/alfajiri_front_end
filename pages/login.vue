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
              <img src="assets/images/LogoWhite.png" class="mx-auto h-[24px] dark:block hidden" alt="">
            </a>
            <h5 class="my-6 text-xl font-semibold">Login</h5>
            <UForm :schema="schema" :state="state" class="text-start" @submit="onSubmit">
              <div class="grid grid-cols-1">
                <UFormGroup label="Email Address:" name="email">
                  <UInput v-model="state.email" type="email" placeholder="name@example.com"/>
                </UFormGroup>

                <UFormGroup label="Password:" name="password">
                  <UInput v-model="state.password" type="password" placeholder="Password"/>
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
                  <NuxtLink to="/signup"
                    class="text-black dark:text-white font-bold">Sign up</NuxtLink>
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

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useAccountStore } from '~/store/accounts'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'auth'
})

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
    await accountStore.login(data.email, data.password)
    console.log('Login successful')
    router.push('/')
  } catch (err: any) {
    console.error(err)
    if (err.response && err.response.status === 401) {
      error.value = 'Invalid email or password'
    } else {
      error.value = 'An error occurred. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>