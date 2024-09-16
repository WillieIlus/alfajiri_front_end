export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },
      ],

      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-favicon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],

    },
  },

  modules: [
    "@nuxt/ui",
    "nuxt-tiptap-editor",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    "@stefanobartoletti/nuxt-social-share",
    '@nuxtjs/seo',
    '@nuxt/image',
  ],

  runtimeConfig: {
    public: {
      siteUrl: 'https://alfajirijobs.com',
    }
  },

  tiptap: {
    prefix: 'Tiptap',
    lowlight: {
      theme: 'github-dark',
    },
  },

  socialShare: {
    baseUrl: 'https://alfajirijobs.com'
  },

  image: {
    dir: 'assets/images',
  },
})