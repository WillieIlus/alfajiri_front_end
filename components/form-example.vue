<template>
  <UContainer>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="flex flex-wrap">
        <div class="flex flex-wrap w-full p-2 ">
          <p class="w-3/4">you are currently sign in as {{  user?.email || "Can't find mail " }} </p>
          <UButton label="Sign Out" size="xl" block class="w-1/4" />
        </div>
        <div class="w-full p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-wrap gap-4 items-center">
          <UFormGroup class="flex-auto" size="xl" name="select" label="Select">
            <USelect v-model="state.select" placeholder="Select..." :options="options" />
          </UFormGroup>
          <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-pencil-square" size="sm"
            color="primary" :ui="{ rounded: 'rounded-full' }" variant="solid" @click="openModal" />
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-wrap gap-4 items-center">
          <UFormGroup class="flex-auto" size="xl" name="select" label="Select">
            <USelect v-model="state.select" placeholder="Select..." :options="options" />
          </UFormGroup>
          <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-pencil-square" size="sm"
            color="primary" :ui="{ rounded: 'rounded-full' }" variant="solid" />
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 flex flex-wrap gap-4 items-center">
          <UFormGroup class="flex-auto" size="xl" name="select" label="Select">
            <USelect v-model="state.select" placeholder="Select..." :options="options" />
          </UFormGroup>
          <UButton class="mt-6 min-w-4 max-w-12 max-h-12 min-h-4" icon="i-heroicons-pencil-square" size="sm"
            color="primary" :ui="{ rounded: 'rounded-full' }" variant="solid" />
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full lg:w-1/3 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full p-2 ">
          <UFormGroup size="xl" name="textarea" label="Textarea">
            <UTextarea v-model="state.textarea" :rows="6" max-rows="12" autoresize />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2 p-2 ">
          <UFormGroup size="xl" name="input" label="Input">
            <UInput v-model="state.input" />
          </UFormGroup>
        </div>
      </div>


      <UButton type="submit">
        Submit
      </UButton>

      <UButton variant="outline" class="ml-2" @click="form.clear()">
        Clear
      </UButton>
    </UForm>
  </UContainer>
</template>
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import SwalifyModal from './swalifyModal.vue';

const props = defineProps({
  user: {
    type: Object,
  },
  error: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const modal = useModal()

const options = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

const state = reactive({
  input: undefined,
  inputMenu: undefined,
  textarea: undefined,
  select: undefined,
  selectMenu: undefined,
  checkbox: undefined,
  toggle: undefined,
  radio: undefined,
  radioGroup: undefined,
  switch: undefined,
  range: undefined
})

const schema = z.object({
  input: z.string().min(10),
  inputMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  textarea: z.string().min(10),
  select: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  selectMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  toggle: z.boolean().refine(value => value === true, {
    message: 'Toggle me'
  }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radio: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  radioGroup: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  range: z.number().max(20, { message: 'Must be less than 20' })
})

type Schema = z.infer<typeof schema>

const form = ref()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
}

function openModal () {
  modal.open(SwalifyModal, {
  })
}
</script>