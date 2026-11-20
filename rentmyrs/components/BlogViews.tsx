import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { SITE, type Locale } from '@/lib/site';
import { BLOG, postPath, postPaths, postsFor, type BlogPost } from '@/lib/blog';
import { BUSINESS_ID, GUIDE, NORTH, faqLd } from '@/lib/seo';
import { getFleet } from '@/lib/fleet-store';
import Header from './Header';
import Footer from './Footer';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';
import BookingModal from './BookingModal';
import FaqList from './FaqList';
import { Btn } from './ui';

const wrap = 'mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16';
const fmtDate = (d: string, l: Locale) =>
  new Date(`${d}T12:00:00`).toLocaleDateString(l === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

/** Texte avec **gras** et [liens](/chemin) seulement. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((s, i) => {
        const b = s.match(/^\*\*([^*]+)\*\*$/);
        if (b) return <strong key={i} className="font-medium text-paper"><Rich text={b[1]} /></strong>;
        const a = s.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (a) {
          const href = a[2];
          const cls = 'text-paper underline decoration-rs underline-offset-4 hover:text-rs';
          return href.startsWith('/') ? (
            <Link key={i} href={href} className={cls}>{a[1]}</Link>
          ) : (
            <a key={i} href={href} className={cls} rel="noopener">{a[1]}</a>
          );
        }
        return <Fragment key={i}>{s}</Fragment>;
      })}
    </>
  );
}

export function BlogIndex({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const posts = postsFor(locale);
  const title = fr ? 'Blog RentMyRS : Audi RS à Montréal' : 'RentMyRS blog: Audi RS in Montreal';
  const list = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: title,
    url: `${SITE.url}${BLOG[locale]}`,
    inLanguage: fr ? 'fr-CA' : 'en-CA',
    publisher: { '@id': BUSINESS_ID },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE.url}${postPath(p)}`, datePublished: p.date })),
  };
  return (
    <>
      <JsonLd data={list} />
      <Header locale={locale} otherHref={BLOG[fr ? 'en' : 'fr']} />
      <main className="pt-28 sm:pt-36">
        <header className={`${wrap} pb-16`}>
          <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">{fr ? 'Le blog' : 'The blog'}</h1>
          <div className="rule mt-10" />
          <p className="mt-8 max-w-2xl text-lg font-light text-paper/85">
            {fr
              ? 'Conseils, comparatifs et itinéraires pour louer une Audi RS à Montréal, à Laval et sur la Rive-Nord.'
              : 'Tips, comparisons and road trips for renting an Audi RS in Montreal, Laval and the North Shore.'}
          </p>
        </header>
        <section className="border-t border-line">
          <ul className={`${wrap} border-b border-line`}>
            {posts.map((p) => (
              <li key={p.slug} className="border-t border-line first:border-t-0">
                <Link href={postPath(p)} className="group grid gap-2 py-8 sm:grid-cols-[180px_1fr] sm:gap-10">
                  <span className="label text-mute">{fmtDate(p.date, locale)}</span>
                  <span>
                    <span className="block text-2xl font-medium tracking-tight transition group-hover:text-rs sm:text-3xl">{p.title}</span>
                    <span className="mt-3 block max-w-3xl font-light text-mute">{p.description}</span>
                  </span>
                </Link>
              </li>
            ))}
            {posts.length === 0 && <li className="py-8 font-light text-mute">{fr ? 'Premiers articles bientôt.' : 'First articles coming soon.'}</li>}
          </ul>
        </section>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}

export async function BlogArticle({ post }: { post: BlogPost }) {
  const locale = post.locale;
  const fr = locale === 'fr';
  const models = await getFleet();
  const url = `${SITE.url}${postPath(post)}`;
  const paths = postPaths(post);
  const h2 = 'text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl';
  const more = postsFor(locale).filter((p) => p.slug !== post.slug).slice(0, 3);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: fr ? 'fr-CA' : 'en-CA',
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    dateModified: post.date,
    image: `${SITE.url}${post.image ?? '/og.jpg'}`,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` } },
    about: { '@id': BUSINESS_ID },
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}${fr ? '' : '/en'}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}${BLOG[locale]}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={crumbs} />
      {post.faq && post.faq.length > 0 && <JsonLd data={faqLd(post.faq)} />}
      <Header locale={locale} otherHref={paths[fr ? 'en' : 'fr']} />
      <main className="pt-28 sm:pt-36">
        <article>
          <header className={`${wrap} pb-12`}>
            <Link href={BLOG[locale]} className="label text-paper/70 hover:text-paper">← Blog</Link>
            <h1 className="mt-8 max-w-5xl text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">{post.title}</h1>
            <p className="label mt-6 text-mute">{fmtDate(post.date, locale)} · {SITE.name}</p>
            <div className="rule mt-8" />
            <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-paper/90"><Rich text={post.answer} /></p>
          </header>
          {post.image && (
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover object-[50%_70%]" />
            </div>
          )}
          <div className={`${wrap} max-w-4xl py-16`}>
            {post.sections.map((s) => (
              <section key={s.h} className="mt-14 first:mt-0">
                <h2 className={h2}>{s.h}</h2>
                {s.p?.map((t, i) => (
                  <p key={i} className="mt-5 text-lg font-light leading-relaxed text-paper/85"><Rich text={t} /></p>
                ))}
                {s.list && (
                  <ul className="mt-6 border-b border-line">
                    {s.list.map((t, i) => (
                      <li key={i} className="flex items-start gap-4 border-t border-line py-4 font-light text-paper/85">
                        <span className="mt-3 h-px w-6 shrink-0 bg-rs" />
                        <span><Rich text={t} /></span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {post.faq && post.faq.length > 0 && (
            <section className="border-t border-line">
              <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]`}>
                <h2 className={h2}>{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
                <FaqList items={post.faq} />
              </div>
            </section>
          )}

          <section id="reserver" className="scroll-mt-16 border-t border-line bg-panel">
            <div className={`${wrap} flex flex-col gap-8 py-20 sm:flex-row sm:items-center sm:justify-between`}>
              <div>
                <p className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">{fr ? 'Prêt à rouler ?' : 'Ready to drive?'}</p>
                <p className="mt-3 font-light text-mute">
                  <Link href={GUIDE[locale]} className="underline decoration-rs underline-offset-4 hover:text-paper">{fr ? 'Comparer les RS' : 'Compare the RS'}</Link>
                  {' · '}
                  <Link href={NORTH[locale]} className="underline decoration-rs underline-offset-4 hover:text-paper">{fr ? 'Livraison Rive-Nord' : 'North Shore delivery'}</Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Btn href="#reserver">{fr ? 'Faire une demande' : 'Request a car'}</Btn>
                <Btn href={`tel:${SITE.phone}`} variant="ghost">{SITE.phoneDisplay}</Btn>
              </div>
            </div>
          </section>

          {more.length > 0 && (
            <section className="border-t border-line">
              <div className={`${wrap} py-16`}>
                <h2 className="label text-mute">{fr ? 'À lire aussi' : 'Read next'}</h2>
                <ul className="mt-6 border-b border-line">
                  {more.map((p) => (
                    <li key={p.slug} className="border-t border-line py-5">
                      <Link href={postPath(p)} className="text-xl font-light hover:text-rs">{p.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </article>
        <BookingModal locale={locale} models={models} />
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
