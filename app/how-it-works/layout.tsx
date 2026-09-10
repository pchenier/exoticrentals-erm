import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Exotic Rentals Montreal',
  description: 'Renting a supercar in Montreal in four steps: choose, book, verify, drive. Transparent pricing and 24/7 concierge support.',
  alternates: { canonical: 'https://www.exoticrentalsmontreal.com/how-it-works' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
