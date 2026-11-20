import Image from 'next/image';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { RS_MODELS, LAMBOS } from '@/lib/fleet';
import Header from './Header';
import Footer from './Footer';
import ModelCard from './ModelCard';
import BookingForm from './BookingForm';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';

export default function HomeView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const home = locale === 'fr' ? SITE.url : `${SITE.url}/en`;
  const money = (n: number) => n.toLocaleString(locale === 'fr' ? 'fr-CA' : 'en-CA');

  const business = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: SITE.name,
    url: home,
    telephone: SITE.phone,
    image: `${SITE.url}/cars/rs3-1.jpg`,
    areaServed: ['Montréal', 'Laval', 'Longueuil', 'Brossard'],
    address: { '@type': 'PostalAddress', addressLocality: 'Montréal', addressRegion: 'QC', addressCountry: 'CA' },
    sameAs: [SITE.sister.url],
    makesOffer: [...RS_MODELS.map((m) => m.name), ...LAMBOS.map((l) => l.name)].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Car', name },
    })),
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <>
      <JsonLd data={business} />
      <JsonLd data={faq} />
      <Header locale={locale} />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          {/* Mobile : photo plein écran. Desktop : texte à gauche, photo verticale à droite. */}
          <Image src="/cars/rs3-1.jpg" alt={locale === 'fr' ? 'Audi RS3 dans la neige' : 'Audi RS3 in the snow'} fill priority sizes="100vw" className="-z-10 object-cover object-[50%_70%] opacity-60 lg:hidden" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/10 lg:hidden" />
          <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 px-4 pb-16 pt-32 lg:min-h-0 lg:grid-cols-[1.15fr_1fr] lg:py-16">
            <div className="self-end lg:self-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rs">{d.hero.kicker}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{d.hero.title}</h1>
              <p className="mt-5 max-w-xl text-base text-paper/80 sm:text-lg">{d.hero.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#reserver" className="rounded-full bg-rs px-6 py-3 text-sm font-semibold text-white hover:bg-rs/90">{d.hero.cta}</a>
                <a href="#rs" className="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold hover:border-paper">{d.hero.cta2}</a>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm text-mute">
                {RS_MODELS.map((m) => (
                  <span key={m.id}><span className="font-semibold text-paper">{m.short}</span> · {money(m.dailyRate ?? 0)} ${d.fleet.perDay}</span>
                ))}
              </div>
            </div>
            <div className="relative hidden aspect-[2/3] max-h-[78vh] w-full justify-self-end overflow-hidden rounded-3xl border border-line lg:block">
              <Image src="/cars/rs3-1.jpg" alt={locale === 'fr' ? 'Location Audi RS3 à Montréal' : 'Audi RS3 rental in Montreal'} fill priority sizes="40vw" className="object-cover" />
              <div className="rs-stripe absolute bottom-0 left-0 h-1.5 w-full" />
            </div>
          </div>
        </section>
        <div className="rs-stripe h-1.5" />

        {/* Gamme RS */}
        <section id="rs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{d.fleet.title}</h2>
          <p className="mt-2 text-mute">{d.fleet.sub}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {RS_MODELS.map((m) => <ModelCard key={m.id} model={m} locale={locale} />)}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="border-y border-line bg-panel">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{d.how.title}</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {d.how.steps.map(([title, text], i) => (
                <li key={title} className="rounded-2xl border border-line bg-ink p-6">
                  <span className="text-sm font-bold italic text-rs">0{i + 1}</span>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-mute">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Lamborghini en arrière-plan */}
        <section id="lamborghini" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mute">{d.lambo.kicker}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{d.lambo.title}</h2>
          <p className="mt-2 max-w-2xl text-mute">{d.lambo.sub}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {LAMBOS.map((l) => (
              <figure key={l.name} className="overflow-hidden rounded-xl border border-line bg-panel">
                <div className="relative aspect-[4/3]">
                  <Image src={l.image} alt={`${l.name} ${locale === 'fr' ? 'à louer à Montréal' : 'rental Montreal'}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="flex items-baseline justify-between gap-2 p-4 text-sm">
                  <span className="font-medium">{l.name.replace('Lamborghini ', '')}</span>
                  <span className="text-mute">{d.lambo.from} {money(l.dailyRate)} ${locale === 'fr' ? '/jour' : '/day'}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <a
            href={locale === 'fr' ? SITE.sister.lamborghiniFr : SITE.sister.lamborghiniEn}
            className="mt-6 inline-block text-sm font-semibold underline decoration-rs underline-offset-4 hover:text-rs"
          >
            {d.lambo.cta} →
          </a>
        </section>

        {/* Réservation */}
        <section id="reserver" className="scroll-mt-20 border-t border-line bg-panel/40">
          <div className="mx-auto max-w-3xl px-4 py-20">
            <h2 className="text-3xl font-bold tracking-tight">{d.booking.title}</h2>
            <p className="mb-8 mt-2 text-mute">{d.booking.sub}</p>
            <BookingForm locale={locale} />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{d.faq.title}</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {d.faq.items.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}
                  <span className="text-rs transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mute">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
