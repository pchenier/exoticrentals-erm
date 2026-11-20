import Image from 'next/image';
import Link from 'next/link';
import { SITE, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import type { RsModel } from '@/lib/fleet';
import Header from './Header';
import Footer from './Footer';
import { Badge, ModelVisual, StatusTag, accel, money, modelHref } from './ModelCard';
import BookingForm from './BookingForm';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';
import FaqList from './FaqList';
import { GUIDE, carLd, faqLd, modelFaq, offerLd } from '@/lib/seo';
import { Btn, RsMark, Stat } from './ui';

export default function ModelView({ locale, model, models }: { locale: Locale; model: RsModel; models: RsModel[] }) {
  const d = t(locale);
  const prefix = locale === 'fr' ? '' : '/en';
  const url = `${SITE.url}${modelHref(model, locale)}`;
  const otherHref = modelHref(model, locale === 'fr' ? 'en' : 'fr');
  const wrap = 'mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16';
  const specs: [string, string][] = [
    [d.model.power, `${model.specs.hp} ${d.fleet.hp}`],
    [d.model.engine, model.specs.engine],
    [d.model.accel, `${accel(model, locale)} s`],
    [d.model.seats, String(model.specs.seats)],
    [d.model.drive, model.specs.drivetrain],
    [d.fleet.deposit, `${money(model.deposit, locale)} $`],
  ];

  const product = { '@context': 'https://schema.org', ...carLd(model, locale), url, offers: offerLd(model, locale) };
  const faqItems = modelFaq(model, locale);
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
      <JsonLd data={faqLd(faqItems)} />
      <Header locale={locale} otherHref={otherHref} />
      <main>
        {/* Hero pleine largeur, nom du modèle en très grand. */}
        <section className="relative isolate flex min-h-[88svh] items-end">
          <div className="absolute inset-0 -z-10">
            <ModelVisual model={model} priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
          </div>
          <div className={`${wrap} w-full pb-14`}>
            <Link href={`${prefix || '/'}#rs`} className="label text-paper/70 hover:text-paper">← {d.model.back}</Link>
            <div className="mt-8 flex items-center gap-4">
              <p className="label text-paper/80">{model.body[locale]}</p>
              <Badge model={model} locale={locale} />
              <StatusTag model={model} locale={locale} />
            </div>
            <h1 className="mt-3 text-[18vw] font-bold uppercase leading-[0.85] tracking-tight sm:text-[9rem]">
              <RsMark name={model.short} />
              <span className="sr-only"> {locale === 'fr' ? `– location ${model.name} à Montréal` : `– ${model.name} rental in Montreal`}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light text-paper/85">{model.tagline[locale]}</p>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="border-y border-line">
          <div className={`${wrap} grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-4`}>
            <Stat value={String(model.specs.hp)} unit={d.fleet.hp} label={d.model.power} />
            <Stat value={accel(model, locale)} unit="s" label="0-100 km/h" />
            {model.dailyRate != null ? (
              <Stat value={money(model.dailyRate, locale)} unit="$" label={d.fleet.perDayLabel} />
            ) : (
              <Stat value="—" label={d.fleet.onRequest} />
            )}
            <Stat value={money(model.deposit, locale)} unit="$" label={d.fleet.deposit} />
          </div>
        </section>

        {/* Présentation */}
        <section className={`${wrap} grid gap-12 py-24 lg:grid-cols-2`}>
          <div>
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
              {locale === 'fr' ? `Location ${model.name} à Montréal` : `${model.name} rental in Montreal`}
            </h2>
            <div className="rule mt-8" />
          </div>
          <div>
            <p className="text-lg font-light leading-relaxed text-paper/85">{model.intro[locale]}</p>
            <ul className="mt-8 border-b border-line">
              {model.highlights[locale].map((h) => (
                <li key={h} className="flex items-center gap-4 border-t border-line py-4 font-light">
                  <span className="h-px w-6 bg-rs" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Btn href="#reserver">{d.model.bookThis}</Btn>
            </div>
          </div>
        </section>

        {/* Galerie bord à bord */}
        {model.images.length > 1 && (
          <section className="grid sm:grid-cols-3">
            {model.images.slice(1).map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden">
                <Image src={src} alt={`${model.name} ${i + 2}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </section>
        )}

        {/* Fiche technique */}
        <section className={`${wrap} py-24`}>
          <h2 className="label text-mute">{d.model.specs}</h2>
          <dl className="mt-8 border-b border-line">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 border-t border-line py-4">
                <dt className="font-light text-mute">{k}</dt>
                <dd className="text-right font-medium sm:text-left">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Réservation */}
        <section id="reserver" className="scroll-mt-16 border-t border-line bg-panel">
          <div className={`${wrap} grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]`}>
            <div>
              <h2 className="text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">{d.booking.title}</h2>
              <div className="rule mt-8" />
              <p className="mt-6 max-w-sm font-light text-mute">{d.booking.sub}</p>
            </div>
            <BookingForm locale={locale} models={models} defaultModel={model.status && model.status !== 'available' ? undefined : model.name} />
          </div>
        </section>

        {/* FAQ du modèle */}
        <section className="border-t border-line">
          <div className={`${wrap} grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]`}>
            <div>
              <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
                {locale === 'fr' ? `Louer la ${model.short} : questions fréquentes` : `Renting the ${model.short}: FAQ`}
              </h2>
              <Link href={GUIDE[locale]} className="label mt-8 inline-block text-mute underline decoration-rs underline-offset-4 hover:text-paper">
                {locale === 'fr' ? 'Comparer les 4 Audi RS →' : 'Compare all 4 Audi RS →'}
              </Link>
            </div>
            <FaqList items={faqItems} />
          </div>
        </section>

        {/* Autres modèles */}
        <section className="border-t border-line">
          <div className={`${wrap} pb-10 pt-20`}>
            <h2 className="label text-mute">{d.model.others}</h2>
          </div>
          <div className="grid sm:grid-cols-3">
            {models.filter((m) => m.id !== model.id).map((m) => (
              <Link key={m.id} href={modelHref(m, locale)} className="group relative block aspect-[4/5] overflow-hidden border-line sm:border-r">
                <ModelVisual model={m} sizes="(min-width: 640px) 33vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="wide text-4xl font-bold tracking-tight transition group-hover:text-rs"><RsMark name={m.short} /></p>
                  <p className="label mt-2 text-paper/70">
                    {m.specs.hp} {d.fleet.hp}
                    {m.dailyRate != null && ` · ${money(m.dailyRate, locale)} $${d.fleet.perDay}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
