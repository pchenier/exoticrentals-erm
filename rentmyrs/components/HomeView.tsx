import Image from 'next/image';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { getFleet } from '@/lib/fleet-store';
import Header from './Header';
import Footer from './Footer';
import { ModelTile, money, modelHref } from './ModelCard';
import BookingModal from './BookingModal';
import ContactFloat from './ContactFloat';
import Snow from './Snow';
import JsonLd from './JsonLd';
import { businessLd } from '@/lib/seo';
import { Btn, RsMark } from './ui';

export default async function HomeView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const RS_MODELS = await getFleet();

  const business = businessLd(locale, RS_MODELS);
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  const wrap = 'mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16';
  const h2 = 'text-4xl font-bold uppercase leading-none tracking-tight sm:text-6xl';

  return (
    <>
      <JsonLd data={business} />
      <JsonLd data={faq} />
      <Header locale={locale} />
      <main>
        {/* Hero : RS3 de face plein écran (même mise en page que la page RS3), titre et boutons par-dessus, flocons. */}
        <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
          <div className="absolute inset-0 -z-10">
            {/* Grand écran : la photo entière (dézoomée) au centre, ses bords fondus dans le noir. */}
            <div className="hero-fade absolute inset-0 lg:left-1/2 lg:right-auto lg:aspect-[3/2] lg:-translate-x-1/2">
              <Image
                src="/cars/rs3-front.jpg"
                alt={locale === 'fr' ? 'Location Audi RS3 à Montréal' : 'Audi RS3 rental in Montreal'}
                fill
                priority
                sizes="100vw"
                quality={90}
                className="object-cover object-[50%_40%]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/40" />
            <Snow />
          </div>
          <div className="w-full px-4 pb-14 pt-32 sm:px-6 lg:px-8">
            <p className="label text-paper/80">{d.hero.kicker}</p>
            <h1 className="mt-4 max-w-4xl text-[1.9rem] font-bold min-[400px]:text-[2.2rem] uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
              {d.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-paper/85 sm:text-lg">{d.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn href="#reserver">{d.hero.cta}</Btn>
              <Btn href="#rs" variant="ghost">{d.hero.cta2}</Btn>
            </div>
          </div>
        </section>

        {/* Bande de modèles */}
        <nav aria-label="RS" className="grid grid-cols-2 gap-px border-y border-line bg-line sm:grid-cols-5">
          {RS_MODELS.map((m, i) => (
            <a
              key={m.id}
              href={modelHref(m, locale)}
              className={`group bg-ink px-4 py-6 transition hover:bg-panel sm:px-8 ${i === RS_MODELS.length - 1 && RS_MODELS.length % 2 === 1 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <p className="wide text-2xl font-bold tracking-tight transition group-hover:text-rs sm:text-3xl"><RsMark name={m.short} /></p>
              <p className="label mt-2 text-mute">
                {m.dailyRate != null ? `${money(m.dailyRate, locale)} $${d.fleet.perDay}` : d.fleet.onRequest}
              </p>
            </a>
          ))}
        </nav>

        {/* Gamme RS */}
        <section id="rs" className="scroll-mt-16">
          <div className={`${wrap} pb-10 pt-24`}>
            <p className="label text-rs">RentMyRS</p>
            <h2 className={`${h2} mt-4`}>{d.fleet.title}</h2>
            <p className="mt-5 max-w-xl font-light text-mute">{d.fleet.sub}</p>
          </div>
          <div className={`${wrap} grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3`}>
            {RS_MODELS.map((m) => (
              <ModelTile key={m.id} model={m} locale={locale} />
            ))}
          </div>
        </section>

        {/* Lamborghini en arrière-plan */}
        <section id="lamborghini" className="scroll-mt-16 border-t border-line">
          <div className={`${wrap} flex flex-col gap-8 py-24 lg:flex-row lg:items-end lg:justify-between`}>
            <div>
              <p className="label text-mute">{d.lambo.kicker}</p>
              <h2 className={`${h2} mt-4`}>{d.lambo.title}</h2>
              <p className="mt-5 max-w-xl font-light text-mute">{d.lambo.sub}</p>
            </div>
            <a
              href={locale === 'fr' ? SITE.sister.lamborghiniFr : SITE.sister.lamborghiniEn}
              className="group inline-flex shrink-0 items-center gap-3 border border-paper/30 px-6 py-4 text-sm font-medium tracking-wide transition hover:border-paper hover:bg-paper hover:text-ink"
            >
              {locale === 'fr' ? 'Voir sur exoticrentalsmontreal.com' : 'Visit exoticrentalsmontreal.com'}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </section>

        <BookingModal locale={locale} models={RS_MODELS} />

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16 border-t border-line">
          <div className={`${wrap} grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]`}>
            <h2 className={h2}>{d.faq.title}</h2>
            <div className="border-b border-line">
              {d.faq.items.map(([q, a]) => (
                <details key={q} className="group border-t border-line py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-light">
                    {q}
                    <span className="text-2xl font-light text-rs transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 max-w-2xl font-light leading-relaxed text-mute">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
