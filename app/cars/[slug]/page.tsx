import { Metadata } from 'next';
import Link from 'next/link';
import CarGallery from '@/components/CarGallery';
import DurationPicker from '@/components/DurationPicker';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/slugify';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface DBCar {
  id: number;
  name: string;
  nickname: string | null;
  rate: number;
  original_rate: number | null;
  description: string | null;
  specs: string | null;
  engine: string | null;
  hp: string | null;
  sprint: string | null;
  image: string | null;
  gallery: string[];
  coming_soon: boolean;
  deposit: number | null;
  image_position: string | null;
  rate_3d: number | null;
  rate_7d: number | null;
  rate_14d: number | null;
  rate_30d: number | null;
}

async function getCarBySlug(slug: string): Promise<DBCar | null> {
  const res = await fetch('https://www.exoticrentalsmontreal.com/api/fleet', {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const cars: DBCar[] = await res.json();
  return cars.find((c) => slugify(c.name) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: 'Car Not Found' };

  return {
    title: `${car.name} Rental Montreal — $${car.rate}/day | Exotic Rentals Montreal`,
    description: (() => {
      const base = `Rent the ${car.name} in Montreal. From $${car.rate}/day. ${car.description ?? ''} Delivery in Greater Montreal.`;
      if (base.length <= 155) return base;
      const truncated = base.slice(0, 155);
      return truncated.slice(0, truncated.lastIndexOf(' '));
    })(),
    alternates: {
      canonical: `https://www.exoticrentalsmontreal.com/cars/${slug}`,
    },
    openGraph: {
      title: `${car.name} Rental Montreal — $${car.rate}/day`,
      description: `Rent the ${car.name} in Montreal from $${car.rate}/day.`,
      url: `https://www.exoticrentalsmontreal.com/cars/${slug}`,
      images: car.gallery?.[0]
        ? [{ url: car.gallery[0], width: 1200, height: 630 }]
        : [],
    },
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) notFound();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.exoticrentalsmontreal.com' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Fleet', 'item': 'https://www.exoticrentalsmontreal.com/#fleet' },
      { '@type': 'ListItem', 'position': 3, 'name': `${car.name} Rental Montreal`, 'item': `https://www.exoticrentalsmontreal.com/cars/${slug}` },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.name} Rental Montreal`,
    description: car.description,
    image: car.gallery?.[0]
      ? `https://www.exoticrentalsmontreal.com${car.gallery[0]}`
      : undefined,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Exotic Rentals Montreal Client',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD',
      price: car.rate,
      availability: 'https://schema.org/InStock',
      url: `https://www.exoticrentalsmontreal.com/cars/${slug}`,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'CAD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CA',
          addressRegion: 'QC',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
    },
    brand: {
      '@type': 'Brand',
      name: car.name.split(' ')[0],
    },
  };

  const gallery = Array.isArray(car.gallery) ? car.gallery : [];
  const mainImage = gallery[0] ?? car.image;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Top nav */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/#fleet"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Gallery */}
        <CarGallery gallery={gallery} carName={car.name} mainImage={mainImage} imagePosition={car.image_position ?? null} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-3 font-light">
              Exotic Rentals Montreal
            </p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light tracking-wide text-white mb-6">
              {car.name}
            </h1>

            {/* Specs grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1a1a1a] border border-white/5 p-4 text-center">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">Engine</p>
                <p className="text-white text-sm font-light">{car.engine}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 p-4 text-center">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">Horsepower</p>
                <p className="text-[#c9a96e] font-display text-lg font-light">{car.hp}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 p-4 text-center">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">0–100 km/h</p>
                <p className="text-white font-display text-lg font-light">{car.sprint}</p>
              </div>
            </div>

            <p className="text-white/50 text-sm font-light leading-relaxed mb-8">
              {car.description}
            </p>

            <h2 className="font-display text-2xl font-light text-white/80 mt-2 mb-4 tracking-wide">
              Rent the {car.name} in Montreal
            </h2>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-8">
              Experience the {car.name} on Montreal streets from ${car.rate.toLocaleString()} per day.
              Available for weekend escapes, corporate events, photoshoots, or just the thrill of driving
              something extraordinary. We deliver directly to your hotel, home, or event venue anywhere
              in Greater Montreal, Laval, and the South Shore. Available 24/7. Contact us on WhatsApp
              to check availability and lock in your dates.
            </p>

            <p className="text-sm text-white/30 font-light leading-relaxed border-l-2 border-[#c9a96e]/30 pl-4 italic">
              Louez la {car.name} à Montréal — à partir de ${car.rate.toLocaleString()}/jour.
              Livraison disponible partout dans le Grand Montréal.
            </p>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/10 p-8 sticky top-24">
              <DurationPicker car={{
                rate: car.rate,
                original_rate: car.original_rate,
                rate_3d: car.rate_3d,
                rate_7d: car.rate_7d,
                rate_14d: car.rate_14d,
                rate_30d: car.rate_30d,
              }} />

              {car.deposit && car.deposit > 0 && (
                <div className="mt-4">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-1 font-light">Refundable Deposit</p>
                  <p className="text-[#c9a96e] text-sm font-light tracking-wide">${car.deposit.toLocaleString()}</p>
                </div>
              )}

              <div className="h-px bg-white/5 my-6" />

              <Link
                href={`/?car=${encodeURIComponent(car.name)}#booking`}
                className="block w-full bg-[#c9a96e] text-black text-xs tracking-[0.3em] uppercase font-medium py-4 text-center hover:bg-[#e2c898] transition-colors duration-300 mb-4"
              >
                Book This Car
              </Link>

              <a
                href="https://wa.me/+14385339053"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border border-white/10 text-white/50 text-xs tracking-[0.2em] uppercase font-light py-4 text-center hover:border-[#c9a96e]/40 hover:text-white transition-all duration-300"
              >
                WhatsApp Us
              </a>

              <div className="mt-6 space-y-2 text-[10px] text-white/25 tracking-wide">
                <p>✓ Delivery anywhere in Greater Montreal</p>
                <p>✓ Available 24/7</p>
                <p>✓ Fully detailed before every rental</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="border-t border-white/5 mt-24 py-8 text-center">
        <Link
          href="/#fleet"
          className="text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors duration-200"
        >
          ← View Full Fleet
        </Link>
      </div>
    </div>
  );
}
