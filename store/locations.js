import { defineStore } from 'pinia'
import { BASE_URL } from './base'
import { useAccountStore } from './accounts'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    location: null,
    loading: false,
    error: null,
  }),
  getters: {
    getLocations: (state) => state.locations,
    getLocation: (state) => state.location,
    locationsCount: (state) => state.locations.length,
  },
  actions: {
    async fetchLocations() {
      this.loading = true;
      try {
        const response = await fetch(`${BASE_URL}/locations/locations`);
        const data = await response.json();
        this.locations = data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchLocation(slug) {
      this.loading = true;
      try {
        const response = await fetch(`${BASE_URL}/locations/locations/${slug}`);
        const data = await response.json();
        this.location = data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createLocation(name, description) {
      this.loading = true;
      const accountStore = useAccountStore()
      try {
        const response = await fetch(`${BASE_URL}/locations/locations/`, {
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
        this.locations.push(data);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async updateLocation(slug, name, description) {
      this.loading = true;
      const accountStore = useAccountStore()
      try {
        const response = await fetch(`${BASE_URL}/locations/locations/${slug}`, {
          method: 'PUT',
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
        const index = this.locations.findIndex((location) => location.slug === slug);
        this.locations[index] = data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteLocation(slug) {
      try {
        const response = await fetch(`${BASE_URL}/locations/locations/${slug}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Bad Request Error:', errorData);
          const error = new Error(errorData.detail);
          throw error;
        }
        this.locations = this.locations.filter((location) => location.slug !== slug);
      }
      catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
})

