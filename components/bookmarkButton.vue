<template>
  <button 
    @click="toggleBookmark" 
    :disabled="bookmarkStore.loading"
    class="px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out flex items-center justify-center"
    :class="{
      'bg-blue-500 hover:bg-blue-600': !isBookmarked,
      'bg-red-500 hover:bg-red-600': isBookmarked,
      'opacity-50 cursor-not-allowed': bookmarkStore.loading
    }"
  >
    <span v-if="bookmarkStore.loading">Loading...</span>
    <UIcon
      v-else
      :name="isBookmarked ? 'i-heroicons-solid:heart' : 'i-heroicons-outline:heart'"
      class="w-5 h-5"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBookmarkStore } from '@/store/bookmarkStore';

const bookmarkStore = useBookmarkStore();
const { bookmarks } = storeToRefs(bookmarkStore);
const isBookmarked = ref(false);

const props = defineProps({
  jobSlug: {
    type: String,
    required: true,
  },
});

const checkIfBookmarked = () => {
  isBookmarked.value = bookmarks.value.some(bookmark => bookmark.job.slug === props.jobSlug);
};

onMounted(async () => {
  if (bookmarks.value.length === 0) {
    await bookmarkStore.fetchBookmarks();
  }
  checkIfBookmarked();
});

watch(bookmarks, checkIfBookmarked);

const toggleBookmark = async () => {
  if (isBookmarked.value) {
    const bookmark = bookmarks.value.find(b => b.job.slug === props.jobSlug);
    if (bookmark) {
      await bookmarkStore.removeBookmark(bookmark.id);
    }
  } else {
    await bookmarkStore.addBookmark(props.jobSlug);
  }
};
</script>