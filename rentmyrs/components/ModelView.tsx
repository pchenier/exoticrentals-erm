import Image from 'next/image';
import Link from 'next/link';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import { RS_MODELS, type RsModel } from '@/lib/fleet';
import Header from './Header';
import Footer from './Footer';
import ModelCard, { ModelVisual, Price } from './ModelCard';
import BookingForm from './BookingForm';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';

export default function ModelView({ locale, model }: { locale: Locale; model: RsModel }) {
  const d = t(locale);
  const prefix = locale === 'fr' ? '' : '/en';
  const url = `${SITE.url}${prefix}/${model.slug[locale]}`;
  const otherHref = `${locale === 'fr' ? '/en' : ''}/${model.slug[locale === 'fr' ? 'en' : 'fr']}`;
  const specs: [string, string][] = [
    [d.model.power, `${model.specs.hp} ${d.fleet.hp}`],
    [d.model.engine, model.specs.engine],
    [d.model.accel, locale === 'fr' ? model.specs.zeroTo100.replace('.', ',') : model.specs.zeroTo100],
    [d.model.seats, String(model.specs.seats)],
    [d.model.drive, model.specs.drivetrain],
  ];

  const product = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: model.name,
    brand: { '@type': 'Brand', name: 'Audi' },
    url,
    ...(model.images[0] && { image: model.images.map((i) => `${SITE.url}${i}`) }),
    vehicleEngine: { '@type': 'EngineSpecification', name: model.specs.engine },
    seatingCapacity: model.specs.seats,
    ...(model.dailyRate != null && {
      offers: { '@type': 'Offer', priceCurrency: 'CAD', price: model.dailyRate, url, seller: { '@type': 'AutoRental', name: SITE.name } },
    }),
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}${prefix || '/'}` },
      { '@type': 'ListItem', position: 2, name: model.name, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={product} />
      <JsonLd data={crumbs} />
      <Header locale={locale} otherHref={otherHref} />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <Link href={`${prefix || '/'}#rs`} className="text-sm text-mute hover:text-paper">← {d.model.back}</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
              <ModelVisual model={model} priority sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            {model.images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {model.images.slice(1, 4).map((src, i) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
                    <Image src={src} alt={`${model.name} ${i + 2}`} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            {model.images.length === 0 && <p className="mt-3 text-xs text-mute">{d.fleet.photoSoon}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rs">{model.body[locale]}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {locale === 'fr' ? `Location ${model.name} à Montréal` : `${model.name} rental in Montreal`}
            </h1>
            <p className="mt-3 text-lg text-paper/85">{model.tagline[locale]}</p>
            <p className="mt-4 leading-relaxed text-mute">{model.intro[locale]}</p>
            <ul className="mt-5 space-y-1.5 text-sm">
              {model.highlights[locale].map((h) => (
                <li key={h} className="flex gap-2"><span className="text-rs">▸</span>{h}</li>
              ))}
            </ul>
            <div className="mt-6"><Price model={model} locale={locale} /></div>
            <a href="#reserver" className="mt-6 inline-block rounded-full bg-rs px-6 py-3 text-sm font-semibold text-white hover:bg-rs/90">
              {d.model.bookThis}
            </a>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">{d.model.specs}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
            {specs.map(([k, v]) => (
              <div key={k} className="bg-panel p-4">
                <dt className="text-xs text-mute">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="reserver" className="mx-auto mt-16 max-w-3xl scroll-mt-20">
          <h2 className="text-2xl font-bold tracking-tight">{d.booking.title}</h2>
          <p className="mb-6 mt-2 text-mute">{d.booking.sub}</p>
          <BookingForm locale={locale} defaultModel={model.name} />
        </section>

        <section className="mt-20">
          <h2 className="text-xl font-semibold">{d.model.others}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {RS_MODELS.filter((m) => m.id !== model.id).map((m) => <ModelCard key={m.id} model={m} locale={locale} />)}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
