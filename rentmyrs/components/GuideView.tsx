import Link from 'next/link';
import { SITE, type Locale } from '@/lib/site';
import { getFleet } from '@/lib/fleet-store';
import type { RsModel } from '@/lib/fleet';
import { AREAS, GUIDE, faqLd } from '@/lib/seo';
import Header from './Header';
import Footer from './Footer';
import ContactFloat from './ContactFloat';
import JsonLd from './JsonLd';
import FaqList from './FaqList';
import { accel, money, modelHref } from './ModelCard';
import { Btn } from './ui';

// Page guide/comparatif : répond directement aux questions « quelle Audi RS louer à Montréal, combien ça coûte ».
// Contenu factuel et chiffré pour Google et les moteurs IA (ChatGPT, Perplexity, AI Overviews).

const BEST_FOR: Record<RsModel['id'], Record<Locale, string>> = {
  rs3: { fr: 'Première location RS, fin de semaine en ville, son du 5 cylindres', en: 'First RS rental, city weekend, five-cylinder sound' },
  rs5: { fr: 'Road trip à deux ou quatre, confort au quotidien, vrai coffre', en: 'Road trips for two to four, everyday comfort, real trunk' },
  rs7: { fr: 'Mariage, événement, photos, le plus de sensations (Stage 2)', en: 'Weddings, events, photo shoots, maximum thrill (Stage 2)' },
  rsq8: { fr: 'Famille, bagages, ski dans les Laurentides, hiver', en: 'Family, luggage, ski trips to the Laurentians, winter' },
};

