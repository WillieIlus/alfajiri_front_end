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
    async signup(first_name, phone, email, password) {
      try {
        const response = await fetch(`${BASE_URL}/accounts/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ first_name, phone, email, password }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Bad Request Error:', errorData);
          const error = new Error(errorData.detail);
          throw error;
        }
        const data = await response.json();
        this.token = data.access;
        this.user = email;
      } catch (error) {
        console.error('signup failed', error);
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

