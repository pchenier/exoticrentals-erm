import NorthShoreView from '@/components/NorthShoreView';
import { pageMeta } from '@/lib/meta';
import { NORTH } from '@/lib/seo';

export const metadata = pageMeta({
  locale: 'en',
  title: 'Audi RS Rental North Shore Montreal | Laval, Terrebonne, Blainville | RentMyRS',
  description:
    'Audi RS3, RS5, RS7, RSQ8 and R8 rental delivered to Montreal’s North Shore: Laval, Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme. From $400/day, confirmed by text.',
  path: NORTH,
});

export const revalidate = 300;

export default function Page() {
  return <NorthShoreView locale="en" />;
}
