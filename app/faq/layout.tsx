import type { Metadata } from 'next';
import { faqs } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Exotic Rentals Montreal',
  description: 'Answers to common questions about renting an exotic car in Montreal: requirements, insurance, deposits, delivery, and cancellation.',
  alternates: { canonical: 'https://www.exoticrentalsmontreal.com/faq' },
};

// FAQPage pour Google et les moteurs IA. faq-7 (kilométrage) exclu tant que la politique n'est pas confirmée.
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs
    .filter((f) => f.id !== 'faq-7')
    .map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} />
      {children}
    </>
  );
}
