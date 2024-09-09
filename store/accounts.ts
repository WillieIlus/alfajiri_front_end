import { defineStore } from 'pinia'
import { BASE_URL } from './base'
import { useJobStore } from './jobs'

export const useAccountStore = defineStore('account', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async handleRequest(action, errorMessage) {
      this.loading = true;
      this.error = null;
      try {
        return await action();
      } catch (error) {
        console.error(`${errorMessage}:`, error);
        this.error = error instanceof Error ? error.message : String(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async authenticateUser(endpoint, userData) {
      return this.handleRequest(async () => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        this.token = data.access;
        this.user = userData.email;
        await this.fetchJobs();
      }, 'Authentication failed');
    },

    async signup(userData) {
      return this.authenticateUser('/accounts/users/', userData);
    },

    async login(email, password) {
      return this.authenticateUser('/accounts/jwt/create/', { email, password });
    },

    async updateProfile(profileData) {
      return this.handleRequest(async () => {
        const response = await fetch(`${BASE_URL}/accounts/profile/update/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
          body: profileData, // Send FormData directly
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Profile update error:', errorData);
          console.error('Request payload:', profileData);
          throw new Error(JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.$patch({ user: { ...this.user, ...data } });
      }, 'Failed to update profile');
    },

    async fetchProfile() {
      return this.handleRequest(async () => {
        const response = await fetch(`${BASE_URL}/accounts/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.$patch({ user: data });
      }, 'Failed to fetch profile');
    },

    async fetchCurrentUser() {
      this.loading = true;
      try {
        const response = await fetch(`${BASE_URL}/accounts/users/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        this.user = data;
      } catch (error) {
        console.error('Failed to fetch current user', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchJobs() {
      const jobStore = useJobStore();
      await jobStore.fetchJobs();
    },

    isTokenExpired() {
      if (!this.token) return true;
      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { exp } = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;
      return exp < currentTime;
    },

    async refreshTokenIfNeeded() {
      if (this.isTokenExpired()) {
        await this.refreshToken();
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