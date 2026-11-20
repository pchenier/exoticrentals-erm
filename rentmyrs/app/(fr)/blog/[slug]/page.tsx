import { notFound } from 'next/navigation';
import { BlogArticle } from '@/components/BlogViews';
import { pageMeta } from '@/lib/meta';
import { findPost, postPaths, postsFor } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return postsFor('fr').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = findPost('fr', (await params).slug);
  if (!p) return {};
  return pageMeta({ locale: 'fr', title: `${p.title} | RentMyRS`, description: p.description, path: postPaths(p), image: p.image });
}

export default async function Page({ params }: Props) {
  const p = findPost('fr', (await params).slug);
  if (!p) notFound();
  return <BlogArticle post={p} />;
}
