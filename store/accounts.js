import { defineStore } from 'pinia'
import { BASE_URL } from './base'
import { useJobStore } from './jobs'

export const useAccountStore = defineStore('account', {
  state: () => ({
    token: null,
    user: null,
    userById: null,
    refresh: null,
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async signup(userData) {
      try {
        const response = await fetch(`${BASE_URL}/accounts/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Bad Request Error:', errorData);
          throw new Error(JSON.stringify(errorData));
        }
        const data = await response.json();
        this.token = data.access;
        this.user = userData.email;
        await this.fetchJobs();
      } catch (error) {
        console.error('signup failed', error);
        throw error;
      }
    },

    async login(email, password) {
      try {
        const response = await fetch(`${BASE_URL}/accounts/jwt/create/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        this.token = data.access;
        this.user = email;
        await this.fetchJobs();
      } catch (error) {
        console.error('login failed', error);
        throw error;
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await fetch(`${BASE_URL}/accounts/users/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        const data = await response.json();
        this.user = data;
      } catch (error) {
        console.error('Failed to fetch current user', error);
        throw error;
      }
    },

    async fetchJobs() {
      const jobStore = useJobStore();
      await jobStore.fetchJobs();
    },

    async updateUser(userData) {
      try {
        this.loading = true;
        this.error = null;

        let body;
        let headers = {
          'Authorization': `Bearer ${this.token}`
        };

        if (userData instanceof FormData) {
          body = userData;
        } else {
          body = JSON.stringify(userData);
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${BASE_URL}/accounts/me/`, {
          method: 'PATCH',
          headers: headers,
          body: body,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        const updatedUser = await response.json();
        this.user = updatedUser;
        this.token = updatedUser.token;
        return updatedUser;
      } catch (error) {
        this.error = error.message;
        console.error('Error updating user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.userById = null;
      this.refresh = null;
    },
  },
  persist: true,
})
