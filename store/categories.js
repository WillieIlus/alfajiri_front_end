import { defineStore } from 'pinia'
import { BASE_URL } from './base'
import { useAccountStore } from './accounts'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    currentPage: 1,
    itemsPerPage: 12,
    category: null,
    loading: false,
    error: null,
  }),
  getters: {
    getCategories: (state) => state.categories,
    getCategory: (state) => state.category,
    paginatedCategories: (state) => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.categories.slice(startIndex, endIndex);
    },
    totalCategories: (state) => state.categories.length,
    totalPages: (state) => Math.ceil(state.categories.length / state.itemsPerPage),
  },
  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await fetch(`${BASE_URL}/categories`);
        const data = await response.json();
        this.categories = data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategory(slug) {
      this.loading = true;
      try {
        const response = await fetch(`${BASE_URL}/categories/${slug}`);
        const data = await response.json();
        this.category = data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createCategory(name, description) {
      this.loading = true;
      const accountStore = useAccountStore()
      try {
        const response = await fetch(`${BASE_URL}/categories/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accountStore.token}`
          },
          body: JSON.stringify({ name, description }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Bad Request Error:', errorData);
          const error = new Error(errorData.detail);
          throw error;
        }
        const data = await response.json();
        this.categories.push(data);
      } catch (error) {
        console.error(error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateCategory(slug, category) {
      try {
        const response = await fetch(`${BASE_URL}/categories/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category),
        });
        const data = await response.json();
        this.categories = this.categories.map((category) => {
          if (category.slug === slug) {
            return data;
          }
          return category;
        });
      }
      catch (error) {
        console.error(error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    setCurrentPage(page) {
      const totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
      this.currentPage = Math.max(1, Math.min(totalPages, page));
    },
  }
})

