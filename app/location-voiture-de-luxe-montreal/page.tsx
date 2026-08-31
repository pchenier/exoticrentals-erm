import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { slugify } from '@/lib/slugify'

export const metadata: Metadata = {
  title: 'Location Voiture de Luxe à Montréal — Lamborghini, Audi R8, G63 | Exotic Rentals Montreal',
  description:
    'Location de voitures de luxe à Montréal. Lamborghini, McLaren, Audi RS et R8, Mercedes G63. À partir de 400$/jour, livraison gratuite partout à Montréal, Laval et la Rive-Sud. Réservez sur WhatsApp 24/7.',
  keywords:
    'location voiture de luxe, location voiture de luxe montréal, location voiture exotique, louer lamborghini montréal, location audi r8 montréal',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/location-voiture-de-luxe-montreal',
  },
  openGraph: {
    title: 'Location Voiture de Luxe à Montréal — Lamborghini, Audi R8, G63 | Exotic Rentals Montreal',
    description:
      'Location de voitures de luxe à Montréal. Lamborghini, McLaren, Audi RS et R8, Mercedes G63. À partir de 400$/jour, livraison gratuite. Réservez sur WhatsApp 24/7.',
    url: 'https://www.exoticrentalsmontreal.com/location-voiture-de-luxe-montreal',
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
  name: 'Location de voitures de luxe à Montréal',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Exotic Rentals Montreal',
    url: 'https://www.exoticrentalsmontreal.com',
    telephone: '+14388094417',
  },
  areaServed: ['Montréal, QC, Canada', 'Laval, QC, Canada', 'Rive-Sud de Montréal, QC, Canada'],
  description:
    'Location de voitures de luxe et exotiques à Montréal avec livraison gratuite. Lamborghini, McLaren, Audi RS et R8, Mercedes G63 AMG, disponibles 24/7.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '400',
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
      name: 'Location Voiture de Luxe Montréal',
      item: 'https://www.exoticrentalsmontreal.com/location-voiture-de-luxe-montreal',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien coûte la location d\'une voiture de luxe à Montréal ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nos tarifs débutent à 400$/jour pour une voiture exotique. Le prix varie selon le modèle et la durée. Les voitures les plus demandées comme la Lamborghini ou le McLaren coûtent plus cher. Écrivez-nous sur WhatsApp pour un prix exact en 2 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Livrez-vous la voiture à mon adresse ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, la livraison est gratuite partout à Montréal, Laval et sur la Rive-Sud. On apporte la voiture directement chez toi, à ton hôtel ou au bureau. Pas de comptoir, pas d\'attente à l\'aéroport.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels documents faut-il pour louer ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un permis de conduire valide, une preuve d\'assurance et une carte de crédit au nom du conducteur. Le dépôt de sécurité se fait par blocage sur la carte, remboursé au retour.',
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on réserver pour un bal, un mariage ou une graduation ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolument. Bals de finissants, mariages, graduations, tournages — on livre la voiture à l\'heure et à l\'endroit exacts pour ton événement. Réservé plusieurs semaines d\'avance en haute saison (mai-juin).',
      },
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
    const luxury = all.filter((car) =>
      /lamborghini|mclaren|ferrari|audi r|g63|g wagon|porsche|amg/i.test(car.name)
    )
    return luxury.slice(0, 6)
  } catch {
    return []
  }
}

export default async function LocationVoitureDeLuxe() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                Location Voiture de Luxe
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <section className="mb-16 text-center">
            <h1
              className="text-5xl md:text-7xl mb-6 tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Location Voiture de Luxe à Montréal
            </h1>
            <p
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Lamborghini, McLaren, Audi RS et R8, Mercedes G63 — la plus belle collection
              de voitures de luxe à louer à Montréal. À partir de 400$/jour, livraison
              gratuite partout à Montréal, Laval et la Rive-Sud. Réserve en 2 minutes sur
              WhatsApp.
            </p>
          </section>

          {/* Fleet */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Notre Collection de Luxe
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
                          À partir de {rate}$/jour
                        </p>
                      )}
                      <span className="mt-4 inline-block text-xs text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                        Voir les détails →
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                Consulte notre flotte complète — contacte-nous pour les disponibilités.
              </p>
            )}
          </section>

          {/* Why */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pourquoi Nous Choisir
            </h2>
            <ul className="max-w-2xl mx-auto space-y-5">
              {[
                'Flotte de Lamborghini, McLaren, Audi RS, BMW M et Mercedes-AMG — les plus belles voitures à louer à Montréal',
                'Livraison gratuite à ton adresse partout à Montréal, Laval et la Rive-Sud',
                'Ouvert 24/7, 365 jours par année — réserve le jour même, même le soir',
                'Dépôt par blocage sur carte de crédit, remboursé au retour — pas de surprise',
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

          {/* FAQ */}
          <section className="mb-20">
            <h2
              className="text-4xl md:text-5xl mb-10 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Questions Fréquentes
            </h2>
            <div className="max-w-2xl mx-auto space-y-6">
              {[
                {
                  q: 'Combien coûte la location d\'une voiture de luxe ?',
                  a: 'Les tarifs débutent à 400$/jour selon le modèle et la durée. Les modèles les plus demandés coûtent plus cher. Écris-nous sur WhatsApp pour un prix exact en 2 minutes.',
                },
                {
                  q: 'Livrez-vous la voiture à mon adresse ?',
                  a: 'Oui, livraison gratuite partout à Montréal, Laval et la Rive-Sud. On apporte la voiture chez toi, à ton hôtel ou au bureau. Pas de comptoir, pas d\'attente.',
                },
                {
                  q: 'Quels documents faut-il pour louer ?',
                  a: 'Permis de conduire valide, preuve d\'assurance et carte de crédit au nom du conducteur. Le dépôt se fait par blocage sur la carte, remboursé au retour.',
                },
                {
                  q: 'Peut-on réserver pour un bal, un mariage ou une graduation ?',
                  a: 'Absolument. Bals de finissants, mariages, graduations, tournages — on livre la voiture à l\'heure exacte de ton événement. Réserve plusieurs semaines d\'avance en haute saison.',
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="bg-[#111111] border border-gray-800 rounded-lg p-6"
                >
                  <h3
                    className="text-lg mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    className="text-gray-400 leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-4xl md:text-5xl mb-8 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Réserve Ta Voiture de Luxe
            </h2>
            <p
              className="text-gray-400 mb-8 text-lg"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Prêt à conduire la voiture de tes rêves à Montréal ? Réponse en 2 minutes sur WhatsApp.
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
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.199.058-.371-.058-.52-.116-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.885 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Réserver sur WhatsApp
            </a>
          </section>
        </main>

        <Footer />
        <FloatingWA />
      </div>
    </>
  )
}