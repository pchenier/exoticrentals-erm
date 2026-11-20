import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { RS_MODELS } from '@/lib/fleet';

export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (fr: string, en: string, priority: number) =>
    [fr, en].map((p) => ({
      url: `${SITE.url}${p}`,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: { languages: { 'fr-CA': `${SITE.url}${fr}`, 'en-CA': `${SITE.url}${en}` } },
    }));
  return [
    ...pair('/', '/en', 1),
    ...RS_MODELS.flatMap((m) => pair(`/${m.slug.fr}`, `/en/${m.slug.en}`, 0.9)),
  ];
}
