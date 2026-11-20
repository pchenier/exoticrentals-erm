export const SITE = {
  name: 'RentMyRS',
  url: 'https://www.rentmyrs.com',
  // Même ligne que Exotic Rentals Montreal (à confirmer).
  phone: '+14388094417',
  phoneDisplay: '438 809-4417',
  city: 'Montréal',
  sister: {
    name: 'Exotic Rentals Montreal',
    url: 'https://www.exoticrentalsmontreal.com',
    lamborghiniFr: 'https://www.exoticrentalsmontreal.com/lamborghini-rental-montreal',
    lamborghiniEn: 'https://www.exoticrentalsmontreal.com/lamborghini-rental-montreal',
  },
} as const;

export type Locale = 'fr' | 'en';

export const waUrl = (text?: string) =>
  `https://wa.me/${SITE.phone.replace('+', '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
