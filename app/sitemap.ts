import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { LOCATIONS } from '@/lib/locations'
import vehicleData from '@/lib/vehicles.json'

const BASE_URL = 'https://www.exoticrentalsmontreal.com'

// Blog slugs that 308-redirect to other pages (defined in next.config.mjs
// redirects). Listing a redirecting URL in the sitemap wastes crawl budget
// and triggers "Redirect error" noise in Search Console.
const SITEMAP_EXCLUDED_SLUGS = [
  'lamborghini-urus-vs-mercedes-g63-montreal',
]

// Only car pages that resolve against the live /api/fleet database.
// /cars/[slug] matches slugify(car.name) from the fleet API — keep in sync.
const CAR_SLUGS = [
  'audi-rs5',
  'audi-rs6',
  'audi-rs7',
  'audi-r8',
  'bmw-m5-competition',
  'lamborghini-urus-black-on-black',
  'mclaren-600lt',
  'toyota-supra',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const carPages: MetadataRoute.Sitemap = CAR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/cars/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const fleetPages: MetadataRoute.Sitemap = vehicleData.vehicles
    .filter((vehicle) => vehicle.available)
    .map((vehicle) => ({
      url: `${BASE_URL}/fleet/${vehicle.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS
    // Never list URLs that 308-redirect elsewhere (next.config.mjs redirects):
    // sitemap must only contain 200-OK URLs or Google burns crawl budget on them.
    .filter((post) => !SITEMAP_EXCLUDED_SLUGS.includes(post.slug))
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const locationPages: MetadataRoute.Sitemap = LOCATIONS.map((loc) => ({
    url: `${BASE_URL}/locations/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/fleet`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/experience`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/car-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/luxury-car-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/audi-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/mercedes-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bmw-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/lamborghini-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/mclaren-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ferrari-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/porsche-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/locations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/location-voiture-de-luxe-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...carPages,
    ...fleetPages,
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...blogPages,
    ...locationPages,
  ]
}