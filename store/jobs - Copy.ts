import { defineStore } from 'pinia'
import { BASE_URL } from './base'
import { useAccountStore } from './accounts'
import { fetchWithErrorHandling } from '~/utils/api'

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
    totalJobs: 0,
    query: "",
  }),

  getters: {
    paginatedJobs: (state) => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.jobs.slice(startIndex, endIndex);
    },
    hasMoreItems: (state) => state.itemsPerPage < state.totalJobs,
    totalJobCount: (state) => state.jobs.length,
    totalPages: (state) => Math.ceil(state.jobs.length / state.itemsPerPage),
    isBookmarked: (state) => (jobId) => {
      return state.bookmarks.some(bookmark => bookmark.job.id === jobId)
    },
    getBookmarkCount: (state) => (jobId) => {
      return state.jobs.find(job => job.id === jobId)?.bookmarks || 0
    }
  },
  actions: {
    async handleError(action) {
      this.loading = true
      this.error = null
      try {
        return await action()
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error)
        console.error('An error occurred:', this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createJob(data: FormData) {
      await this.handleError(async () => {
        const accountStore = useAccountStore()
        const token = accountStore.token
        const response = await fetch(`${BASE_URL}/jobs/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: data,
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Server responded with ${response.status}: ${JSON.stringify(errorData)}`)
        }
        const newJob = await response.json()
        this.jobs.push(newJob)
        return newJob
      })
    },

    async updateJob(slug, data: FormData) {
      return await this.handleError(async () => {
        const accountStore = useAccountStore()
        const token = accountStore.token
        const response = await fetch(`${BASE_URL}/jobs/${slug}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: data,
        })
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Update failed:', errorData)
          throw new Error(`Server responded with ${response.status}: ${JSON.stringify(errorData)}`)
        }
        const updatedJob = await response.json()
        this.jobs = this.jobs.map(job => job.slug === slug ? updatedJob : job)
        if (this.job && this.job.slug === slug) {
          this.job = updatedJob
        }
        return updatedJob
      })
    },

    async applyForJob(jobId, data) {
      const accountStore = useAccountStore()
      const token = accountStore.token
      const formData = new FormData()

      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      try {
        const response = await fetch(`${BASE_URL}/jobs/apply/${jobId}/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type, let the browser set it for FormData
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Application failed:', errorData)
          throw new Error(errorData.error || `Server responded with ${response.status}: ${JSON.stringify(errorData)}`)
        }

        const newAppliedJob = await response.json()
        return newAppliedJob
      } catch (error) {
        console.error('Error in applyForJob:', error)
        throw error  // Re-throw the error so the component can handle it
      }
    },

    async fetchJobs(params = {}) {
      this.loading = true
      this.error = null
      try {
        const queryParams = new URLSearchParams(params).toString()
        const response = await fetch(`${BASE_URL}/jobs?${queryParams}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        console.log('Response data:', data)

        if (!Array.isArray(data)) {
          console.error('data is not an array:', data)
          throw new Error('Invalid response format: data is not an array')
        }

        this.jobs = data
        this.totalJobs = data.length
        // console.log('Processed jobs:', this.jobs)
        // console.log('Total jobs:', this.totalJobs)

      } catch (error) {
        console.error('Error fetching jobs:', error)
        this.error = 'Failed to fetch jobs. Please try again.'
      } finally {
        this.loading = false
      }
    },

    incrementItemsPerPage() {
      this.itemsPerPage += 10
    },

    async fetchJob(slug) {
      await this.handleError(async () => {
        const response = await fetch(`${BASE_URL}/jobs/${slug}/`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        this.job = data;
        this.relatedJobs = data.related_jobs || [];
      });
    },



    async deleteJob(slug) {
      await this.handleError(async () => {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const response = await fetch(`${BASE_URL}/jobs/${slug}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to delete job');
        this.jobs = this.jobs.filter((job) => job.slug !== slug);
        if (this.job && this.job.slug === slug) {
          this.job = null;
        }
      });
    },

    setCurrentPage(page) {
      const totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
      this.currentPage = Math.max(1, Math.min(totalPages, page));
    },


    async toggleBookmark(jobId) {
      const accountStore = useAccountStore();
      if (!accountStore.isLoggedIn) {
        console.log('User must be signed in to bookmark');
        return;
      }

      // Optimistic update
      const isCurrentlyBookmarked = this.isBookmarked(jobId);
      this.updateBookmarkState(jobId, !isCurrentlyBookmarked);

      try {
        const endpoint = `${BASE_URL}/jobs/${jobId}/${isCurrentlyBookmarked ? 'unbookmark' : 'bookmark'}/`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accountStore.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to ${isCurrentlyBookmarked ? 'remove' : 'add'} bookmark`);
        }

        this.saveBookmarks();
      } catch (error) {
        // Revert optimistic update if the server request fails
        this.updateBookmarkState(jobId, isCurrentlyBookmarked);
        console.error('Failed to update bookmark:', error);
      }
    },

    updateBookmarkState(jobId, isBookmarked) {
      const accountStore = useAccountStore();
      if (isBookmarked) {
        if (!this.isBookmarked(jobId)) {
          const job = this.jobs.find(j => j.id === jobId);
          this.bookmarks.push({
            job: job,
            user: accountStore.user,
            is_active: true,
            created_at: new Date().toISOString()
          });
        }
      } else {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.job.id !== jobId);
      }
    },

    saveBookmarks() {
      localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    },

    loadSavedBookmarks() {
      const savedBookmarks = localStorage.getItem('bookmarks');
      if (savedBookmarks) {
        this.bookmarks = JSON.parse(savedBookmarks);
      }
    },

    async loadUserBookmarks() {
      const accountStore = useAccountStore();
      if (accountStore.isLoggedIn) {
        await this.handleError(async () => {
          const response = await fetch(`${BASE_URL}/jobs/bookmarks/`, {
            headers: {
              'Authorization': `Bearer ${accountStore.token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to load bookmarks: ${response.status} ${response.statusText}. ${errorData.detail || ''}`);
          }

          this.bookmarks = await response.json();
          this.saveBookmarks();
        });
      } else {
        this.bookmarks = [];
        this.saveBookmarks();
      }
    },

    incrementViewCount(jobId) {
      const job = this.jobs.find(j => j.id === jobId);
      if (job) {
        job.view_count += 1;
      }
      if (this.job && this.job.id === jobId) {
        this.job.view_count += 1;
      }
    },

    incrementClickCount(jobId) {
      const job = this.jobs.find(j => j.id === jobId);
      if (job) {
        job.click_count += 1;
      }
      if (this.job && this.job.id === jobId) {
        this.job.click_count += 1;
      }
    },

    incrementApplyCount(jobId) {
      const job = this.jobs.find(j => j.id === jobId);
      if (job) {
        job.apply_count += 1;
      }
      if (this.job && this.job.id === jobId) {
        this.job.apply_count += 1;
      }
    },
  },
},
);
