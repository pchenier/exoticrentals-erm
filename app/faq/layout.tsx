import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Exotic Rentals Montreal',
  description: 'Answers to common questions about renting an exotic car in Montreal: requirements, insurance, deposits, delivery, and cancellation.',
  alternates: { canonical: 'https://www.exoticrentalsmontreal.com/faq' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
