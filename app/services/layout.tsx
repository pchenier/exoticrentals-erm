import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services: Pickup & Delivery | Exotic Rentals Montreal',
  description: 'Montreal pickup location and white-glove delivery service for exotic car rentals across Greater Montreal.',
  alternates: { canonical: 'https://www.exoticrentalsmontreal.com/services' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
