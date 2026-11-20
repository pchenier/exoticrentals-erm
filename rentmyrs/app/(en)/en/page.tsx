import HomeView from '@/components/HomeView';
import { pageMeta } from '@/lib/meta';
import { t } from '@/lib/dict';

export const metadata = pageMeta({ locale: 'en', ...t('en').meta, path: { fr: '/', en: '/en' } });

// Toujours lu à la demande : les photos et prix de /admin ne doivent jamais être remplacés par les valeurs du code lors d'une mise à jour.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <HomeView locale="en" />;
}
