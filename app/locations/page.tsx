import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { LOCATIONS } from '@/lib/locations'

export const metadata: Metadata = {
  title: 'Exotic Car Rental Locations — Montreal and Quebec | Exotic Rentals Montreal',
  description:
    'Exotic car rental delivery across Montreal neighbourhoods and Quebec cities. Ferrari, Lamborghini, BMW and more. Book on WhatsApp 24/7.',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/locations',
  },
  openGraph: {
    title: 'Exotic Car Rental Locations — Montreal and Quebec | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery across Montreal neighbourhoods and Quebec cities. Ferrari, Lamborghini, BMW and more. Book on WhatsApp 24/7.',
    url: 'https://www.exoticrentalsmontreal.com/locations',
    siteName: 'Exotic Rentals Montreal',
    type: 'website',
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
      name: 'Locations',
      item: 'https://www.exoticrentalsmontreal.com/locations',
    },
  ],
}

export default function LocationsPage() {
  const neighbourhoods = LOCATIONS.filter((loc) => loc.type === 'neighbourhood')
  const cities = LOCATIONS.filter((loc) => loc.type === 'city')

  return (
    <>
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
                Locations
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <section className="mb-16 text-center">
            <h1
              className="text-5xl md:text-7xl mb-6 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Exotic Car Rental. Montreal and Quebec.
            </h1>
            <p
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              We deliver Ferrari, Lamborghini, BMW, McLaren, Porsche and more across every
              Montreal neighbourhood and throughout Quebec. Whether you are in Westmount,
              Plateau Mont-Royal, or Laval, your exotic car arrives at your door. Book on
              WhatsApp and we handle everything.
            </p>
          </section>

          {/* Montreal Neighbourhoods */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Montreal Neighbourhoods
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {neighbourhoods.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="group block bg-[#111] border border-white/10 rounded-lg p-4 hover:border-white/30 hover:bg-[#1a1a1a] transition-all duration-200"
                >
                  <span
                    className="text-sm text-gray-300 group-hover:text-white transition-colors"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {loc.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Quebec Cities */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quebec Cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cities.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="group block bg-[#111] border border-white/10 rounded-lg p-4 hover:border-white/30 hover:bg-[#1a1a1a] transition-all duration-200"
                >
                  <span
                    className="text-sm text-gray-300 group-hover:text-white transition-colors"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {loc.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-4xl md:text-5xl mb-8 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book Your Delivery
            </h2>
            <p
              className="text-gray-400 mb-8 text-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Tell us your location and preferred date. We deliver the car to you.
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
