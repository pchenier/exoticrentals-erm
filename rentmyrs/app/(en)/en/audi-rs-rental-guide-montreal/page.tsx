import GuideView from '@/components/GuideView';
import { pageMeta } from '@/lib/meta';
import { GUIDE } from '@/lib/seo';

export const metadata = pageMeta({
  locale: 'en',
  title: 'Which Audi RS to Rent in Montreal? Prices & RS3, RS5, RS7, RSQ8 Comparison | RentMyRS',
  description:
    'Compare the Audi RS models for rent in Montreal: daily price (from $400), deposit, power, 0-100 and which one fits your occasion. Requirements: 25+, delivery across Montreal, Laval, the South Shore and YUL.',
  path: GUIDE,
});

export const revalidate = 300;

export default function Page() {
  return <GuideView locale="en" />;
}
