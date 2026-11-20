// Vérifie les articles du blog avant publication : node scripts/check-blog.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'content', 'blog');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'topics.json');
const posts = files.map((f) => ({ f, p: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }));
const fleet = fs.readFileSync(path.join(root, 'lib', 'fleet.ts'), 'utf8');
const modelSlugs = [...fleet.matchAll(/slug: \{ fr: '([^']+)', en: '([^']+)' \}/g)].flatMap((m) => [`/${m[1]}`, `/en/${m[2]}`]);
const allowed = new Set([
  '/', '/en', '/blog', '/en/blog',
  '/guide-location-audi-rs-montreal', '/en/audi-rs-rental-guide-montreal',
  '/location-audi-rs-rive-nord', '/en/audi-rs-rental-north-shore-montreal',
  ...modelSlugs,
  ...posts.map(({ p }) => (p.locale === 'fr' ? `/blog/${p.slug}` : `/en/blog/${p.slug}`)),
]);
const errors = [];
const seen = new Set();
const words = (p) => [p.answer, ...p.sections.flatMap((s) => [s.h, ...(s.p ?? []), ...(s.list ?? [])]), ...(p.faq ?? []).flat()].join(' ').split(/\s+/).length;

for (const { f, p } of posts) {
  const e = (m) => errors.push(`${f}: ${m}`);
  if (f !== `${p.slug}.json`) e('le nom du fichier doit être <slug>.json');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? '')) e('slug invalide');
  if (!['fr', 'en'].includes(p.locale)) e('locale doit être fr ou en');
  if (seen.has(`${p.locale}/${p.slug}`)) e('slug en double');
  seen.add(`${p.locale}/${p.slug}`);
  for (const k of ['title', 'description', 'date', 'answer']) if (!p[k]) e(`champ manquant: ${k}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date ?? '')) e('date au format AAAA-MM-JJ');
  if (!Array.isArray(p.sections) || p.sections.length < 3) e('au moins 3 sections');
  if (p.image && !fs.existsSync(path.join(root, 'public', p.image))) e(`image introuvable: ${p.image}`);
  if (p.alt && !posts.some(({ p: q }) => q.slug === p.alt && q.locale !== p.locale)) e(`traduction alt introuvable: ${p.alt}`);
  if (words(p) < 600) e(`trop court (${words(p)} mots)`);
  const text = JSON.stringify(p);
  if (/[—–]/.test(text)) e('pas de tiret cadratin ou demi-cadratin');
  if (/<[a-z]/i.test(text)) e('pas de HTML');
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (href.startsWith('http')) {
      if (!href.startsWith('https://www.exoticrentalsmontreal.com') && !href.startsWith('https://www.rentmyrs.com')) e(`lien externe non permis: ${href}`);
    } else if (!allowed.has(href)) e(`lien interne inconnu: ${href}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK: ${posts.length} articles`);
