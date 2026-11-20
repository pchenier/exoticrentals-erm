import type { Metadata } from 'next';
import { SITE, type Locale } from './site';

export function pageMeta(opts: {
  locale: Locale;
  title: string;
  description: string;
  path: { fr: string; en: string };
  image?: string;
}): Metadata {
  const { locale, title, description, path } = opts;
  const url = `${SITE.url}${path[locale]}`;
  const image = `${SITE.url}${opts.image ?? '/cars/rs3-1.jpg'}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { 'fr-CA': `${SITE.url}${path.fr}`, 'en-CA': `${SITE.url}${path.en}`, 'x-default': `${SITE.url}${path.fr}` },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website',
      images: [{ url: image }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
