import Link from 'next/link';
import { SITE, waUrl, type Locale } from '@/lib/site';
import { t } from '@/lib/dict';
import type { RsModel } from '@/lib/fleet';
import Header from './Header';
import Footer from './Footer';
import { Badge, ModelTile, ModelVisual, StatusBand, accel, money, modelHref } from './ModelCard';
import ModelGallery from './ModelGallery';
import BookingModal from './BookingModal';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';
import FaqList from './FaqList';
import { GUIDE, carLd, faqLd, modelFaq, offerLd } from '@/lib/seo';
import { Btn, RsMark } from './ui';

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
      <main className="pt-20 sm:pt-24">
        {/* Comme les pages d'exoticrentalsmontreal.com : galerie à gauche, infos, prix et fiche à droite. */}
        <section className={`${wrap} pb-16 pt-6`}>
          <Link href={`${prefix || '/'}#rs`} className="label inline-flex items-center gap-2 border border-line px-4 py-2.5 text-paper/80 transition hover:border-paper hover:text-paper">
            ← {d.model.back}
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <ModelGallery
                images={model.images}
                alt={model.name}
                focuses={model.focuses}
                overlay={<StatusBand model={model} locale={locale} />}
                placeholder={<ModelVisual model={model} sizes="50vw" />}
              />
            </div>

            <div className="anim-rise min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="label text-mute">Audi · {model.body[locale]}</p>
                <Badge model={model} locale={locale} />
              </div>
              <h1 className="mt-3 wide text-5xl font-bold leading-none tracking-tight sm:text-6xl">
                <RsMark name={model.short} />
                <span className="sr-only"> {locale === 'fr' ? `– location ${model.name} à Montréal` : `– ${model.name} rental in Montreal`}</span>
              </h1>
              <p className="mt-2 text-sm font-light text-mute">{model.name}</p>
              <p className="mt-5 text-lg font-light text-paper">{model.tagline[locale]}</p>
              <p className="mt-4 whitespace-pre-line font-light leading-relaxed text-paper/75">{model.intro[locale]}</p>

              {/* Prix */}
              <div className="mt-8 border border-line bg-panel p-5 sm:p-6">
                <p className="flex items-baseline gap-2">
                  {model.dailyRate != null ? (
                    <>
                      <span className="text-4xl font-light tracking-tight">{money(model.dailyRate, locale)} $</span>
                      <span className="label text-mute">{d.fleet.perDay}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-light">{d.fleet.onRequest}</span>
                  )}
                </p>
                <p className="mt-2 text-sm font-light text-mute">
                  {d.fleet.deposit} : {money(model.deposit, locale)} $
                </p>
              </div>

              {/* Fiche technique */}
              <h2 className="label mt-8 text-mute">{d.model.specs}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6">
                {specs.map(([k, v]) => (
                  <div key={k} className="border-b border-line py-3">
                    <dt className="label text-[10px] text-mute">{k}</dt>
                    <dd className="mt-1 text-lg font-light">{v}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 grid gap-2">
                {model.highlights[locale].map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm font-light text-paper/80">
                    <span className="h-px w-5 shrink-0 bg-rs" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Btn href="#reserver" className="justify-center sm:flex-1">{d.model.bookThis}</Btn>
                <a
                  href={waUrl(locale === 'fr' ? `Bonjour, je suis intéressé par la ${model.name}` : `Hi, I'm interested in the ${model.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label inline-flex items-center justify-center border border-paper/30 px-6 py-4 text-paper transition hover:border-paper sm:flex-1"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Vidéos ajoutées dans /admin */}
        {model.videos && model.videos.length > 0 && (
          <section className={`${wrap} grid gap-4 pb-16 ${model.videos.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {model.videos.map((src) => (
              <video key={src} src={src} controls playsInline preload="metadata" className="aspect-video w-full border border-line bg-black object-cover" />
            ))}
          </section>
        )}

        <BookingModal locale={locale} models={models} defaultModel={model.status && model.status !== 'available' ? undefined : model.name} />

        {/* FAQ du modèle */}
        <section className="border-t border-line">
          <div className={`${wrap} grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]`}>
            <div>
              <h2 className="text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
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
          <div className={`${wrap} pb-8 pt-16`}>
            <h2 className="label text-mute">{d.model.others}</h2>
          </div>
          <div className={`${wrap} grid gap-5 pb-20 sm:grid-cols-2 lg:grid-cols-4`}>
            {models.filter((m) => m.id !== model.id).map((m) => (
              <ModelTile key={m.id} model={m} locale={locale} />
            ))}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
