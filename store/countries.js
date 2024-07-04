import { defineStore } from 'pinia';
import { BASE_URL } from './base'
import { useAccountStore } from './accounts'



export const useCountriesStore = defineStore('countries', {
  state: () => ({
    countries: [],
    country: null,
    loading: false,
    error: null,

  }),
  getters: {
    getCountries: (state) => state.countries,
    getCountry: (state) => state.country,
    countriesCount: (state) => state.countries.length,
  },
  actions: {
    async createCountry(data) {
      try {
        const accountStore = useAccountStore();
        const token = accountStore.token;
        const headers = {
          'Authorization': 'Bearer ' + token,
        };
        console.log('Sending data to server: ', data);
        const response = await fetch(`${BASE_URL}/locations/countries/`, {
          method: 'POST',
          headers: headers,
          body: data,
        });
        if (!response.ok) {
          const error = await response.json();
          console.error('Error creating country:', error);
          throw new Error('Server responded with ' + response.status);
        }
        const responseData = await response.json();
        console.log('Server responded with', responseData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  }
});
