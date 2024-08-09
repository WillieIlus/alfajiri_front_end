import { BASE_URL } from './base'
import { defineStore } from 'pinia'
import { useAccountStore } from './accounts'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [],
    company: null,
    loading: false,
    error: null,
  }),
  getters: {
    getCompanies: (state) => state.companies,
    getCompany: (state) => state.company,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    companiesCount: (state) => state.companies.length,
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

    async fetchCompaniesByCategory(slug) {
      await this.handleError(async () => {
        const response = await fetch(`${BASE_URL}/companies/category/${slug}`);
        const data = await response.json();
        this.companies = data;
      });
    },

    async fetchCompanies() {
      await this.handleError(async () => {
        const response = await fetch(`${BASE_URL}/companies`);
        const data = await response.json();
        this.companies = data;
      });
    },

    async fetchCompaniesByUser(userId) {
      this.loading = true;
      await this.handleError(async () => {
        const response = await fetch(`${BASE_URL}/companies?userId=${userId}`);
        const data = await response.json();
        this.companies = data;
        this.loading = false;
      });
    },

    async fetchMyCompanies() {
      this.loading = true;
      try {
        await this.handleError(async () => {
          const accountStore = useAccountStore()
          const response = await fetch(`${BASE_URL}/companies/my`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accountStore.token}`,
            },
          });
          const data = await response.json();
          this.companies = data;
          this.loading = false;
        });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createCompany(data: FormData) {
      this.loading = true
      try {
        const accountStore = useAccountStore()
        const token = accountStore.token
        
        console.log('Sending data to server:')
        for (let [key, value] of data.entries()) {
          console.log(key, value)
        }
        
        const response = await fetch(`${BASE_URL}/companies/`, {
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

        const newCompany = await response.json()
        this.companies.push(newCompany)
        return newCompany
      } catch (error) {
        console.error('Error in createCompany:', error)
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCompany(slug) {
      this.loading = true;
      await this.handleError(async () => {
        const response = await fetch(`${BASE_URL}/companies/${slug}`);
        const data = await response.json();
        this.company = data;
        this.loading = false;
      });
    },

    async updateCompany(slug, data) {
      await this.handleError(async () => {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Create a new FormData instance
        const formData = new FormData();

        // Append each property in data to formData
        for (const property in data) {
          // If the property is a File object (like logo or cover), append it as a file
          if (data[property] instanceof File) {
            formData.append(property, data[property]);
          } else {
            // Otherwise, append it as a string
            formData.append(property, data[property]);
          }
        }

        const response = await fetch(`${BASE_URL}/companies/${slug}/`, {
          method: 'PUT',
          headers: headers,
          body: formData, // Use formData instead of JSON
        });

        const updatedCompany = await response.json();
        const index = this.companies.findIndex((c) => c.slug === slug);
        this.companies[index] = updatedCompany;
      });
    },

    async deleteCompany(slug) {
      await this.handleError(async () => {
        await fetch(`${BASE_URL}/companies/${slug}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${useAccountStore.token}`,
          },
        });
        const index = this.companies.findIndex((c) => c.slug === slug);
        this.companies.splice(index, 1);
      });
    },
  },
})