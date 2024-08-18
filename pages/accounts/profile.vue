<template>
  <div>
    <Breadcrumbs :title="crumbTitle" :crumbs="breadcrumbs" />
    
    <UContainer>
      <UCard v-if="accountStore.loading">
        <template #header>
          <h1 class="text-2xl font-bold">Loading Profile...</h1>
        </template>
        <div class="space-y-4">
          <USkeleton class="h-32 w-32 rounded-full" />
          <USkeleton class="h-8 w-64" />
          <USkeleton class="h-4 w-full" :count="5" />
        </div>
      </UCard>

      <UCard v-else-if="accountStore.error">
        <template #header>
          <h1 class="text-2xl font-bold text-red-600">Error</h1>
        </template>
        <p class="text-red-600">{{ accountStore.error }}</p>
      </UCard>

      <UCard v-else-if="accountStore.user">
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">{{ crumbTitle }}</h1>
            <UButton icon="i-heroicons-pencil-square" label="Edit Profile" @click="showEditModal = true" />
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="col-span-1">
            <UAvatar
              :src="accountStore.user.avatar || '/default-avatar.png'"
              :alt="accountStore.user.first_name"
              size="2xl"
            />
          </div>
          <div class="col-span-2">
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold mb-2">Personal Information</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="field in personalFields" :key="field.key">
                    <h3 class="font-medium text-gray-600">{{ field.label }}</h3>
                    <p>{{ accountStore.user[field.key] || 'Not provided' }}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-xl font-semibold mb-2">Contact Information</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="field in contactFields" :key="field.key">
                    <h3 class="font-medium text-gray-600">{{ field.label }}</h3>
                    <p>{{ accountStore.user[field.key] || 'Not provided' }}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-xl font-semibold mb-2">Additional Information</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="field in additionalFields" :key="field.key">
                    <h3 class="font-medium text-gray-600">{{ field.label }}</h3>
                    <p>{{ accountStore.user[field.key] || 'Not provided' }}</p>
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
                <UFormGroup 
                  v-for="field in group.fields" 
                  :key="field.key" 
                  :label="field.label"
                >
                  <UInput 
                    v-if="field.type === 'text'"
                    v-model="profileData[field.key]"
                    :placeholder="field.label"
                  />
                  <UTextarea
                    v-else-if="field.type === 'textarea'"
                    v-model="profileData[field.key]"
                    :placeholder="field.label"
                  />
                  <USelect
                    v-else-if="field.type === 'select'"
                    v-model="profileData[field.key]"
                    :options="field.options"
                  />
                  <UInput
                    v-else-if="field.type === 'date'"
                    v-model="profileData[field.key]"
                    type="date"
                  />
                  <UInput
                    v-else-if="field.type === 'file'"
                    type="file"
                    @change="handleFileUpload($event, field.key)"
                    accept="image/*"
                  />
                </UFormGroup>
              </div>
            </div>
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

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAccountStore } from '~/store/accounts';
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();
const { user, loading, error } = storeToRefs(accountStore);

const showEditModal = ref(false);
const profileData = ref({});
const updating = ref(false);

const personalFields = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'middle_name', label: 'Middle Name' },
  { key: 'gender', label: 'Gender' },
  { key: 'date_of_birth', label: 'Date of Birth' },
];

const contactFields = [
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
];

const additionalFields = [
  { key: 'bio', label: 'Bio' },
  { key: 'website', label: 'Website' },
];

const groupedEditableFields = [
  {
    title: 'Personal Information',
    fields: [
      { key: 'first_name', label: 'First Name', type: 'text' },
      { key: 'last_name', label: 'Last Name', type: 'text' },
      { key: 'middle_name', label: 'Middle Name', type: 'text' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
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

const crumbTitle = computed(() => `${accountStore.user?.first_name || 'User'}'s Profile`);

const breadcrumbs = computed(() => [
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
  { label: crumbTitle.value, icon: 'i-heroicons-user' },
]);

onMounted(async () => {
  if (!accountStore.isLoggedIn) {
    navigateTo('/login');
  } else {
    await accountStore.fetchCurrentUser();
    profileData.value = { ...accountStore.user };
  }
});

const handleFileUpload = (event, field) => {
  profileData.value[field] = event.target.files[0];
};

const updateProfile = async () => {
  updating.value = true;
  try {
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    for (const key in profileData.value) {
      if (profileData.value[key] !== null && profileData.value[key] !== undefined) {
        formData.append(key, profileData.value[key]);
      }
    }

    // Update profile using the account store's updateProfile method
    await accountStore.updateProfile(formData);
    
    showEditModal.value = false;
    useToast().add({ title: 'Profile updated successfully', color: 'green' });
  } catch (error) {
    useToast().add({ title: 'Failed to update profile', color: 'red' });
  } finally {
    updating.value = false;
  }
};
</script>
