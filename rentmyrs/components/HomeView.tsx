import Image from 'next/image';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { LAMBOS } from '@/lib/fleet';
import { getFleet } from '@/lib/fleet-store';
import Header from './Header';
import Footer from './Footer';
import ModelRow, { money, modelHref } from './ModelCard';
import BookingForm from './BookingForm';
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
            <Image
              src="/cars/rs3-front.jpg"
              alt={locale === 'fr' ? 'Location Audi RS3 à Montréal' : 'Audi RS3 rental in Montreal'}
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover object-[50%_40%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/40" />
            <Snow />
          </div>
          <div className="w-full px-4 pb-14 pt-32 sm:px-6 lg:px-8">
            <p className="label text-paper/80">{d.hero.kicker}</p>
            <h1 className="mt-4 max-w-4xl text-[2.6rem] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
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
        <nav aria-label="RS" className="grid grid-cols-2 border-y border-line sm:grid-cols-4">
          {RS_MODELS.map((m, i) => (
            <a
              key={m.id}
              href={modelHref(m, locale)}
              className={`group border-line px-4 py-6 transition hover:bg-panel sm:px-8 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''} ${i === 1 ? 'sm:border-r' : ''} ${i === 2 ? 'sm:border-r' : ''}`}
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
          <div className={`${wrap} pb-16 pt-24`}>
            <p className="label text-rs">RentMyRS</p>
            <h2 className={`${h2} mt-4`}>{d.fleet.title}</h2>
            <p className="mt-5 max-w-xl font-light text-mute">{d.fleet.sub}</p>
          </div>
          {RS_MODELS.map((m, i) => (
            <ModelRow key={m.id} model={m} locale={locale} flip={i % 2 === 1} />
          ))}
        </section>

        {/* Comment ça marche */}
        <section className="border-t border-line">
          <div className={`${wrap} py-24`}>
            <h2 className={h2}>{d.how.title}</h2>
            <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-0">
              {d.how.steps.map(([title, text], i) => (
                <li key={title} className="border-t border-line pt-6 sm:pr-10">
                  <span className="wide text-5xl font-extralight text-rs">0{i + 1}</span>
                  <h3 className="label mt-6">{title}</h3>
                  <p className="mt-3 font-light leading-relaxed text-mute">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Lamborghini en arrière-plan */}
        <section id="lamborghini" className="scroll-mt-16 border-t border-line">
          <div className={`${wrap} flex flex-col gap-8 pb-12 pt-24 lg:flex-row lg:items-end lg:justify-between`}>
            <div>
              <p className="label text-mute">{d.lambo.kicker}</p>
              <h2 className={`${h2} mt-4`}>{d.lambo.title}</h2>
              <p className="mt-5 max-w-xl font-light text-mute">{d.lambo.sub}</p>
            </div>
            <Btn href={locale === 'fr' ? SITE.sister.lamborghiniFr : SITE.sister.lamborghiniEn} variant="ghost">
              {d.lambo.cta}
            </Btn>
          </div>
          <div className="grid sm:grid-cols-3">
            {LAMBOS.map((l) => (
              <figure key={l.name} className="group relative aspect-[4/5] overflow-hidden">
                <Image
                  src={l.image}
                  alt={`${l.name} ${locale === 'fr' ? 'à louer à Montréal' : 'rental Montreal'}`}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover grayscale-[40%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="wide text-xl font-bold uppercase tracking-tight">{l.name.replace('Lamborghini ', '')}</p>
                  <p className="label mt-2 text-paper/70">
                    {l.hp} {d.fleet.hp} · {d.lambo.from} {money(l.dailyRate, locale)} ${d.fleet.perDay}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Réservation */}
        <section id="reserver" className="scroll-mt-16 border-t border-line bg-panel">
          <div className={`${wrap} grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]`}>
            <div>
              <h2 className={h2}>{d.booking.title}</h2>
              <div className="rule mt-8" />
              <p className="mt-6 max-w-sm font-light text-mute">{d.booking.sub}</p>
            </div>
            <BookingForm locale={locale} models={RS_MODELS} />
          </div>
        </section>

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
