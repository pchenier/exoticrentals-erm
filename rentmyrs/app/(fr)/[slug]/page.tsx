import { notFound } from 'next/navigation';
import ModelView from '@/components/ModelView';
import { RS_MODELS, findModel } from '@/lib/fleet';
import { getFleet } from '@/lib/fleet-store';
import { pageMeta } from '@/lib/meta';
import { t } from '@/lib/dict';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 300;
export function generateStaticParams() {
  return RS_MODELS.map((m) => ({ slug: m.slug.fr }));
}

export async function generateMetadata({ params }: Props) {
  const m = findModel('fr', (await params).slug);
  if (!m) return {};
  const d = t('fr').model;
  return pageMeta({
    locale: 'fr',
    title: d.metaTitle(m.name, m.dailyRate),
    description: d.metaDesc(m.name, m.specs.hp, m.dailyRate, m.deposit),
    path: { fr: `/${m.slug.fr}`, en: `/en/${m.slug.en}` },
    image: m.images[0],
  });
}

export default async function Page({ params }: Props) {
  const base = findModel('fr', (await params).slug);
  if (!base) notFound();
  const models = await getFleet();
  const m = models.find((x) => x.id === base.id) ?? base;
  return <ModelView locale="fr" model={m} models={models} />;
}
