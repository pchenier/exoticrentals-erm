import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { LOCATIONS } from '@/lib/locations'

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
  const base = 'https://www.exoticrentalsmontreal.com'

  const carPages: MetadataRoute.Sitemap = CAR_SLUGS.map((slug) => ({
    url: `${base}/cars/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const locationPages: MetadataRoute.Sitemap = LOCATIONS.map((loc) => ({
    url: `${base}/locations/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/car-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/luxury-car-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/audi-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mercedes-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/bmw-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/lamborghini-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mclaren-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ferrari-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/porsche-rental-montreal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/locations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...carPages,
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...blogPages,
    ...locationPages,
  ]
}
