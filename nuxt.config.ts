export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "nuxt-tiptap-editor",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    "@stefanobartoletti/nuxt-social-share",
    '@nuxtjs/seo',
    '@nuxt/image',
  ],
  tiptap: {
    prefix: 'Tiptap',
    lowlight: {
      theme: 'github-dark',
    },
  },
  socialShare: {
    baseUrl: 'https://alfajirijobs.com'
  },
})