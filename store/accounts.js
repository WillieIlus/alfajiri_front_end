import { defineStore } from 'pinia'
import { BASE_URL } from './base'

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
      } catch (error) {
        console.error('signup failed', error);
        throw error;
      }
    },

    async login(email, password) {
      const response = await fetch(`${BASE_URL}/accounts/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      this.token = data.access
      this.user = email
    },

    async refresh() {
      const response = await fetch(`${BASE_URL}/accounts/jwt/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: this.refresh }),
      })
      const data = await response.json()
      this.token = data.access
    },

    async getUser() {
      const response = await fetch(`${BASE_URL}/accounts/users/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      })
      const data = await response.json()
      this.user = data
    },

    async getUserById() {
      const id = this.user.id
      const response = await fetch(`${BASE_URL}/accounts/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      })
      const data = await response.json()
      this.userById = data
    },

    async updateUser(data) {
      try {
        const response = await fetch(`${BASE_URL}/accounts/users/me/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: data,
        });
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        const responseData = await response.json();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },

    logout() {
      this.token = null
      this.user = null
    },
  },
  persist: true,
})

