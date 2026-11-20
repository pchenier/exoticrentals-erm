import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// Moteurs de recherche et moteurs IA (ChatGPT, Perplexity, Claude, Gemini) explicitement autorisés.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/admin'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: AI_BOTS, allow: '/', disallow },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
