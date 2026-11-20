import type { Locale } from './site';

type L = Record<Locale, string>;

export type RsModel = {
  id: 'rs3' | 'rs5' | 'rs7' | 'rsq8';
  name: string; // "Audi RS3"
  short: string; // "RS3"
  slug: Record<Locale, string>;
  body: L;
  tagline: L;
  intro: L;
  highlights: Record<Locale, string[]>;
  specs: { hp: number; engine: string; zeroTo100: string; seats: number; drivetrain: string };
  /** Prix par jour en CAD. null = « sur demande » tant que le prix n'est pas fixé. */
  dailyRate: number | null;
  images: string[];
};

// TODO(pan) : confirmer les prix, années et photos de RS3 et RSQ8.
export const RS_MODELS: RsModel[] = [
  {
    id: 'rs3',
    name: 'Audi RS3',
    short: 'RS3',
    slug: { fr: 'location-audi-rs3-montreal', en: 'audi-rs3-rental-montreal' },
    body: { fr: 'Berline compacte', en: 'Compact sedan' },
    tagline: { fr: 'Le 5 cylindres le plus vivant de sa catégorie.', en: 'The most alive five-cylinder in its class.' },
    intro: {
      fr: "La RS3, c'est le son unique du 5 cylindres turbo de 2,5 L et 401 ch dans une berline compacte. Parfaite pour une fin de semaine à Montréal, une sortie dans les Laurentides ou un premier pas dans l'univers RS.",
      en: "The RS3 packs the unmistakable sound of a 401 hp 2.5L turbo five-cylinder into a compact sedan. Perfect for a Montreal weekend, a run up to the Laurentians, or your first taste of RS.",
    },
    highlights: {
      fr: ['5 cylindres turbo 2,5 L', 'Quattro avec RS Torque Splitter', 'Idéale pour une première location RS'],
      en: ['2.5L turbo five-cylinder', 'quattro with RS Torque Splitter', 'The ideal first RS rental'],
    },
    specs: { hp: 401, engine: '2.5L TFSI 5 cyl.', zeroTo100: '3.8 s', seats: 5, drivetrain: 'quattro' },
    dailyRate: null,
    images: [],
  },
  {
    id: 'rs5',
    name: 'Audi RS5 Sportback',
    short: 'RS5',
    slug: { fr: 'location-audi-rs5-montreal', en: 'audi-rs5-rental-montreal' },
    body: { fr: 'Sportback', en: 'Sportback' },
    tagline: { fr: 'Le V6 biturbo pour tous les jours.', en: 'The everyday twin-turbo V6.' },
    intro: {
      fr: "La RS5 Sportback combine un V6 biturbo de 2,9 L et 444 ch, la traction intégrale quattro et cinq portes. Assez confortable pour la route, assez rapide pour qu'on s'en souvienne.",
      en: 'The RS5 Sportback pairs a 444 hp 2.9L twin-turbo V6 with quattro all-wheel drive and five doors. Comfortable enough for the highway, quick enough to remember.',
    },
    highlights: {
      fr: ['V6 biturbo 2,9 L', 'Sièges RS en nid d’abeille', 'Cinq portes, vrai coffre'],
      en: ['2.9L twin-turbo V6', 'RS honeycomb sport seats', 'Five doors, real trunk'],
    },
    specs: { hp: 444, engine: '2.9L V6 biturbo', zeroTo100: '3.9 s', seats: 5, drivetrain: 'quattro' },
    dailyRate: null,
    images: ['/cars/rs5-1.jpg', '/cars/rs5-2.jpg', '/cars/rs5-interieur.jpg'],
  },
  {
    id: 'rs7',
    name: 'Audi RS7 Sportback',
    short: 'RS7',
    slug: { fr: 'location-audi-rs7-montreal', en: 'audi-rs7-rental-montreal' },
    body: { fr: 'Sportback', en: 'Sportback' },
    tagline: { fr: 'Le V8 biturbo qui fait tourner les têtes.', en: 'The twin-turbo V8 that turns heads.' },
    intro: {
      fr: "La RS7 Sportback, c'est 591 ch, un V8 biturbo de 4,0 L et une silhouette qu'on reconnaît de loin. Le choix pour un mariage, un événement corporatif ou simplement la plus belle fin de semaine de l'année.",
      en: 'The RS7 Sportback brings 591 hp from a 4.0L twin-turbo V8 and a silhouette you spot from a block away. The pick for a wedding, a corporate event, or simply the best weekend of the year.',
    },
    highlights: {
      fr: ['V8 biturbo 4,0 L', 'Direction aux 4 roues', 'Confort de grande routière'],
      en: ['4.0L twin-turbo V8', 'All-wheel steering', 'Grand-touring comfort'],
    },
    specs: { hp: 591, engine: '4.0L V8 biturbo', zeroTo100: '3.6 s', seats: 5, drivetrain: 'quattro' },
    dailyRate: null,
    images: ['/cars/rs7-1.jpg', '/cars/rs7-2.jpg', '/cars/rs7-route.jpg', '/cars/rs7-3.jpg'],
  },
  {
    id: 'rsq8',
    name: 'Audi RSQ8',
    short: 'RSQ8',
    slug: { fr: 'location-audi-rsq8-montreal', en: 'audi-rsq8-rental-montreal' },
    body: { fr: 'VUS performance', en: 'Performance SUV' },
    tagline: { fr: 'Le VUS qui pense être une supercar.', en: 'The SUV that thinks it is a supercar.' },
    intro: {
      fr: "Le RSQ8 partage son V8 biturbo de 591 ch avec la RS7, dans un VUS cinq places. De la place pour la famille ou les bagages, et des performances qui surprennent même au volant d'une Lamborghini.",
      en: 'The RSQ8 shares its 591 hp twin-turbo V8 with the RS7, in a five-seat SUV. Room for the family or the luggage, with performance that surprises even Lamborghini drivers.',
    },
    highlights: {
      fr: ['V8 biturbo 4,0 L', 'Cinq places et grand coffre', 'Parfait pour l’hiver québécois'],
      en: ['4.0L twin-turbo V8', 'Five seats, big trunk', 'Built for Quebec winters'],
    },
    specs: { hp: 591, engine: '4.0L V8 biturbo', zeroTo100: '3.8 s', seats: 5, drivetrain: 'quattro' },
    dailyRate: null,
    images: [],
  },
];

export type Lambo = { name: string; hp: number; dailyRate: number; image: string };

// Vitrine Lamborghini (prix repris de exoticrentalsmontreal.com, lib/data.ts).
export const LAMBOS: Lambo[] = [
  { name: 'Lamborghini Huracán Tecnica', hp: 631, dailyRate: 1599, image: '/cars/huracan-tecnica.jpg' },
  { name: 'Lamborghini Urus', hp: 641, dailyRate: 1399, image: '/cars/urus.jpg' },
  { name: 'Lamborghini Huracán EVO', hp: 610, dailyRate: 1499, image: '/cars/huracan-evo.jpg' },
];

export const findModel = (locale: Locale, slug: string) =>
  RS_MODELS.find((m) => m.slug[locale] === slug);
