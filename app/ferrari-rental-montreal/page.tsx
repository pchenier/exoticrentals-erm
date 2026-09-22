import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { slugify } from '@/lib/slugify'
import { getAllVehiclesLive } from '@/lib/vehicle-store'

export const metadata: Metadata = {
  title: 'Ferrari Rental Montreal | Exotic Rentals Montreal',
  description:
    'Looking for a Ferrari rental in Montreal? Our current exotic lineup: Lamborghini Huracán, McLaren 600LT Spider, Urus. Same-tier supercars, concierge delivery across Greater Montreal.',
  keywords: 'ferrari rental montreal, exotic car rental montreal, lamborghini rental montreal, mclaren rental montreal',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/ferrari-rental-montreal',
  },
  openGraph: {
    title: 'Ferrari Rental Montreal | Exotic Rentals Montreal',
    description:
      'Looking for a Ferrari rental in Montreal? Our current exotic lineup: Lamborghini Huracán, McLaren 600LT Spider, Urus. Same-tier supercars, concierge delivery across Greater Montreal.',
    url: 'https://www.exoticrentalsmontreal.com/ferrari-rental-montreal',
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
  name: 'Ferrari Rental Montreal',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Exotic Rentals Montreal',
    url: 'https://www.exoticrentalsmontreal.com',
    telephone: '+14388094417',
  },
  areaServed: 'Montreal, QC, Canada',
  description: 'Exotic car rental in Montreal — Lamborghini Huracán, McLaren 600LT Spider and more, with concierge delivery anywhere in Greater Montreal.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '1499',
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
      name: 'Ferrari Rental Montreal',
      item: 'https://www.exoticrentalsmontreal.com/ferrari-rental-montreal',
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
    const all: CarItem[] = await getAllVehiclesLive()
    return all.filter((v) => ['lamborghini', 'mclaren'].includes(v.make.toLowerCase()))
  } catch {
    return []
  }
}

export default async function FerrariRentalMontreal() {
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
                Ferrari Rental Montreal
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1
              className="text-5xl md:text-7xl mb-6 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ferrari Rental Montreal
            </h1>
            <p
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Ferrari-level excitement, available today. While there is no Ferrari in our
              current lineup, our Huracán Tecnica and McLaren 600LT Spider deliver the same
              naturally-aspirated V10 drama and supercar theatre — from $1,199 per day with
              concierge delivery anywhere in Greater Montreal.
            </p>
          </section>

          {/* Fleet Section */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Supercars Available Now
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
                Browse our full exotic fleet — contact us for availability.
              </p>
            )}
          </section>

          {/* Why Rent a Ferrari */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why Rent a Supercar in Montreal
            </h2>
            <ul className="max-w-2xl mx-auto space-y-5">
              {[
                'Lamborghini Huracán Tecnica. 631hp naturally-aspirated V10. The sharpest tool in the city.',
                'Concierge delivery anywhere in Greater Montreal. Available 24/7.',
                'McLaren 600LT Spider. 592hp twin-turbo V8, carbon everything, roof down.',
                'Book on WhatsApp. We confirm same day.',
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

          {/* How It Works */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: '01', title: 'Select Your Supercar', desc: 'Huracán Tecnica, Huracán EVO Spyder or McLaren 600LT Spider.' },
                { step: '02', title: 'Book on WhatsApp', desc: 'Message us your date and address. Confirmed within the hour.' },
                { step: '03', title: 'We Deliver to You', desc: 'Your supercar arrives freshly detailed at your location.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div
                    className="text-5xl text-[#c9a96e] mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.step}
                  </div>
                  <h3
                    className="text-xl mb-2 uppercase tracking-wide"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Book CTA */}
          <section className="text-center">
            <h2
              className="text-4xl md:text-5xl mb-8 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book Your Supercar
            </h2>
            <p
              className="text-gray-400 mb-8 text-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Ready to experience Montreal in a Ferrari? Reach us instantly on WhatsApp.
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
