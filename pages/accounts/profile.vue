<template>
  <div>
    <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />

    <UContainer>
      <UCard v-if="loading">
        <template #header>
          <h1 class="text-2xl font-bold">Loading Profile...</h1>
        </template>
        <div class="space-y-4">
          <USkeleton class="h-32 w-32 rounded-full" />
          <USkeleton class="h-8 w-64" />
          <USkeleton class="h-4 w-full" :count="5" />
        </div>
      </UCard>

      <UCard v-else-if="error">
        <template #header>
          <h1 class="text-2xl font-bold text-red-600">Error</h1>
        </template>
        <p class="text-red-600">{{ error }}</p>
      </UCard>

      <UCard v-else-if="user">
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">{{ crumbTitle }}</h1>
            <UButton icon="i-heroicons-pencil-square" label="Edit Profile" @click="showEditModal = true" />
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="col-span-1">
            <UAvatar :src="user.avatar || '/default-avatar.png'" :alt="user.first_name" size="6xl"
              chip-position="top-left" chip-color="primary" chip-text="" />
          </div>
          <div class="col-span-2">
            <div class="space-y-6">
              <div v-for="group in groupedFields" :key="group.title">
                <h2 class="text-xl font-semibold mb-2">{{ group.title }}</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="field in group.fields" :key="field.key">
                    <h3 class="font-medium text-gray-600">{{ field.label }}</h3>
                    <p>{{ user[field.key] || 'Not provided' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UModal v-model="showEditModal">
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold">Edit Profile</h2>
          </template>
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div v-for="group in groupedEditableFields" :key="group.title">
              <h3 class="text-lg font-semibold mb-2">{{ group.title }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup v-for="field in group.fields" :key="field.key" :label="field.label" :name="field.key">
                  <UInput v-if="field.type === 'text'" v-model="profileData[field.key]" :placeholder="field.label" />
                  <div v-else-if="field.type === 'textarea'">
                    <TiptapEditor v-if="field.key === 'bio'" ref="tiptapEditor" v-model="profileData[field.key]"
                      :placeholder="field.label" />
                    <UTextarea v-else v-model="profileData[field.key]" :placeholder="field.label" />
                  </div>
                  <USelect v-else-if="field.type === 'select'" v-model="profileData[field.key]"
                    :options="field.options" />
                  <UPopover v-else-if="field.type === 'date'" mode="click" :popper="{ placement: 'bottom-start' }">
                    <UInput :model-value="formatDate(profileData[field.key])" placeholder="Select date" readonly>
                      <template #trailing>
                        <UIcon name="i-heroicons-calendar" />
                      </template>
                    </UInput>
                    <template #panel="{ close }">
                      <DatePicker v-model="profileData[field.key]" @update:model-value="close" />
                    </template>
                  </UPopover>
                  <div v-else-if="field.type === 'file'">
                    <input type="file" @change="(event) => handleFileUpload(event, field.key)" accept="image/*" />
                    <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="mt-2 max-w-xs" />
                  </div>
                </UFormGroup>
              </div>
            </div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div class="flex justify-end space-x-2">
              <UButton label="Cancel" @click="showEditModal = false" />
              <UButton type="submit" color="primary" label="Update Profile" :loading="updating" />
            </div>
          </form>
        </UCard>
      </UModal>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAccountStore } from '~/store/accounts';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
// import { useToast } from '@/composables/useToast';
import { z } from 'zod';
import DatePicker from '~/components/date-picker.vue';
import TiptapEditor from '~/components/TiptapEditor.vue';

// Define types
interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth?: Date;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  bio?: string;
  website?: string;
  avatar?: string;
}

interface BackendUser extends Omit<User, 'gender'> {
  gender: 'M' | 'F' | 'O';
}

interface Field {
  key: keyof User;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
}

interface FieldGroup {
  title: string;
  fields: Field[];
}

const router = useRouter();
const accountStore = useAccountStore();
const { user, loading, error } = storeToRefs(accountStore);
const successMessage = ref('')
const errorMessage = ref('')

const showEditModal = ref(false);
const profileData = ref<Partial<User>>({});
const updating = ref(false);
const imagePreview = ref<string | null>(null);
const tiptapEditor = ref<InstanceType<typeof TiptapEditor> | null>(null);


const groupedFields: FieldGroup[] = [
  {
    title: 'Personal Information',
    fields: [
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'middle_name', label: 'Middle Name' },
      { key: 'gender', label: 'Gender' },
      { key: 'date_of_birth', label: 'Date of Birth' },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City' },
    ],
  },
  {
    title: 'Additional Information',
    fields: [
      { key: 'bio', label: 'Bio' },
      { key: 'website', label: 'Website' },
    ],
  },
];


