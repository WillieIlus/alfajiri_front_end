import { defineStore } from 'pinia'
import { BASE_URL } from './base'
import { useAccountStore } from './accounts'


export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [],
    relatedJobs: [],
    bookmarks: [],
    currentPage: 1,
    itemsPerPage: 10,
    job: null,
    loading: false,
    error: null,
    query: "",
  }),
  getters: {
    paginatedJobs: (state) => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.jobs.slice(startIndex, endIndex);
    },
    totaljobs: (state) => state.jobs.length,
    totalPages: (state) => Math.ceil(state.jobs.length / state.itemsPerPage),
  },
  actions: {
    async handleError(action) {
      this.loading = true;
      try {
        await action();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchJobs({ title = '', location = '', category = '', company = '', min_salary = '', max_salary = '', job_type = '', vacancies = '' } = {}) {
      await this.handleError(async () => {
        const response = await fetch(`${BASE_URL}/jobs`);
        const data = await response.json();
        this.jobs = data;
      });
    },

    async fetchJob(slug) {
      this.loading = true;
      try {
        const response = await fetch(`${BASE_URL}/jobs/${slug}/`);
        const data = await response.json();
        this.job = data;
        this.relatedJobs = data.related_jobs || [];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createJob(data) {
      this.loading = true;
      try {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        const response = await fetch(`${BASE_URL}/jobs/`, {
          method: 'POST',
          headers: headers,
          body: data,
        });
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        const responseData = await response.json();
        this.jobs.push(responseData)
        await this.fetchJobs()
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false
      }
    },

    async updateJob(slug, data) {
      this.loading = true;
      try {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        const response = await fetch(`${BASE_URL}/jobs/${slug}/`, {
          method: 'PUT',
          headers: headers,
          body: data,
        });
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        const responseData = await response.json();
        this.jobs = this.jobs.map(job => job.slug === slug ? responseData : job);
        await this.fetchJobs();
      } catch (error) {
        console.error('Error updating job:', error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async deleteJob(slug) {
      await this.handleError(async () => {
        await fetch(`${BASE_URL}/jobs/${slug}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        this.jobs = this.jobs.filter((job) => job.slug !== slug);
      });
    },
    setCurrentPage(page) {
      const totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
      this.currentPage = Math.max(1, Math.min(totalPages, page));
    },
    
    async fetchBookmarks() {
      await this.handleError(async () => {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        const response = await fetch(`${BASE_URL}/jobs/bookmarks/`, {
          headers: headers
        });
        const data = await response.json();
        this.bookmarks = data;
      });
    },

    async addBookmark(jobId) {
      await this.handleError(async () => {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        };
        const response = await fetch(`${BASE_URL}/jobs/bookmark/${jobId}/`, {
          method: 'POST',
          headers: headers
        });
        const data = await response.json();
        this.bookmarks.push(data);
      });
    },

    async removeBookmark(jobId) {
      await this.handleError(async () => {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        await fetch(`${BASE_URL}/jobs/unbookmark/${jobId}/`, {
          method: 'DELETE',
          headers: headers
        });
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.job !== jobId);
      });
    },
  },
})