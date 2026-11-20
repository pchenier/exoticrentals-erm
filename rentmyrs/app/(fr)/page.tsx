import HomeView from '@/components/HomeView';
import { pageMeta } from '@/lib/meta';
import { t } from '@/lib/dict';

export const metadata = pageMeta({ locale: 'fr', ...t('fr').meta, path: { fr: '/', en: '/en' } });

export const revalidate = 300;

export default function Page() {
  return <HomeView locale="fr" />;
}
