export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | Alfajirijobs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },
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
    'nuxt-simple-robots',
    "@stefanobartoletti/nuxt-social-share",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots"
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
  sitemap: {
    siteUrl: 'https://alfajirijobs.com',
    generateOptions: {
      exclude: [
        '/admin/**'
      ]
    },
    '@nuxtjs/robots': {
      rules: {
        UserAgent: '*',
        Allow: '/',
        Sitemap: 'https://alfajirijobs.com/sitemap.xml'
      }
    },
  },
})