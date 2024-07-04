<template>
  <CustomContainer>
    <UCard class="mb-5">
      <UForm :schema="schema" :state="state" class="flex justify-center gap-4"
        @submit="onSubmit">
        <UFormGroup size="xl" name="email" class="grow">
          <UInput v-model="state.email" icon="i-heroicons-magnifying-glass" />
        </UFormGroup>

        <UFormGroup size="xl" name="password" class="grow">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup size="xl" name="email" class="grow">
          <UInput v-model="state.email" icon="i-heroicons-map-pin" trailing />
        </UFormGroup>

        <UButton size="xl" type="submit" class="grow sm:grow-0 px-5 text-center">
          Find Jobs
        </UButton>
      </UForm>
    </UCard>
  </CustomContainer>

</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
}
</script>
