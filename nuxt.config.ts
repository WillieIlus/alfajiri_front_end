export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Alfajirijobs - Early Jobs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { hid: 'description', name: 'description', content: 'Get latest jobs' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },
        { hid: 'og:title', property: 'og:title', content: 'Alfajirijobs - Latest Jobs' },
        { hid: 'og:description', property: 'og:description', content: 'Get latest jobs' },
        { hid: 'og:image', property: 'og:image', content: 'https://alfajirijobs.com/og-image.jpg' },
        { hid: 'og:url', property: 'og:url', content: 'https://alfajirijobs.com' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Alfajirijobs - Latest Jobs' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Get latest jobs' },
        { hid: 'twitter:image', name: 'twitter:image', content: 'https://alfajirijobs.com/twitter-image.jpg' },
        { hid: 'twitter:url', name: 'twitter:url', content: 'https://alfajirijobs.com' },
        { name: 'author', content: 'Alfajirijobs' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Alfajirijobs' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:site', content: '@alfajirijobs' },
        { name: 'twitter:creator', content: '@alfajirijobs' },
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
  ],

})