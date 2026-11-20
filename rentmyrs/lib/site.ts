export const SITE = {
  name: 'RentMyRS',
  url: 'https://www.rentmyrs.com',
  phone: '+15147738079',
  phoneDisplay: '514 773-8079',
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
