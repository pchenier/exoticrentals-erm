import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/image', '/api/'],
      },
    ],
    sitemap: 'https://www.exoticrentalsmontreal.com/sitemap.xml',
  }
}