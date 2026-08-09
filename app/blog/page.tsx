import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog — Guides & Actualités | Exotic Rentals Montreal',
  description: 'Guides de conduite, actualités automobiles et conseils pour louer une voiture exotique à Montréal.',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/blog',
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top nav */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4 font-light">
            Exotic Rentals Montreal
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light tracking-wide text-white mb-6">
            Blog
          </h1>
          <p className="text-white/40 text-sm max-w-lg mx-auto font-light leading-relaxed tracking-wide">
            Guides de conduite, actualités automobiles et conseils pour vivre l&apos;expérience supercar à Montréal.
          </p>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mt-8" />
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-[#111] border border-white/5 hover:border-[#c9a96e]/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#c9a96e]/10 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase mb-3 font-light">
                        {new Date(post.date).toLocaleDateString('fr-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <h2 className="font-display text-2xl md:text-3xl font-light tracking-wide text-white group-hover:text-[#c9a96e] transition-colors duration-300 mb-4">
                        {post.title}
                      </h2>
                      <p className="text-white/40 text-sm font-light leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