const groupedEditableFields: FieldGroup[] = [
  {
    title: 'Personal Information',
    fields: [
      { key: 'first_name', label: 'First Name', type: 'text' },
      { key: 'last_name', label: 'Last Name', type: 'text' },
      { key: 'middle_name', label: 'Middle Name', type: 'text' },
      {
        key: 'gender', label: 'Gender', type: 'select', options: [
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
          { value: 'O', label: 'Other' }
        ]
      },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
      { key: 'avatar', label: 'Avatar', type: 'file' },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
    ],
  },
  {
    title: 'Additional Information',
    fields: [
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'website', label: 'Website', type: 'text' },
    ],
  },
];

const schema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  middle_name: z.string().optional().nullable(),
  gender: z.enum(['M', 'F', 'O']).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  website: z.union([
    z.string().url(),
    z.string().max(0),
    z.null()
  ]).optional(),
  avatar: z.any().optional(),
  // avatar: z.instanceof(File).optional(),
});

const crumbTitle = computed(() => `${user.value?.first_name || 'User'}'s Profile`);

const breadcrumbs = computed(() => [
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
  { label: crumbTitle.value, icon: 'i-heroicons-user' },
]);

onMounted(async () => {
  if (!accountStore.isLoggedIn) {
    router.push('/login');
  } else {
    try {
      await accountStore.fetchProfile();
      populateForm();
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      errorMessage.value = `Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  }
});

watch(() => user.value, (newUser) => {
  if (newUser) {
    populateForm();
  }
}, { deep: true });

const updateProfile = async () => {
  updating.value = true;
  errorMessage.value = '';

  try {
    const bioContent = tiptapEditor.value?.editor ? tiptapEditor.value.editor.getHTML() : profileData.value.bio;
    const dataToValidate = {
      ...profileData.value,
      bio: bioContent,
      website: profileData.value.website || null,
    };

    const validatedData = await schema.parseAsync(dataToValidate);

    const formData = new FormData();
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value != null && value !== '') {
        if (key === 'date_of_birth' && value instanceof Date) {
          formData.append(key, value.toISOString().split('T')[0]);
        } else if (key === 'avatar') {
          // Only append avatar if it's a File object
          if (value instanceof File) {
            formData.append(key, value, value.name);
          }
          // If it's not a File, we don't append it at all
        } else {
          formData.append(key, String(value));
        }
      }
    });

    await accountStore.updateProfile(formData);
    showEditModal.value = false;
    successMessage.value = 'Profile updated successfully';
    clearForm();
  } catch (err) {
    if (err instanceof z.ZodError) {
      errorMessage.value = err.errors.map(error => `${error.path.join('.')}: ${error.message}`).join('\n');
    } else {
      errorMessage.value = `Failed to update profile: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
    console.error('Update profile error:', err);
  } finally {
    updating.value = false;
  }
};
const handleFileUpload = (event: Event, key: keyof User) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files.length > 0) {
    profileData.value[key] = target.files[0] as any;
    imagePreview.value = URL.createObjectURL(target.files[0]);
  }
};

const clearForm = () => {
  populateForm();
  imagePreview.value = null;
};

const formatDate = (date: Date | string | null): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const convertGender = (backendGender: 'M' | 'F' | 'O'): 'male' | 'female' | 'other' => {
  const genderMap: Record<'M' | 'F' | 'O', 'male' | 'female' | 'other'> = {
    'M': 'male',
    'F': 'female',
    'O': 'other'
  };
  return genderMap[backendGender];
};

const populateForm = () => {
  if (user.value) {
    profileData.value = { ...user.value };
    if (profileData.value.gender) {
      profileData.value.gender = profileData.value.gender as 'M' | 'F' | 'O';
    }
    if (tiptapEditor.value?.editor) {
      tiptapEditor.value.editor.commands.setContent(user.value.bio || '');
    }
  }
};
</script>