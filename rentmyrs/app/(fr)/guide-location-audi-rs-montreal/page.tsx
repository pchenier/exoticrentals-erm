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

// Toujours lu à la demande : les photos et prix de /admin ne doivent jamais être remplacés par les valeurs du code lors d'une mise à jour.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <GuideView locale="fr" />;
}
