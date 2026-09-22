import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { slugify } from '@/lib/slugify'
import { getAllVehiclesLive } from '@/lib/vehicle-store'

export const metadata: Metadata = {
  title: 'Luxury Car Rental Montreal — Premium Fleet | Exotic Rentals Montreal',
  description:
    'Luxury car rental in Montreal starting from $350/day. Lamborghini, McLaren, Mercedes G63, Audi RS7. Concierge delivery across Montreal, Laval, South Shore. Available 24/7.',
  keywords: 'luxury car rental montreal, location voiture luxe montreal, luxury vehicle rental montreal',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/luxury-car-rental-montreal',
  },
  openGraph: {
    title: 'Luxury Car Rental Montreal — Premium Fleet | Exotic Rentals Montreal',
    description:
      'Luxury car rental in Montreal starting from $350/day. Lamborghini, McLaren, Mercedes G63, Audi RS7. Concierge delivery across Montreal, Laval, South Shore. Available 24/7.',
    url: 'https://www.exoticrentalsmontreal.com/luxury-car-rental-montreal',
    siteName: 'Exotic Rentals Montreal',
    type: 'website',
    images: [
      {
        url: 'https://www.exoticrentalsmontreal.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Exotic Rentals Montreal',
      },
    ],
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Luxury Car Rental Montreal',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Exotic Rentals Montreal',
    url: 'https://www.exoticrentalsmontreal.com',
    telephone: '+14388094417',
  },
  areaServed: 'Montreal, QC, Canada',
  description: 'Premium luxury car rental service in Montreal with concierge delivery.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '350',
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
      name: 'Luxury Car Rental Montreal',
      item: 'https://www.exoticrentalsmontreal.com/luxury-car-rental-montreal',
    },
  ],
}

interface CarItem {
  name?: string
  slug: string
  make: string
  model: string
  dailyRate: number
  images: { url: string; alt: string; isMain: boolean }[]
  available: boolean
}

async function getFleet(): Promise<CarItem[]> {
  try {
    return await getAllVehiclesLive()
  } catch {
    return []
  }
}

export default async function LuxuryCarRentalMontreal() {
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
                Luxury Car Rental Montreal
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1
              className="text-5xl md:text-7xl mb-6 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Luxury Car Rental Montreal
            </h1>
            <p
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Experience Montreal in style with our premium luxury car rental service, featuring
              Lamborghini, McLaren, Mercedes and more starting from $350/day. We offer concierge
              delivery anywhere in Montreal, Laval, and the South Shore — so your exotic car arrives
              at your door. Available 24/7, 365 days a year for reservations and support.
            </p>
          </section>

          {/* Fleet Section */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our Luxury Fleet
            </h2>

            {fleet.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fleet.map((car: CarItem) => {
                  const main = car.images?.find((i) => i.isMain) ?? car.images?.[0]
                  const href = `/fleet/${car.slug}`

                  return (
                    <Link
                      key={car.slug}
                      href={href}
                      className="group block relative overflow-hidden rounded-xl border border-white/10 bg-[#111] hover:border-white/30 transition-all duration-200"
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-[#0a0a0a]">
                        {main ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={main.url}
                            alt={main.alt || `${car.make} ${car.model}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl opacity-10" style={{ fontFamily: 'var(--font-display)' }}>
                            {car.make}
                          </div>
                        )}
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)' }}
                        />
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3
                            className="text-lg font-medium text-white drop-shadow-lg"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {car.name ?? `${car.make} ${car.model}`}
                          </h3>
                          <div className="flex items-baseline justify-between">
                            <span className="text-[#c9a96e] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                              From ${car.dailyRate}/day
                            </span>
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                              View Details →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Browse our full fleet — contact us for availability.
              </p>
            )}
          </section>

          {/* Why Choose Us */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why Choose Exotic Rentals Montreal
            </h2>
            <ul className="max-w-2xl mx-auto space-y-5">
              {[
                'Concierge delivery anywhere in Montreal, Laval, and the South Shore',
                'Available 24/7, 365 days a year — book any time, day or night',
                'Premium fleet with the latest models and immaculate condition guaranteed',
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
              Book Your Luxury Car
            </h2>
            <p
              className="text-gray-400 mb-8 text-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Ready to experience Montreal in a world-class vehicle? Reach us instantly on WhatsApp.
            </p>
            <a
              href="https://wa.me/14388094417"
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
