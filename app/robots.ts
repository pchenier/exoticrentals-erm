import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 2026-10-06: GSC accumulated ~400 "Crawled - currently not indexed" URLs of
        // /_next/static chunks/fonts with ?dpl=<deployId> cache-bust params (one set
        // per deploy). Assets never need indexing — block the whole tree so the
        // noise stops accumulating and crawl budget goes to real pages.
        disallow: ['/_next/', '/api/'],
      },
    ],
    sitemap: 'https://www.exoticrentalsmontreal.com/sitemap.xml',
  }
}