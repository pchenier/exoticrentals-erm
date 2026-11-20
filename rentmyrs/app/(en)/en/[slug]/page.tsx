import { notFound } from 'next/navigation';
import ModelView from '@/components/ModelView';
import { findModel } from '@/lib/fleet';
import { getFleet } from '@/lib/fleet-store';
import { pageMeta } from '@/lib/meta';
import { t } from '@/lib/dict';

type Props = { params: Promise<{ slug: string }> };

// Toujours lu à la demande : les photos et prix de /admin ne doivent jamais être remplacés par les valeurs du code lors d'une mise à jour.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const m = findModel('en', (await params).slug);
  if (!m) return {};
  const d = t('en').model;
  return pageMeta({
    locale: 'en',
    title: d.metaTitle(m.name, m.dailyRate),
    description: d.metaDesc(m.name, m.specs.hp, m.dailyRate, m.deposit),
    path: { fr: `/${m.slug.fr}`, en: `/en/${m.slug.en}` },
    image: m.images[0],
  });
}

export default async function Page({ params }: Props) {
  const base = findModel('en', (await params).slug);
  if (!base) notFound();
  const models = await getFleet();
  const m = models.find((x) => x.id === base.id) ?? base;
  return <ModelView locale="en" model={m} models={models} />;
}
