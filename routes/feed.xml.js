// server/routes/feed.xml.js
import RSS from 'rss'

export default defineEventHandler(async (event) => {
  const feed = new RSS({
    title: 'Alfajiri Jobs',
    site_url: 'https://alfajirijobs.com',
    feed_url: 'https://alfajirijobs.com/feed.xml'
  })

  // Assuming you have a function to fetch jobs from your database or API
  const jobs = await fetchJobs() 

  jobs.forEach((job) => {
    feed.item({
      title: job.title,
      url: `https://alfajirijobs.com/${job.slug}`,
      description: job.truncated_description,
      date: job.created_at,
      custom_elements: [
        { 'job:company': job.get_company.name },
        { 'job:location': job.get_location }
      ]
    })
  })

  const feedString = feed.xml({ indent: true })

  event.node.res.setHeader('Content-Type', 'text/xml')
  return feedString
})

// You'll need to implement this function to fetch your jobs data
async function fetchJobs() {
  // This is just a placeholder. Replace with your actual data fetching logic
  // For example, you might use $fetch to call your API:
  // return await $fetch('/api/jobs')
  return []
}