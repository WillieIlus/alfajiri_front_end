// store/location.js
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
        this.error = error.message;
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
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createLocation(formData) { // Accepting FormData as parameter
      this.loading = true;
      const accountStore = useAccountStore();
      try {
        const response = await fetch(`${BASE_URL}/locations/locations/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accountStore.token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Bad Request Error:', errorData);
          throw new Error(errorData.detail || 'Failed to create location');
        }
        const data = await response.json();
        this.locations.push(data); // Push new location to the list
        return data;
      } catch (error) {
        console.error(error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateLocation(slug, formData) {
      this.loading = true;
      const accountStore = useAccountStore();
      try {
        const response = await fetch(`${BASE_URL}/locations/locations/${slug}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accountStore.token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Bad Request Error:', errorData);
          throw new Error(errorData.detail || 'Failed to update location');
        }
        const data = await response.json();
        const index = this.locations.findIndex((location) => location.slug === slug);
        this.locations[index] = data;
      } catch (error) {
        console.error(error);
        this.error = error.message;
        throw error;
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
          throw new Error(errorData.detail || 'Failed to delete location');
        }
        this.locations = this.locations.filter((location) => location.slug !== slug);
      } catch (error) {
        console.error(error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
