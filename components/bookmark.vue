<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Bookmarks</h2>
    <ul class="space-y-2">
      <li v-for="bookmark in bookmarks" :key="bookmark.id" class="flex justify-between items-center bg-gray-100 p-2 rounded">
        <span>Job ID: {{ bookmark.job }}</span>
        <button @click="removeBookmark(bookmark.job)" class="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
      </li>
    </ul>
    <div class="mt-4">
      <input v-model="newJobId" type="number" placeholder="Enter Job ID" class="border p-2 mr-2">
      <button @click="addBookmark" class="bg-blue-500 text-white px-4 py-2 rounded">Add Bookmark</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useJobStore } from '~/store/jobs'

const jobStore = useJobStore
const { bookmarks } = storeToRefs(jobStore)
const newJobId = ref<number | null>(null)

onMounted(() => {
  jobStore.fetchBookmarks()
})

const addBookmark = () => {
  if (newJobId.value) {
    jobStore.addBookmark(newJobId.value)
    newJobId.value = null
  }
}

const removeBookmark = (jobId: number) => {
  jobStore.removeBookmark(jobId)
}

</script>