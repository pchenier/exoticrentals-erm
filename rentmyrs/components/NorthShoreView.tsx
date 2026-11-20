import Link from 'next/link';
import { SITE, type Locale } from '@/lib/site';
import { getFleet } from '@/lib/fleet-store';
import { BUSINESS_ID, GUIDE, NORTH, NORTH_SHORE, faqLd } from '@/lib/seo';
import Header from './Header';
import Footer from './Footer';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';
import BookingModal from './BookingModal';
import FaqList from './FaqList';
import { ModelVisual, money, modelHref } from './ModelCard';
import { Btn } from './ui';

// Page locale Rive-Nord : Laval, Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme…
export default async function NorthShoreView({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const models = await getFleet();
  const home = fr ? '/' : '/en';
  const wrap = 'mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16';
  const h2 = 'text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl';
  const cur = (n: number) => (fr ? `${money(n, locale)} $` : `$${money(n, locale)}`);
  const priced = models.filter((m) => m.dailyRate != null).map((m) => m.dailyRate!);
  const from = priced.length ? Math.min(...priced) : null;
  const cities = NORTH_SHORE.join(', ');

  const title = fr ? 'Location Audi RS sur la Rive-Nord' : 'Audi RS rental on Montreal’s North Shore';
  const answer = fr
    ? `RentMyRS livre ses Audi RS3, RS5, RS7 (Stage 2), RSQ8 et R8 V10 sur la Rive-Nord de Montréal : ${cities}.${from ? ` Les prix commencent à ${cur(from)} par jour,` : ''} avec un dépôt remboursable selon le modèle. Tu fais ta demande en ligne, par texto ou WhatsApp, on confirme par texto et on te livre l’auto à la maison, au bureau ou à l’hôtel. Les frais de livraison sont confirmés avec la réservation.`
    : `RentMyRS delivers its Audi RS3, RS5, RS7 (Stage 2), RSQ8 and R8 V10 across Montreal’s North Shore (Rive-Nord): ${cities}.${from ? ` Prices start at ${cur(from)} per day,` : ''} with a refundable deposit depending on the model. Send a request online, by text or WhatsApp, we confirm by text and deliver the car to your home, office or hotel. Delivery fees are confirmed with the booking.`;

  const faq: [string, string][] = fr
    ? [
        ['Livrez-vous les Audi RS sur la Rive-Nord ?', `Oui. Toutes nos autos (RS3, RS5, RS7, RSQ8 et R8) peuvent être livrées sur demande à ${cities}. Les frais de livraison sont confirmés avec la réservation.`],
        ['Combien coûte une Audi RS à Laval ou Terrebonne ?', `Le même prix qu’à Montréal : ${models.filter((m) => m.dailyRate != null).map((m) => `${m.short} ${cur(m.dailyRate!)}`).join(', ')} par jour, plus la livraison. Le dépôt est remboursable.`],
        ['Quelles sont les conditions ?', 'Avoir 25 ans et plus, un permis valide, une preuve d’assurance et une carte de crédit à ton nom pour le dépôt. Aucun paiement en ligne : on confirme chaque demande par texto.'],
        ['Peut-on monter dans les Laurentides avec la voiture ?', 'Oui. Depuis la Rive-Nord, l’autoroute 15 mène à Saint-Sauveur et Mont-Tremblant. Toutes nos RS ont la traction quattro et des pneus d’hiver en saison froide ; le RSQ8 est le plus pratique pour le ski.'],
        ['Puis-je venir chercher l’auto moi-même ?', 'Oui, la prise en charge se fait à Montréal. La livraison sur la Rive-Nord est une option pour t’éviter le déplacement.'],
      ]
    : [
        ['Do you deliver Audi RS cars to the North Shore?', `Yes. Every car (RS3, RS5, RS7, RSQ8 and R8) can be delivered on request to ${cities}. Delivery fees are confirmed with the booking.`],
        ['How much is an Audi RS in Laval or Terrebonne?', `The same price as in Montreal: ${models.filter((m) => m.dailyRate != null).map((m) => `${m.short} ${cur(m.dailyRate!)}`).join(', ')} per day, plus delivery. The deposit is refundable.`],
        ['What are the requirements?', 'Be 25 or older, with a valid licence, proof of insurance and a credit card in your name for the deposit. No online payment: we confirm every request by text.'],
        ['Can I drive up to the Laurentians?', 'Yes. From the North Shore, Highway 15 leads to Saint-Sauveur and Mont-Tremblant. Every RS has quattro all-wheel drive and winter tires in the cold season; the RSQ8 is the most practical for ski trips.'],
        ['Can I pick up the car myself?', 'Yes, pickup is in Montreal. North Shore delivery is an option to save you the trip.'],
      ];

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    serviceType: fr ? 'Location de voitures de performance' : 'Performance car rental',
    description: answer,
    url: `${SITE.url}${NORTH[locale]}`,
    provider: { '@id': BUSINESS_ID },
    areaServed: [
      { '@type': 'AdministrativeArea', name: fr ? 'Rive-Nord de Montréal' : 'North Shore of Montreal' },
      ...NORTH_SHORE.map((name) => ({ '@type': 'City', name, containedInPlace: { '@type': 'AdministrativeArea', name: 'Québec' } })),
    ],
    offers: models
      .filter((m) => m.dailyRate != null)
      .map((m) => ({
        '@type': 'Offer',
        name: m.name,
        price: m.dailyRate,
        priceCurrency: 'CAD',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: m.dailyRate, priceCurrency: 'CAD', unitCode: 'DAY' },
        url: `${SITE.url}${modelHref(m, locale)}`,
      })),
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}${fr ? '' : '/en'}` },
      { '@type': 'ListItem', position: 2, name: title, item: `${SITE.url}${NORTH[locale]}` },
    ],
  };

  return (
    <>
      <JsonLd data={service} />
      <JsonLd data={crumbs} />
      <JsonLd data={faqLd(faq)} />
      <Header locale={locale} otherHref={NORTH[fr ? 'en' : 'fr']} />
      <main className="pt-28 sm:pt-36">
        <article>
          <header className={`${wrap} pb-16`}>
            <Link href={home} className="label text-paper/70 hover:text-paper">← {SITE.name}</Link>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">{title}</h1>
            <div className="rule mt-10" />
            <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-paper/85">{answer}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Btn href="#reserver">{fr ? 'Faire une demande' : 'Request a car'}</Btn>
              <Btn href={`tel:${SITE.phone}`} variant="ghost">{SITE.phoneDisplay}</Btn>
            </div>
          </header>

          {/* Les autos */}
          <section className="border-t border-line">
            <div className={`${wrap} pb-10 pt-20`}>
              <h2 className={h2}>{fr ? 'Les autos livrées sur la Rive-Nord' : 'Cars delivered to the North Shore'}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {models.map((m) => (
                <Link key={m.id} href={modelHref(m, locale)} className="group relative block aspect-[4/3] overflow-hidden">
                  <ModelVisual model={m} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="wide text-3xl font-bold tracking-tight transition group-hover:text-rs">{m.short}</h3>
                    <p className="label mt-2 text-paper/75">
                      {m.dailyRate != null ? `${cur(m.dailyRate)}${fr ? ' / jour' : ' / day'}` : fr ? 'Prix sur demande' : 'Price on request'}
                      {` · ${fr ? 'dépôt' : 'deposit'} ${cur(m.deposit)}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Villes */}
          <section className="border-t border-line">
            <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]`}>
              <h2 className={h2}>{fr ? 'Villes desservies sur la Rive-Nord' : 'North Shore cities we serve'}</h2>
              <div>
                <ul className="grid grid-cols-2 border-b border-line sm:grid-cols-3">
                  {NORTH_SHORE.map((c) => (
                    <li key={c} className="flex items-center gap-3 border-t border-line py-4 font-light">
                      <span className="h-px w-4 bg-rs" />
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-light text-mute">
                  {fr
                    ? 'Ta ville n’est pas dans la liste ? Écris-nous : on livre aussi ailleurs sur la Rive-Nord et dans les Basses-Laurentides sur demande.'
                    : 'Your town is not listed? Message us: we also deliver elsewhere on the North Shore and in the Lower Laurentians on request.'}
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-line">
            <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]`}>
              <div>
                <h2 className={h2}>{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
                <Link href={GUIDE[locale]} className="label mt-8 inline-block text-mute underline decoration-rs underline-offset-4 hover:text-paper">
                  {fr ? 'Comparer les Audi RS →' : 'Compare the Audi RS →'}
                </Link>
              </div>
              <FaqList items={faq} />
            </div>
          </section>

          <section id="reserver" className="scroll-mt-16 border-t border-line bg-panel">
            <div className={`${wrap} flex flex-col gap-8 py-20 sm:flex-row sm:items-center sm:justify-between`}>
              <p className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">{fr ? 'On livre sur la Rive-Nord' : 'We deliver to the North Shore'}</p>
              <div className="flex flex-wrap gap-4">
                <Btn href="#reserver">{fr ? 'Faire une demande' : 'Request a car'}</Btn>
                <Btn href={`tel:${SITE.phone}`} variant="ghost">{SITE.phoneDisplay}</Btn>
              </div>
            </div>
          </section>
        </article>
        <BookingModal locale={locale} models={models} />
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
