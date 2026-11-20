// Données structurées (schema.org) et contenu factuel partagés : Google, ChatGPT, Perplexity, etc.
import { SITE, type Locale } from './site';
import type { RsModel } from './fleet';

export const BUSINESS_ID = `${SITE.url}/#business`;

// Villes de la Rive-Nord desservies (livraison sur demande).
export const NORTH_SHORE = ['Laval', 'Terrebonne', 'Mascouche', 'Repentigny', 'Blainville', 'Boisbriand', 'Sainte-Thérèse', 'Rosemère', 'Mirabel', 'Saint-Eustache', 'Deux-Montagnes', 'Saint-Jérôme'];

export const AREAS = ['Montréal', 'Laval', 'Rive-Nord', 'Terrebonne', 'Blainville', 'Boisbriand', 'Mirabel', 'Repentigny', 'Longueuil', 'Brossard', 'Rive-Sud', 'Aéroport Montréal-Trudeau (YUL)'];

/** Page locale Rive-Nord. */
export const NORTH = {
  fr: '/location-audi-rs-rive-nord',
  en: '/en/audi-rs-rental-north-shore-montreal',
};

export const GUIDE = {
  fr: '/guide-location-audi-rs-montreal',
  en: '/en/audi-rs-rental-guide-montreal',
};

export function businessLd(locale: Locale, models: RsModel[]) {
  const priced = models.map((m) => m.dailyRate).filter((n): n is number => n != null);
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': BUSINESS_ID,
    name: SITE.name,
    alternateName: 'Rent My RS',
    description:
      locale === 'fr'
        ? 'Location d’Audi RS (RS3, RS5, RS7, RSQ8) et de l’Audi R8 V10 à Montréal, avec livraison à Laval, sur la Rive-Nord, sur la Rive-Sud et à l’aéroport YUL. Réservation sur demande, sans paiement en ligne.'
        : 'Audi RS rental (RS3, RS5, RS7, RSQ8) and Audi R8 V10 in Montreal, with delivery to Laval, the North Shore (Rive-Nord), the South Shore and YUL airport. Booking on request, no online payment.',
    url: locale === 'fr' ? SITE.url : `${SITE.url}/en`,
    logo: `${SITE.url}/logo.png`,
    image: [`${SITE.url}/cars/rs3-front.jpg`, `${SITE.url}/cars/rs7-1.jpg`, `${SITE.url}/og.jpg`],
    telephone: SITE.phone,
    priceRange: priced.length ? `${Math.min(...priced)}–${Math.max(...priced)} CAD / jour` : undefined,
    currenciesAccepted: 'CAD',
    knowsLanguage: ['fr-CA', 'en-CA'],
    address: { '@type': 'PostalAddress', addressLocality: 'Montréal', addressRegion: 'QC', addressCountry: 'CA' },
    geo: { '@type': 'GeoCoordinates', latitude: 45.5017, longitude: -73.5673 },
    areaServed: AREAS.map((name) => ({ '@type': 'Place', name })),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      contactType: 'reservations',
      availableLanguage: ['French', 'English'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'fr' ? 'Location Audi RS' : 'Audi RS rental',
      itemListElement: models.map((m) => offerLd(m, locale)),
    },
  };
}

export function offerLd(m: RsModel, locale: Locale) {
  const url = `${SITE.url}${locale === 'fr' ? '' : '/en'}/${m.slug[locale]}`;
  return {
    '@type': 'Offer',
    url,
    businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
    priceCurrency: 'CAD',
    ...(m.dailyRate != null && {
      price: m.dailyRate,
      priceSpecification: { '@type': 'UnitPriceSpecification', price: m.dailyRate, priceCurrency: 'CAD', unitCode: 'DAY', unitText: locale === 'fr' ? 'jour' : 'day' },
    }),
    availability: !m.status || m.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    areaServed: AREAS.map((name) => ({ '@type': 'Place', name })),
    seller: { '@id': BUSINESS_ID },
    itemOffered: carLd(m, locale),
  };
}

