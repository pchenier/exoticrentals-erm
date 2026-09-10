import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Deals & Long-Term Discounts | Exotic Rentals Montreal',
  description: 'Save on multi-day and weekly exotic car rentals in Montreal. 7+ day and 14+ day discount tiers explained.',
  alternates: { canonical: 'https://www.exoticrentalsmontreal.com/promo' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
