import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { slugify } from '@/lib/slugify'

export const metadata: Metadata = {
  title: 'Mercedes Rental Montreal — G63 AMG, E63S, S63 | Exotic Rentals Montreal',
  description:
    'Rent a Mercedes in Montreal. G63 AMG, E63S AMG, S63 AMG available from $399/day. Concierge delivery across Montreal, Laval, South Shore. Book 24/7 on WhatsApp.',
  keywords: 'mercedes rental montreal, mercedes g63 rental montreal, mercedes amg rental montreal, location mercedes montreal',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/mercedes-rental-montreal',
  },
  openGraph: {
    title: 'Mercedes Rental Montreal — G63 AMG, E63S, S63 | Exotic Rentals Montreal',
    description:
      'Rent a Mercedes in Montreal. G63 AMG, E63S AMG, S63 AMG available from $399/day. Concierge delivery across Montreal, Laval, South Shore. Book 24/7 on WhatsApp.',
    url: 'https://www.exoticrentalsmontreal.com/mercedes-rental-montreal',
    siteName: 'Exotic Rentals Montreal',
    type: 'website',
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Mercedes Rental Montreal',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Exotic Rentals Montreal',
    url: 'https://www.exoticrentalsmontreal.com',
    telephone: '+14385339053',
  },
  areaServed: 'Montreal, QC, Canada',
  description: 'Premium Mercedes rental service in Montreal with concierge delivery. G63 AMG, E63S AMG, S63 AMG available.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '399',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.exoticrentalsmontreal.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Mercedes Rental Montreal',
      item: 'https://www.exoticrentalsmontreal.com/mercedes-rental-montreal',
    },
  ],
}

interface CarItem {
  name: string
  rate?: number
  pricePerDay?: number
  price?: number
  slug?: string
}

async function getFleet(): Promise<CarItem[]> {
  try {
    const res = await fetch('https://www.exoticrentalsmontreal.com/api/fleet', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const all: CarItem[] = await res.json()
    return all.filter((car) => car.name.toLowerCase().includes('mercedes'))
  } catch {
    return []
  }
}

export default async function MercedesRentalMontreal() {
  const fleet = await getFleet()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />

        <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-600">/</li>
              <li className="text-white" aria-current="page">
                Mercedes Rental Montreal
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1
              className="text-5xl md:text-7xl mb-6 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Mercedes Rental Montreal
            </h1>
            <p
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Command the streets of Montreal in a Mercedes-Benz AMG — from the iconic G63 to the powerhouse E63S
              and ultra-luxury S63. Our Mercedes fleet delivers the perfect blend of prestige and performance,
              available from $399/day with concierge delivery anywhere in Montreal, Laval, and the South Shore.
            </p>
          </section>

          {/* Fleet Section */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our Mercedes Fleet
            </h2>

            {fleet.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fleet.map((car: CarItem) => {
                  const carSlug = car.slug ?? slugify(car.name)
                  const rate = car.rate ?? car.pricePerDay ?? car.price

                  return (
                    <Link
                      key={carSlug}
                      href={`/cars/${carSlug}`}
                      className="group block bg-[#111111] border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-all duration-300"
                    >
                      <h3
                        className="text-xl mb-2 uppercase tracking-wide group-hover:text-gray-200 transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {car.name}
                      </h3>
                      {rate && (
                        <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                          From ${rate}/day
                        </p>
                      )}
                      <span className="mt-4 inline-block text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                        View Details →
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Browse our full Mercedes fleet — contact us for availability.
              </p>
            )}
          </section>

          {/* Why Rent a Mercedes */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why Rent a Mercedes in Montreal
            </h2>
            <ul className="max-w-2xl mx-auto space-y-5">
              {[
                'G63 AMG, E63S and S63 available — the full AMG experience',
                'Concierge delivery anywhere in Montreal, Laval, and the South Shore',
                'Available 24/7, 365 days a year — book any time, day or night',
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-4 text-gray-300"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-white" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Book CTA */}
          <section className="text-center">
            <h2
              className="text-4xl md:text-5xl mb-8 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book Your Mercedes Rental
            </h2>
            <p
              className="text-gray-400 mb-8 text-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Ready to experience Montreal in a world-class Mercedes? Reach us instantly on WhatsApp.
            </p>
            <a
              href="https://wa.me/14385339053"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors duration-300"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L.057 23.885a.5.5 0 0 0 .606.663l6.187-1.623A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 0 1-5.073-1.389l-.362-.214-3.747.983.999-3.648-.235-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Book on WhatsApp
            </a>
          </section>
        </main>

        <Footer />
        <FloatingWA />
      </div>
    </>
  )
}
