import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-posts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DELETED_SLUGS = new Set([
  'luxury-suv-rental-montreal-lamborghini-urus',
  'audi-rs5-rental-montreal-affordable',
  'exotic-car-rental-montreal-film-production',
  'rent-exotic-car-mont-tremblant',
  'best-exotic-cars-to-rent-montreal-2025',
  'luxury-car-rental-montreal-summer',
  'exotic-car-rental-montreal-corporate-events',
  'exotic-car-rental-bachelor-party-montreal',
  'bmw-x6m-competition-rental-montreal-aggressive-suv-performance',
  'bmw-x6m-competition-montreal-price-specs',
  'bmw-x6m-competition-prix-specs-montreal',
  'bmw-x6m-competition-montreal-night',
  'bmw-x6m-nuit-montreal',
]);

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (DELETED_SLUGS.has(slug)) return { title: 'Post Not Found' };

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Exotic Rentals Montreal Blog`,
    description: post.description,
    alternates: {
      canonical: `https://www.exoticrentalsmontreal.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.exoticrentalsmontreal.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [
        {
          url: post.image || 'https://www.exoticrentalsmontreal.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (DELETED_SLUGS.has(slug)) notFound();

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.image
      ? `https://www.exoticrentalsmontreal.com${post.image}`
      : 'https://www.exoticrentalsmontreal.com/og-image.jpg',
    author: { '@type': 'Organization', name: 'Exotic Rentals Montreal' },
    publisher: {
      '@type': 'Organization',
      name: 'Exotic Rentals Montreal',
      url: 'https://www.exoticrentalsmontreal.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.exoticrentalsmontreal.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-warm-white text-sm font-medium tracking-[0.1em] uppercase mb-6 border border-silver/20 hover:border-champagne hover:text-champagne transition-all px-5 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>

          {post.image && (
            <div className="relative h-64 md:h-80 mb-8 overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-warm-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-silver mb-8">
            <span>{new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div
            className="text-silver leading-relaxed space-y-4 [&_h2]:text-warm-white [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-warm-white [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-warm-white [&_a]:text-champagne [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_p]:mb-4"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>')
                .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'),
            }}
          />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}