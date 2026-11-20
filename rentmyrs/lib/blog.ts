// Blog : un article = un fichier JSON dans content/blog/ (écrit à la main ou par la tâche automatique).
import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from './site';

export type BlogSection = { h: string; p?: string[]; list?: string[] };
export type BlogPost = {
  slug: string;
  locale: Locale;
  /** slug de la version dans l'autre langue (hreflang) */
  alt?: string;
  title: string;
  description: string;
  date: string; // AAAA-MM-JJ
  model?: string | null;
  image?: string;
  /** Réponse directe en tête d'article (GEO) */
  answer: string;
  sections: BlogSection[];
  faq?: [string, string][];
};

const DIR = path.join(process.cwd(), 'content', 'blog');

let cache: BlogPost[] | null = null;
export function allPosts(): BlogPost[] {
  if (cache) return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')) : [];
  cache = files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as BlogPost)
    .filter((p) => p.slug && p.title && p.locale)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export const postsFor = (l: Locale) => allPosts().filter((p) => p.locale === l);
export const findPost = (l: Locale, slug: string) => allPosts().find((p) => p.locale === l && p.slug === slug);

export const BLOG = { fr: '/blog', en: '/en/blog' };
export const postPath = (p: Pick<BlogPost, 'locale' | 'slug'>) => `${BLOG[p.locale]}/${p.slug}`;

/** Chemins FR/EN d'un article pour hreflang (repli sur l'index du blog si pas de traduction). */
export function postPaths(p: BlogPost): { fr: string; en: string } {
  const other: Locale = p.locale === 'fr' ? 'en' : 'fr';
  const alt = p.alt ? findPost(other, p.alt) : undefined;
  const otherPath = alt ? postPath(alt) : BLOG[other];
  return p.locale === 'fr' ? { fr: postPath(p), en: otherPath } : { fr: otherPath, en: postPath(p) };
}
