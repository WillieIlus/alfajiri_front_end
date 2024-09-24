export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "nuxt-tiptap-editor",
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-simple-robots',
    "@stefanobartoletti/nuxt-social-share",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    'nuxt-module-feed',
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
    hostname: 'https://alfajirijobs.com',
    gzip: true,
    routes: async () => {
      const jobs = await fetchJobs() 
      return [
        '/feed.xml',
        ...jobs.map(job => `/${job.slug}`)
      ]
    }
  },
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: '/admin',
    Sitemap: 'https://alfajirijobs.com/sitemap.xml'
  },
  rss: {
    title: 'Alfajiri Jobs',
    description: 'Latest jobs and career opportunities',
    link: 'https://alfajirijobs.com/feed.xml',
  },
})