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

    async fetchProfile() {
      await this.refreshTokenIfNeeded();
      try {
        const response = await fetch(`${BASE_URL}/accounts/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const data = await response.json();
        this.user = data;
      } catch (error) {
        console.error('Failed to fetch profile', error);
        throw error;
      }
    },

    async updateProfile(profileData) {
      const accountStore = useAccountStore()
      const token = accountStore.token
      try {
        const formData = new FormData();
        for (const key in profileData) {
          formData.append(key, profileData[key]);
        }

        const response = await fetch(`${BASE_URL}/accounts/profile/update/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: formData,
        });
        const data = await response.json();
        this.user = { ...this.user, ...data };
      } catch (error) {
        console.error('Failed to update profile', error);
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