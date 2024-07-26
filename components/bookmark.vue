<template>
  <div>
    <button @click="toggleBookmark" :class="{ 'bookmarked': isBookmarked }">
      {{ isBookmarked ? 'Unbookmark' : 'Bookmark' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookmarkStore } from '@/store/bookmarkStore'

const props = defineProps({
  jobSlug: {
    type: String,
    required: true,
  },
})

const bookmarkStore = useBookmarkStore()

const isBookmarked = computed(() => 
  bookmarkStore.bookmarks.some(bookmark => bookmark.job.slug === props.jobSlug)
)

const bookmarkId = computed(() => {
  const bookmark = bookmarkStore.bookmarks.find(b => b.job.slug === props.jobSlug)
  return bookmark ? bookmark.id : null
})

const toggleBookmark = async () => {
  if (isBookmarked.value) {
    await bookmarkStore.removeBookmark(bookmarkId.value)
  } else {
    await bookmarkStore.addBookmark(props.jobSlug)
  }
}
</script>

<style scoped>
.bookmarked {
  background-color: #4CAF50;
  color: white;
}
</style>