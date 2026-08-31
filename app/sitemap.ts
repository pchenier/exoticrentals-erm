import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { LOCATIONS } from '@/lib/locations'
import { vehicles } from '@/lib/data'

const BASE_URL = 'https://www.exoticrentalsmontreal.com'

const CAR_SLUGS = [
  'audi-rs5',
  'audi-rs6',
  'audi-rs7',
  'audi-r8',
  'bmw-m3-competition-isle-of-man-green',
  'bmw-m5-competition',
  'bmw-x5-m-competition',
  'mercedes-benz-e63s-amg',
  'mercedes-benz-s63-amg',
  'mercedes-g63-amg',
  'ferrari-488-gtb',
  'porsche-911-4s-techart',
  'lamborghini-urus-black-on-black',
  'lamborghini-urus-blue-on-blue',
  'lamborghini-urus-grey',
  'lamborghini-huracan-tecnica',
  'lamborghini-huracan-evo',
  'lamborghini-huracan-evo-spyder',
  'mclaren-570gt',
  'mclaren-600lt',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const carPages: MetadataRoute.Sitemap = CAR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/cars/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const fleetPages: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${BASE_URL}/fleet/${vehicle.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

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