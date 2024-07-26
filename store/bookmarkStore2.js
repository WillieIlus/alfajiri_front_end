// stores/bookmarkStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useBookmarkStore = defineStore('bookmark', {
  state: () => ({
    bookmarks: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchBookmarks() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/bookmarks/');
        this.bookmarks = response.data;
        this.isLoading = false;
      } catch (error) {
        this.error = 'Failed to fetch bookmarks';
        this.isLoading = false;
      }
    },

    async addBookmark(jobId) {
      try {
        const response = await axios.post('/api/bookmarks/', { job_id: jobId });
        this.bookmarks.push(response.data);
      } catch (error) {
        this.error = 'Failed to add bookmark';
      }
    },

    async removeBookmark(bookmarkId) {
      try {
        await axios.delete(`/api/bookmarks/${bookmarkId}/`);
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      } catch (error) {
        this.error = 'Failed to remove bookmark';
      }
    },
  },
});