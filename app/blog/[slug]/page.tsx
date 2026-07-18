import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-posts';

const DELETED_SLUGS = new Set([
  'luxury-suv-rental-montreal-lamborghini-urus',
  'audi-rs5-rental-montreal-affordable',
  'exotic-car-rental-montreal-film-production',
  'rent-exotic-car-mont-tremblant',
  'best-exotic-cars-to-rent-montreal-2025',
  'luxury-car-rental-montreal-summer',
  'exotic-car-rental-montreal-corporate-events',
  'exotic-car-rental-bachelor-party-montreal',
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
    title: `${post.title} | Exotic Rentals Montreal`,
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

function getCarCTA(slug: string): { label: string; href: string } | null {
  const s = slug.toLowerCase();
  if (s.includes('lamborghini')) {
    return { label: 'View the Lamborghini Urus →', href: '/cars/lamborghini-urus-black-on-black' };
  }
  if (s.includes('mclaren')) {
    return { label: 'View the McLaren 600LT →', href: '/cars/mclaren-600lt' };
  }
  if (s.includes('bmw')) {
    return { label: 'View the BMW M5 Competition →', href: '/cars/bmw-m5-competition' };
  }
  if (s.includes('audi')) {
    return { label: 'View the Audi RS7 →', href: '/cars/audi-rs7' };
  }
  if (s.includes('mercedes') || s.includes('amg')) {
    return { label: 'View the Mercedes-AMG G63 →', href: '/cars/mercedes-g63-amg' };
  }
  if (s.includes('ferrari')) {
    return { label: 'View the Ferrari 488 GTB →', href: '/cars/ferrari-488-gtb' };
  }
  if (s.includes('porsche')) {
    return { label: 'View the Porsche 911 Techart →', href: '/cars/porsche-911-4s-techart' };
  }
  return null;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (DELETED_SLUGS.has(slug)) notFound();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  const carCTA = getCarCTA(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Exotic Rentals Montreal',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Exotic Rentals Montreal',
      url: 'https://www.exoticrentalsmontreal.com',
    },
    url: `https://www.exoticrentalsmontreal.com/blog/${slug}`,
    image: post.image || 'https://www.exoticrentalsmontreal.com/og-image.jpg',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top nav */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero image */}
      {post.image && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-16">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4 font-light">
            {new Date(post.date).toLocaleDateString('fr-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-light tracking-wide text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-white/40 text-base font-light leading-relaxed border-l-2 border-[#c9a96e]/40 pl-4">
            {post.description}
          </p>
          <div className="w-16 h-px bg-[#c9a96e] mt-8" />
        </header>

        {/* Content */}
        <div
          className="prose prose-invert max-w-none blog-content text-white/55 text-sm font-light leading-relaxed
            [&_h2]:font-display [&_h2]:text-xl [&_h2]:tracking-wide [&_h2]:text-[#c9a96e] [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:font-display [&_h3]:text-lg [&_h3]:tracking-wide [&_h3]:text-[#c9a96e] [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-white/55 [&_p]:text-sm [&_p]:font-light [&_p]:leading-relaxed [&_p]:mb-6
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-white/55
            [&_li]:text-white/55 [&_li]:text-sm [&_li]:font-light [&_li]:leading-relaxed [&_li]:mb-1
            [&_strong]:text-[#c9a96e] [&_strong]:font-medium
            [&_a]:text-[#c9a96e] [&_a]:underline [&_a]:hover:text-[#e2c898]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Internal Fleet CTA */}
        <div className="mt-12 mb-8 p-6 bg-[#0f0f0f] border border-white/8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3 font-light">
            Explore Our Fleet
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {carCTA && (
              <Link
                href={carCTA.href}
                className="inline-flex items-center gap-2 border border-[#c9a96e]/60 text-[#c9a96e] text-xs tracking-[0.2em] uppercase font-medium px-6 py-3 hover:bg-[#c9a96e]/10 transition-colors duration-300"
              >
                {carCTA.label}
              </Link>
            )}
            <Link
              href="/car-rental-montreal"
              className="inline-flex items-center gap-2 border border-white/15 text-white/50 text-xs tracking-[0.2em] uppercase font-medium px-6 py-3 hover:border-white/30 hover:text-white/80 transition-colors duration-300"
            >
              Browse Full Fleet →
            </Link>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 p-8 bg-[#111] border border-[#c9a96e]/20 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3 font-light">
            Prêt à réserver ?
          </p>
          <p className="text-white/50 text-sm font-light mb-6">
            Contactez-nous sur WhatsApp pour vérifier la disponibilité et réserver votre véhicule.
          </p>
          <a
            href="https://wa.me/+14385339053"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a96e] text-black text-xs tracking-[0.3em] uppercase font-medium px-8 py-4 hover:bg-[#e2c898] transition-colors duration-300"
          >
            WhatsApp Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}