export default async function GuideView({ locale }: { locale: Locale }) {
  const fr = locale === 'fr';
  const models = await getFleet();
  const home = fr ? '/' : '/en';
  const wrap = 'mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16';
  const h2 = 'text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl';
  const priced = models.filter((m) => m.dailyRate != null);
  const cheapest = priced.reduce<RsModel | null>((a, m) => (!a || m.dailyRate! < a.dailyRate! ? m : a), null);
  const priciest = priced.reduce<RsModel | null>((a, m) => (!a || m.dailyRate! > a.dailyRate! ? m : a), null);
  const price = (m: RsModel) => (m.dailyRate != null ? (fr ? `${money(m.dailyRate, locale)} $` : `$${money(m.dailyRate, locale)}`) : fr ? 'Sur demande' : 'On request');
  const dep = (m: RsModel) => (fr ? `${money(m.deposit, locale)} $` : `$${money(m.deposit, locale)}`);
  const cur = (n: number) => (fr ? `${money(n, locale)} $` : `$${money(n, locale)}`);

  const title = fr ? 'Guide : quelle Audi RS louer à Montréal ?' : 'Guide: which Audi RS to rent in Montreal?';
  const answer = fr
    ? `Chez RentMyRS, on loue quatre Audi RS à Montréal : la RS3, la RS5 Sportback, la RS7 Sportback (Stage 2) et le RSQ8.${cheapest && priciest ? ` Les prix vont de ${cur(cheapest.dailyRate!)} par jour (${cheapest.short}) à ${cur(priciest.dailyRate!)} par jour (${priciest.short}),` : ''} avec un dépôt remboursable de 3 000 $ à 5 000 $. Il faut avoir 25 ans et plus. La livraison est offerte sur demande à Montréal, Laval, sur la Rive-Sud et à l’aéroport YUL, et chaque demande est confirmée par texto, sans paiement en ligne.`
    : `RentMyRS rents four Audi RS models in Montreal: the RS3, RS5 Sportback, RS7 Sportback (Stage 2) and RSQ8.${cheapest && priciest ? ` Prices range from ${cur(cheapest.dailyRate!)} per day (${cheapest.short}) to ${cur(priciest.dailyRate!)} per day (${priciest.short}),` : ''} with a refundable deposit of $3,000 to $5,000. Drivers must be 25 or older. Delivery is available on request across Montreal, Laval, the South Shore and YUL airport, and every request is confirmed by text, with no online payment.`;

  const faq: [string, string][] = fr
    ? [
        ['Quelle est l’Audi RS la moins chère à louer à Montréal ?', cheapest ? `La ${cheapest.name}, à ${cur(cheapest.dailyRate!)} par jour avec un dépôt remboursable de ${dep(cheapest)}.` : 'Les prix sont confirmés sur demande.'],
        ['Quelle Audi RS est la plus puissante ?', 'La RS7 Sportback et le RSQ8 ont le même V8 biturbo de 4,0 L (591 ch d’origine). Notre RS7 est reprogrammée Stage 2 avec échappement pops and bangs, c’est donc la plus puissante de la flotte.'],
        ['Quelle Audi RS choisir pour l’hiver ?', 'Toutes nos RS ont la traction intégrale quattro et des pneus d’hiver. Pour la neige, les bagages ou le ski, le RSQ8 est le plus pratique grâce à sa garde au sol et son coffre.'],
        ['Faut-il payer en ligne ou laisser un acompte ?', 'Non. Tu envoies une demande sur le site, par texto ou WhatsApp, et notre équipe confirme la disponibilité, le permis et le dépôt avec toi avant toute réservation.'],
        ['Où récupérer la voiture ?', `À Montréal, ou livrée sur demande à ${AREAS.join(', ')}. Les frais de livraison sont confirmés avec la réservation.`],
        ['Louez-vous aussi des Lamborghini ?', `Oui, via notre flotte sœur ${SITE.sister.name} (Huracán, Urus et plus).`],
      ]
    : [
        ['What is the cheapest Audi RS to rent in Montreal?', cheapest ? `The ${cheapest.name}, at ${cur(cheapest.dailyRate!)} per day with a ${dep(cheapest)} refundable deposit.` : 'Prices are confirmed on request.'],
        ['Which Audi RS is the most powerful?', 'The RS7 Sportback and RSQ8 share the same 4.0L twin-turbo V8 (591 hp stock). Our RS7 carries a Stage 2 tune with a pops and bangs exhaust, making it the most powerful car in the fleet.'],
        ['Which Audi RS is best for winter?', 'Every RS we rent has quattro all-wheel drive and winter tires. For snow, luggage or ski trips, the RSQ8 is the most practical thanks to its ground clearance and trunk.'],
        ['Do I pay online or leave a down payment?', 'No. Send a request on the site, by text or WhatsApp, and our team confirms availability, licence and deposit with you before anything is booked.'],
        ['Where do I pick up the car?', `In Montreal, or delivered on request to ${AREAS.join(', ')}. Delivery fees are confirmed with the booking.`],
        ['Do you also rent Lamborghinis?', `Yes, through our sister fleet ${SITE.sister.name} (Huracán, Urus and more).`],
      ];

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: answer,
    inLanguage: fr ? 'fr-CA' : 'en-CA',
    url: `${SITE.url}${GUIDE[locale]}`,
    image: `${SITE.url}/og.jpg`,
    dateModified: '2026-11-20',
    author: { '@id': `${SITE.url}/#business` },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` } },
  };
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: fr ? 'Audi RS à louer à Montréal' : 'Audi RS for rent in Montreal',
    itemListElement: models.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, url: `${SITE.url}${modelHref(m, locale)}` })),
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}${home === '/' ? '' : home}` },
      { '@type': 'ListItem', position: 2, name: title, item: `${SITE.url}${GUIDE[locale]}` },
    ],
  };

  const th = 'label py-4 pr-6 text-left font-medium text-mute';
  const td = 'py-4 pr-6 font-light';

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={list} />
      <JsonLd data={crumbs} />
      <JsonLd data={faqLd(faq)} />
      <Header locale={locale} otherHref={GUIDE[fr ? 'en' : 'fr']} />
      <main className="pt-28 sm:pt-36">
        <article>
          <header className={`${wrap} pb-16`}>
            <Link href={home} className="label text-paper/70 hover:text-paper">← {SITE.name}</Link>
            <h1 className="mt-8 max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">{title}</h1>
            <div className="rule mt-10" />
            <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-paper/85">{answer}</p>
          </header>

          {/* Tableau comparatif */}
          <section className="border-t border-line">
            <div className={`${wrap} py-20`}>
              <h2 className={h2}>{fr ? 'Comparatif des Audi RS en location' : 'Audi RS rental comparison'}</h2>
              <div className="mt-10 overflow-x-auto">
                <table className="w-full min-w-[760px] border-b border-line text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th className={th}>{fr ? 'Modèle' : 'Model'}</th>
                      <th className={th}>{fr ? 'Prix / jour' : 'Price / day'}</th>
                      <th className={th}>{fr ? 'Dépôt' : 'Deposit'}</th>
                      <th className={th}>{fr ? 'Moteur' : 'Engine'}</th>
                      <th className={th}>{fr ? 'Puissance' : 'Power'}</th>
                      <th className={th}>0-100</th>
                      <th className={th}>{fr ? 'Places' : 'Seats'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((m) => (
                      <tr key={m.id} className="border-t border-line">
                        <td className={`${td} font-medium`}>
                          <Link href={modelHref(m, locale)} className="underline decoration-rs underline-offset-4 hover:text-rs">{m.name}</Link>
                          {m.badge && <span className="ml-2 text-xs uppercase text-rs">{m.badge[locale]}</span>}
                        </td>
                        <td className={td}>{price(m)}</td>
                        <td className={td}>{dep(m)}</td>
                        <td className={td}>{m.specs.engine}</td>
                        <td className={td}>{m.specs.hp} {fr ? 'ch' : 'hp'}</td>
                        <td className={td}>{accel(m, locale)} s</td>
                        <td className={td}>{m.specs.seats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm font-light text-mute">
                {fr
                  ? 'Puissance d’origine du constructeur. Prix en dollars canadiens, avant taxes et livraison. Mis à jour le 20 novembre 2026.'
                  : 'Manufacturer stock power. Prices in Canadian dollars, before taxes and delivery. Updated November 20, 2026.'}
              </p>
            </div>
          </section>

          {/* Quel modèle pour quel usage */}
          <section className="border-t border-line">
            <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]`}>
              <h2 className={h2}>{fr ? 'Quelle RS pour quelle occasion ?' : 'Which RS for which occasion?'}</h2>
              <ul className="border-b border-line">
                {models.map((m) => (
                  <li key={m.id} className="border-t border-line py-6">
                    <h3 className="text-xl font-medium">
                      <Link href={modelHref(m, locale)} className="hover:text-rs">{m.name}</Link>
                      <span className="ml-3 text-base font-light text-mute">{price(m)}{m.dailyRate != null && (fr ? ' / jour' : ' / day')}</span>
                    </h3>
                    <p className="mt-2 font-light text-paper/85">{BEST_FOR[m.id][locale]}.</p>
                    <p className="mt-2 font-light text-mute">{m.tagline[locale]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Conditions */}
          <section className="border-t border-line">
            <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]`}>
              <h2 className={h2}>{fr ? 'Conditions de location' : 'Rental requirements'}</h2>
              <ul className="border-b border-line">
                {(fr
                  ? [
                      'Âge minimum : 25 ans.',
                      'Permis de conduire valide et preuve d’assurance.',
                      'Carte de crédit au nom du conducteur pour le dépôt remboursable (3 000 $ à 5 000 $ selon le modèle).',
                      'Aucun paiement en ligne : demande, puis confirmation par texto.',
                      'Pneus d’hiver et traction quattro sur toutes les RS en saison froide.',
                      `Livraison sur demande : ${AREAS.join(', ')}.`,
                    ]
                  : [
                      'Minimum age: 25.',
                      'Valid driver’s licence and proof of insurance.',
                      'Credit card in the driver’s name for the refundable deposit ($3,000 to $5,000 depending on the model).',
                      'No online payment: send a request, we confirm by text.',
                      'Winter tires and quattro all-wheel drive on every RS in the cold season.',
                      `Delivery on request: ${AREAS.join(', ')}.`,
                    ]
                ).map((x) => (
                  <li key={x} className="flex items-start gap-4 border-t border-line py-4 font-light">
                    <span className="mt-3 h-px w-6 shrink-0 bg-rs" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-line">
            <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]`}>
              <h2 className={h2}>{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
              <FaqList items={faq} />
            </div>
          </section>

          <section id="reserver" className="scroll-mt-16 border-t border-line bg-panel">
            <div className={`${wrap} flex flex-col gap-8 py-20 sm:flex-row sm:items-center sm:justify-between`}>
              <p className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">{fr ? 'Prêt à rouler ?' : 'Ready to drive?'}</p>
              <div className="flex flex-wrap gap-4">
                <Btn href={`${home}#reserver`}>{fr ? 'Faire une demande' : 'Request a car'}</Btn>
                <Btn href={`tel:${SITE.phone}`} variant="ghost">{SITE.phoneDisplay}</Btn>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer locale={locale} />
      <ContactFloat />
    </>
  );
}
