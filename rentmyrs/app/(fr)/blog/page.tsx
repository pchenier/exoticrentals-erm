import { BlogIndex } from '@/components/BlogViews';
import { pageMeta } from '@/lib/meta';
import { BLOG } from '@/lib/blog';

export const metadata = pageMeta({
  locale: 'fr',
  title: 'Blog : location d’Audi RS à Montréal, conseils et comparatifs | RentMyRS',
  description: 'Conseils, comparatifs et itinéraires pour louer une Audi RS3, RS5, RS7, RSQ8 ou R8 à Montréal, Laval et sur la Rive-Nord.',
  path: BLOG,
});

export default function Page() {
  return <BlogIndex locale="fr" />;
}
