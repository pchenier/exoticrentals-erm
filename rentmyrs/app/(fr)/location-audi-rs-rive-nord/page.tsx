import NorthShoreView from '@/components/NorthShoreView';
import { pageMeta } from '@/lib/meta';
import { NORTH } from '@/lib/seo';

export const metadata = pageMeta({
  locale: 'fr',
  title: 'Location Audi RS Rive-Nord | Laval, Terrebonne, Blainville, Mirabel | RentMyRS',
  description:
    'Location d’Audi RS3, RS5, RS7, RSQ8 et R8 livrée sur la Rive-Nord : Laval, Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme. Dès 400 $/jour, confirmation par texto.',
  path: NORTH,
});

export const revalidate = 300;

export default function Page() {
  return <NorthShoreView locale="fr" />;
}
