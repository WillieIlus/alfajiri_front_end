// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "nuxt-tiptap-editor",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  app: {
    head: {
      title: 'Alfajirijobs - early jobs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { hid: 'description', name: 'description', content: 'Get latest jobs' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },
        { hid: 'og:title', property: 'og:title', content: 'Alfajirijobs - Latest Jobs' },
        { hid: 'og:description', property: 'og:description', content: 'Get latest jobs' },
        { hid: 'og:image', property: 'og:image', content: '/favicon.png' },
        { hid: 'og:url', property: 'og:url', content: 'https://alfajirijobs.com' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Alfajirijobs - Latest Jobs' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Get latest jobs' },
        { hid: 'twitter:image', name: 'twitter:image', content: '/favicon.png' },
        { hid: 'twitter:url', name: 'twitter:url', content: 'https://alfajirijobs.com' },
      ],
      link: [
        {rel: 'icon', type: 'image/png', href: '/favicon.png' }, 
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    },
  },
})



