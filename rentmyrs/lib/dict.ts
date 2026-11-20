import type { Locale } from './site';

export const DICT = {
  fr: {
    htmlLang: 'fr-CA',
    nav: { fleet: 'Les RS', lambo: 'Lamborghini', how: 'Comment ça marche', faq: 'FAQ', book: 'Réserver', other: 'EN', otherHref: '/en' },
    meta: {
      title: 'Location Audi RS à Montréal | RS3, RS5, RS7, RSQ8 | RentMyRS',
      description:
        'Location d’Audi RS à Montréal : RS3, RS5, RS7 et RSQ8. Livraison à Montréal, Laval et Rive-Sud. Demande de réservation en 2 minutes, confirmée par notre équipe.',
    },
    hero: {
      kicker: 'Location Audi RS · Montréal',
      title: 'Conduis une RS. Pas juste une Audi.',
      sub: 'RS3, RS5, RS7 et RSQ8 bien entretenues, prêtes à rouler à Montréal, avec livraison sur demande à Laval et sur la Rive-Sud. Tu fais ta demande, on te confirme rapidement par texto.',
      cta: 'Faire une demande',
      cta2: 'Voir les RS',
    },
    fleet: { title: 'La gamme RS', sub: 'Quatre caractères, une seule philosophie : la performance au quotidien.', from: 'Dès', perDay: '/jour', perDayLabel: 'Par jour', onRequest: 'Prix sur demande', details: 'Découvrir', hp: 'ch', seats: 'places', photoSoon: 'Photos à venir', deposit: 'Dépôt remboursable' },
    lambo: {
      kicker: 'Envie de plus ?',
      title: 'Les Lamborghini sont aussi disponibles',
      sub: 'Huracán et Urus de notre flotte sœur Exotic Rentals Montreal, avec le même service de livraison.',
      from: 'Dès',
      cta: 'Voir les Lamborghini',
    },
    how: {
      title: 'Comment ça marche',
      steps: [
        ['Choisis ta RS', 'Sélectionne le modèle et tes dates. Aucun paiement en ligne.'],
        ['On confirme', 'Notre équipe vérifie la disponibilité et te texte pour valider ton permis et ton dépôt.'],
        ['Prends le volant', 'On te remet les clés à Montréal, ou chez toi sur demande.'],
      ],
    },
    booking: {
      title: 'Demande de réservation',
      sub: 'Aucun paiement en ligne. On te répond par texto pour confirmer.',
      name: 'Nom complet', phone: 'Téléphone', email: 'Courriel (optionnel)', model: 'Modèle', any: 'Peu importe / conseillez-moi',
      start: 'Date de début', end: 'Date de retour', message: 'Message (optionnel)', messagePh: 'Adresse de livraison, occasion, questions…',
      submit: 'Envoyer ma demande', sending: 'Envoi…',
      ok: 'Merci ! Ta demande est reçue. On te texte très bientôt pour confirmer.',
      err: 'Oups, la demande n’a pas pu être envoyée. Écris-nous directement par texto ou WhatsApp.',
      orText: 'Ou écris-nous directement',
    },
    faq: {
      title: 'Questions fréquentes',
      items: [
        ['Quel âge faut-il avoir pour louer une Audi RS ?', 'Il faut avoir 25 ans et plus, un permis de conduire valide, une preuve d’assurance et une carte de crédit à ton nom pour le dépôt de sécurité remboursable.'],
        ['Est-ce que je paie en ligne ?', 'Non. Tu fais une demande, notre équipe confirme la disponibilité et les détails avec toi par texto avant toute réservation.'],
        ['Livrez-vous la voiture ?', 'Oui, sur demande à Montréal, Laval, la Rive-Sud, à ton hôtel ou à l’aéroport Montréal-Trudeau (YUL). Les frais sont confirmés avec ta réservation. Tu peux aussi venir la chercher à Montréal.'],
        ['Les RS sont-elles équipées pour l’hiver ?', 'Oui. Toutes nos RS ont la traction intégrale quattro et roulent en pneus d’hiver pendant la saison froide, comme l’exige la loi au Québec.'],
        ['Puis-je louer une Lamborghini avec vous ?', 'Oui, les Huracán et Urus de notre flotte sœur Exotic Rentals Montreal sont disponibles avec le même service.'],
      ],
    },
    footer: { tagline: 'Location d’Audi RS à Montréal.', sister: 'Une flotte sœur de', rights: 'Tous droits réservés.', disclaimer: 'Audi, RS et les noms de modèles sont des marques de leurs propriétaires. RentMyRS est un service de location indépendant, non affilié à Audi AG.' },
    model: {
      back: 'Toutes les RS', specs: 'Fiche technique', power: 'Puissance (origine)', engine: 'Moteur', accel: '0-100 km/h', seats: 'Places', drive: 'Traction',
      bookThis: 'Réserver cette RS', others: 'Les autres RS',
      metaTitle: (n: string) => `Location ${n} Montréal | RentMyRS`,
      metaDesc: (n: string, hp: number) => `Loue une ${n} (${hp} ch) à Montréal. Livraison à Montréal, Laval et Rive-Sud. Demande de réservation rapide, confirmée par texto.`,
    },
  },
  en: {
    htmlLang: 'en-CA',
    nav: { fleet: 'The RS', lambo: 'Lamborghini', how: 'How it works', faq: 'FAQ', book: 'Book', other: 'FR', otherHref: '/' },
    meta: {
      title: 'Audi RS Rental Montreal | RS3, RS5, RS7, RSQ8 | RentMyRS',
      description:
        'Rent an Audi RS in Montreal: RS3, RS5, RS7 and RSQ8. Delivery across Montreal, Laval and the South Shore. Request in 2 minutes, confirmed by our team.',
    },
    hero: {
      kicker: 'Audi RS rental · Montreal',
      title: 'Drive an RS. Not just an Audi.',
      sub: 'Well-kept RS3, RS5, RS7 and RSQ8, ready to drive in Montreal, with delivery on request to Laval and the South Shore. Send a request and we confirm by text.',
      cta: 'Request a car',
      cta2: 'See the RS lineup',
    },
    fleet: { title: 'The RS lineup', sub: 'Four characters, one idea: everyday performance.', from: 'From', perDay: '/day', perDayLabel: 'Per day', onRequest: 'Price on request', details: 'Discover', hp: 'hp', seats: 'seats', photoSoon: 'Photos coming soon', deposit: 'Refundable deposit' },
    lambo: {
      kicker: 'Want more?',
      title: 'Lamborghinis are available too',
      sub: 'Huracán and Urus from our sister fleet Exotic Rentals Montreal, with the same delivery service.',
      from: 'From',
      cta: 'See the Lamborghinis',
    },
    how: {
      title: 'How it works',
      steps: [
        ['Pick your RS', 'Choose the model and your dates. No online payment.'],
        ['We confirm', 'Our team checks availability and texts you to verify your licence and deposit.'],
        ['Hit the road', 'Pick up the keys in Montreal, or have the car delivered on request.'],
      ],
    },
    booking: {
      title: 'Booking request',
      sub: 'No online payment. We text you back to confirm.',
      name: 'Full name', phone: 'Phone', email: 'Email (optional)', model: 'Model', any: 'Not sure / advise me',
      start: 'Start date', end: 'Return date', message: 'Message (optional)', messagePh: 'Delivery address, occasion, questions…',
      submit: 'Send my request', sending: 'Sending…',
      ok: 'Thanks! Your request is in. We will text you shortly to confirm.',
      err: 'Sorry, the request could not be sent. Text us directly or on WhatsApp.',
      orText: 'Or message us directly',
    },
    faq: {
      title: 'FAQ',
      items: [
        ['How old do I need to be to rent an Audi RS?', 'You must be 25 or older, with a valid driver’s licence, proof of insurance and a credit card in your name for the refundable security deposit.'],
        ['Do I pay online?', 'No. You send a request, and our team confirms availability and details with you by text before anything is booked.'],
        ['Do you deliver the car?', 'Yes, on request across Montreal, Laval, the South Shore, to your hotel or Montréal-Trudeau airport (YUL). Fees are confirmed with your booking. You can also pick it up in Montreal.'],
        ['Are the RS cars ready for winter?', 'Yes. Every RS has quattro all-wheel drive and runs winter tires through the cold season, as Quebec law requires.'],
        ['Can I rent a Lamborghini from you?', 'Yes, the Huracán and Urus from our sister fleet Exotic Rentals Montreal are available with the same service.'],
      ],
    },
    footer: { tagline: 'Audi RS rental in Montreal.', sister: 'A sister fleet of', rights: 'All rights reserved.', disclaimer: 'Audi, RS and model names are trademarks of their respective owners. RentMyRS is an independent rental service, not affiliated with Audi AG.' },
    model: {
      back: 'All RS models', specs: 'Specifications', power: 'Power (stock)', engine: 'Engine', accel: '0-100 km/h', seats: 'Seats', drive: 'Drivetrain',
      bookThis: 'Book this RS', others: 'Other RS models',
      metaTitle: (n: string) => `${n} Rental Montreal | RentMyRS`,
      metaDesc: (n: string, hp: number) => `Rent an ${n} (${hp} hp) in Montreal. Delivery across Montreal, Laval and the South Shore. Quick booking request, confirmed by text.`,
    },
  },
} as const;

export type Dict = (typeof DICT)[Locale];
export const t = (l: Locale) => DICT[l] as Dict;
