import GuideView from '@/components/GuideView';
import { pageMeta } from '@/lib/meta';
import { GUIDE } from '@/lib/seo';

export const metadata = pageMeta({
  locale: 'fr',
  title: 'Quelle Audi RS louer à Montréal ? Prix, comparatif RS3, RS5, RS7, RSQ8 | RentMyRS',
  description:
    'Comparatif des Audi RS à louer à Montréal : prix par jour (dès 400 $), dépôt, puissance, 0-100 et conseils selon l’occasion. Conditions : 25 ans et plus, livraison Montréal, Laval, Rive-Sud et YUL.',
  path: GUIDE,
});

export const revalidate = 300;

export default function Page() {
  return <GuideView locale="fr" />;
}
