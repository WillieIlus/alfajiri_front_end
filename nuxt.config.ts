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
  modules: ["@nuxt/ui",
    "nuxt-tiptap-editor",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    "@stefanobartoletti/nuxt-social-share",
    '@nuxtjs/seo'],
  site: {
    url: 'https://alfajirijobs.com',
    name: 'Alfajiri Jobs',
    description: "Find the best jobs in Kenya first on Alfajiri Jobs. As the name 'Alfajiri' (Swahili for 'Early Morning') suggests, get your job listings early and be the first to apply. The early bird catches the worm! Explore job vacancies, career opportunities, employment listings, and job openings across various industries.",
    default: 'en-AU'

  },
  // runtimeConfig: {
  //   "public": {
  //     "siteUrl": "",
  //     "siteName": "",
  //     "siteDescription": "Discover the best job opportunities in Kenya.",
  //     "language": 
  //   }
  // },
  // seo: {
  //   "title": "Alfajiri Jobs",
  //   "titleTemplate": "%s - AlfajiriJobs",
  //   "description": "Find the best jobs in Kenya first on Alfajiri Jobs. As the name 'Alfajiri' (Swahili for 'Early Morning') suggests, get your job listings early and be the first to apply. The early bird catches the worm! Explore job vacancies, career opportunities, employment listings, and job openings across various industries.",
  //   "openGraph": {
  //     "type": "website",
  //     "url": "https://alfajirijobs.com",
  //     "siteName": "Alfajiri Jobs"
  //   },
  //   "twitter": {
  //     "card": "summary_large_image",
  //     "site": "@alfajirijobs"
  //   }
  // },
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