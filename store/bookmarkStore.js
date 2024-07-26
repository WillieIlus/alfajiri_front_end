import { defineStore } from 'pinia';
import { BASE_URL } from './base'
import { useAccountStore } from './accounts'

export const useBookmarkStore = defineStore('bookmark', {
  state: () => ({
    bookmarks: [],
    loading: false,
    error: null,
  }),
  getters: {
    getBookmarks: (state) => state.bookmarks,
    bookmarksCount: (state) => state.bookmarks.length,
  },
  actions: {
    async fetchBookmarks() {
      this.loading = true;
      try {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token,
        };
        const response = await fetch(`${BASE_URL}/jobs/bookmarks/`, {
          method: 'GET',
          headers: headers,
        });
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        const data = await response.json();
        this.bookmarks = data;
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async addBookmark(jobSlug) {
      try {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        };
        const response = await fetch(`${BASE_URL}/jobs/jobs/${jobSlug}/bookmark/`, {
          method: 'POST',
          headers: headers,
        });
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        const data = await response.json();
        this.bookmarks.push(data);
      } catch (error) {
        console.error('Error adding bookmark:', error);
        this.error = error.message;
      }
    },

    async removeBookmark(bookmarkId) {
      try {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token,
        };
        const response = await fetch(`${BASE_URL}/jobs/bookmarks/${bookmarkId}/`, {
          method: 'DELETE',
          headers: headers,
        });
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
      } catch (error) {
        console.error('Error removing bookmark:', error);
        this.error = error.message;
      }
    },
  },
});