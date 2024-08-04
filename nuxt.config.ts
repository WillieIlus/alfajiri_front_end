export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Alfajirijobs - Early Jobs in Kenya',
      titleTemplate: '%s | Alfajirijobs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { hid: 'description', name: 'description', content: 'Find the latest jobs in Kenya early with Alfajirijobs. Your trusted source for career opportunities and employment news.' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },
        { hid: 'og:title', property: 'og:title', content: 'Alfajirijobs - Latest Jobs in Kenya' },
        { hid: 'og:description', property: 'og:description', content: 'Discover early job opportunities in Kenya. Your gateway to a successful career starts here.' },
        { hid: 'og:image', property: 'og:image', content: 'https://alfajirijobs.com/og-image.jpg' },
        { hid: 'og:url', property: 'og:url', content: 'https://alfajirijobs.com' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Alfajirijobs - Early Jobs in Kenya' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Find the latest jobs in Kenya early. Your career starts here!' },
        { hid: 'twitter:image', name: 'twitter:image', content: 'https://alfajirijobs.com/twitter-image.jpg' },
        { hid: 'twitter:url', name: 'twitter:url', content: 'https://alfajirijobs.com' },
        { name: 'author', content: 'Alfajirijobs' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Alfajirijobs' },
        { property: 'og:locale', content: 'en_KE' },
        { name: 'twitter:site', content: '@alfajirijobs' },
        { name: 'twitter:creator', content: '@alfajirijobs' },
        { name: 'keywords', content: 'jobs in Kenya, early job postings, career opportunities, employment, Kenyan job market' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-favicon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://alfajirijobs.com' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Alfajirijobs',
            url: 'https://alfajirijobs.com',
            description: 'Get latest jobs in Kenya early',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://alfajirijobs.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          }),
        },
      ],
    },
  },
  modules: [
    "@nuxt/ui",
    "nuxt-tiptap-editor",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
    "@stefanobartoletti/nuxt-social-share",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots"
  ],
  socialShare: {
    baseUrl: 'https://alfajirijobs.com' 
  },
  sitemap: {
    siteUrl: 'https://alfajirijobs.com',
  },
  robots: {
    allow: '/',
    sitemap: '/sitemap.xml',
  },
})