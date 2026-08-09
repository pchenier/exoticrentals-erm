import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/lib/blog-posts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog — Guides & Actualités | Exotic Rentals Montreal',
  description: 'Guides de conduite, actualités automobiles et conseils pour louer une voiture exotique à Montréal.',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/blog',
  },
};

export default function BlogPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">THE BLOG</div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-warm-white mb-4">Montreal Exotic Car Rental Insights</h1>
            <p className="text-silver max-w-2xl mx-auto">Guides, comparisons, and tips for renting exotic and luxury cars in Montreal and Quebec.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-graphite border border-graphite hover:border-silver/20 transition-all overflow-hidden rounded-lg flex flex-col"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="text-xs font-display tracking-widest text-champagne mb-2 uppercase">
                    {new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <h2 className="font-display font-bold text-lg text-warm-white mb-2 group-hover:text-champagne transition-colors">{post.title}</h2>
                  <p className="text-silver text-sm leading-relaxed line-clamp-3">{post.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}