export function carLd(m: RsModel, locale: Locale) {
  return {
    '@type': 'Car',
    name: m.name,
    brand: { '@type': 'Brand', name: 'Audi' },
    model: m.short,
    bodyType: m.body[locale],
    description: m.intro[locale],
    ...(m.images[0] && { image: m.images.map((i) => (i.startsWith('http') ? i : `${SITE.url}${i}`)) }),
    vehicleEngine: { '@type': 'EngineSpecification', name: m.specs.engine, enginePower: { '@type': 'QuantitativeValue', value: m.specs.hp, unitText: 'hp' } },
    accelerationTime: { '@type': 'QuantitativeValue', value: parseFloat(m.specs.zeroTo100), unitCode: 'SEC', description: '0-100 km/h' },
    driveWheelConfiguration: 'https://schema.org/AllWheelDriveConfiguration',
    seatingCapacity: m.specs.seats,
  };
}

const fmt = (n: number, l: Locale) => n.toLocaleString(l === 'fr' ? 'fr-CA' : 'en-CA');

/** Questions fréquentes propres à chaque modèle (affichées sur la fiche + FAQPage). */
export function modelFaq(m: RsModel, l: Locale): [string, string][] {
  const price = m.dailyRate != null ? fmt(m.dailyRate, l) : null;
  const dep = fmt(m.deposit, l);
  if (l === 'fr') {
    return [
      [
        `Combien coûte la location d’une ${m.name} à Montréal ?`,
        price
          ? `La ${m.name} se loue ${price} $ par jour chez RentMyRS, avec un dépôt de sécurité remboursable de ${dep} $. Le prix final (durée, livraison) est confirmé par texto avant la réservation.`
          : `Le prix de la ${m.name} est confirmé sur demande. Le dépôt de sécurité remboursable est de ${dep} $.`,
      ],
      [
        `Quelles sont les conditions pour louer une ${m.short} ?`,
        'Avoir 25 ans et plus, un permis de conduire valide, une preuve d’assurance et une carte de crédit à ton nom pour le dépôt. Aucun paiement en ligne : notre équipe valide chaque demande par texto.',
      ],
      [
        `La ${m.short} peut-elle être livrée à Laval ou sur la Rive-Nord ?`,
        'Oui, sur demande à Montréal, Laval, sur la Rive-Nord (Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme), à Longueuil, Brossard et sur la Rive-Sud, à ton hôtel ou à l’aéroport Montréal-Trudeau (YUL). Tu peux aussi venir la chercher à Montréal.',
      ],
      [
        `Quelle est la puissance de la ${m.name} ?`,
        `La ${m.name} a un moteur ${m.specs.engine} de ${m.specs.hp} ch d’origine, la traction intégrale ${m.specs.drivetrain} et fait le 0-100 km/h en ${m.specs.zeroTo100.replace('.', ',')}.${m.badge ? ` Notre exemplaire est reprogrammé ${m.badge.fr}.` : ''}`,
      ],
      [
        `Peut-on louer la ${m.short} l’hiver ?`,
        'Oui. La traction quattro et les pneus d’hiver (obligatoires au Québec du 1er décembre au 15 mars) permettent de rouler toute l’année.',
      ],
    ];
  }
  return [
    [
      `How much does it cost to rent an ${m.name} in Montreal?`,
      price
        ? `The ${m.name} rents for $${price} per day at RentMyRS, with a $${dep} refundable security deposit. The final price (length, delivery) is confirmed by text before booking.`
        : `The ${m.name} price is confirmed on request. The refundable security deposit is $${dep}.`,
    ],
    [
      `What do I need to rent an ${m.short}?`,
      'You must be 25 or older, with a valid driver’s licence, proof of insurance and a credit card in your name for the deposit. No online payment: our team confirms every request by text.',
    ],
    [
      `Can the ${m.short} be delivered to Laval or the North Shore?`,
      'Yes, on request across Montreal, Laval, the North Shore (Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme), Longueuil, Brossard and the South Shore, to your hotel or Montréal-Trudeau airport (YUL). You can also pick it up in Montreal.',
    ],
    [
      `How powerful is the ${m.name}?`,
      `The ${m.name} has a ${m.specs.engine} engine making ${m.specs.hp} hp stock, quattro all-wheel drive and runs 0-100 km/h in ${m.specs.zeroTo100}.${m.badge ? ` Our car carries a ${m.badge.en} tune.` : ''}`,
    ],
    [
      `Can I rent the ${m.short} in winter?`,
      'Yes. quattro all-wheel drive and winter tires (mandatory in Quebec from December 1 to March 15) make it usable all year round.',
    ],
  ];
}

export const faqLd = (items: readonly (readonly [string, string])[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
