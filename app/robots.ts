import { MetadataRoute } from 'next'

// Moteurs IA (ChatGPT, Perplexity, Claude, Gemini, Apple) explicitement autorisés : GEO.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot']

export default function robots(): MetadataRoute.Robots {
  // 2026-10-06: GSC accumulated ~400 "Crawled - currently not indexed" URLs of
  // /_next/static chunks/fonts with ?dpl=<deployId> cache-bust params (one set
  // per deploy). Assets never need indexing — block the whole tree so the
  // noise stops accumulating and crawl budget goes to real pages.
  const disallow = ['/_next/', '/api/']
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: AI_BOTS, allow: '/', disallow },
    ],
    sitemap: 'https://www.exoticrentalsmontreal.com/sitemap.xml',
  }
}
