import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { RS_MODELS } from '@/lib/fleet';
import { GUIDE, NORTH } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pair = (fr: string, en: string, priority: number) =>
    [fr, en].map((p) => ({
      url: `${SITE.url}${p}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: { languages: { 'fr-CA': `${SITE.url}${fr}`, 'en-CA': `${SITE.url}${en}`, 'x-default': `${SITE.url}${fr}` } },
    }));
  return [
    ...pair('/', '/en', 1),
    ...RS_MODELS.flatMap((m) => pair(`/${m.slug.fr}`, `/en/${m.slug.en}`, 0.9)),
    ...pair(GUIDE.fr, GUIDE.en, 0.8),
    ...pair(NORTH.fr, NORTH.en, 0.8),
  ];
}
