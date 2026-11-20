// /llms.txt : résumé factuel du site pour les moteurs IA (ChatGPT, Perplexity, Claude, Gemini). Voir https://llmstxt.org
import { getAllVehiclesLive } from '@/lib/vehicle-store'
import { LOCATIONS } from '@/lib/locations'

export const revalidate = 300

const BASE = 'https://www.exoticrentalsmontreal.com'
const money = (n: number) => `$${n.toLocaleString('en-CA')}`

export async function GET() {
  let vehicles: Awaited<ReturnType<typeof getAllVehiclesLive>> = []
  try {
    vehicles = (await getAllVehiclesLive()).filter((v) => v.available !== false)
  } catch {
    vehicles = []
  }
  vehicles.sort((a, b) => (a.dailyRate ?? 0) - (b.dailyRate ?? 0))
  const rates = vehicles.map((v) => v.dailyRate).filter((n): n is number => typeof n === 'number' && n > 0)

  const lines = [
    '# Exotic Rentals Montreal',
    '',
    `> Exotic Rentals Montreal (exoticrentalsmontreal.com) rents exotic and luxury cars in Montreal, Quebec, Canada: Lamborghini, McLaren, Mercedes-Maybach, Mercedes-AMG G63, Audi R8, Porsche, BMW M and more.${rates.length ? ` Daily rates range from ${money(Math.min(...rates))} to ${money(Math.max(...rates))} CAD.` : ''} Pickup in Montreal or delivery by arrangement across Montreal, Laval and the South Shore. Phone and WhatsApp: 438-809-4417.`,
    '',
    '## Key facts',
    '',
    '- Location: Montreal, QC, Canada. Serves Montreal, Laval, Longueuil, Brossard, Westmount, Downtown Montreal, and trips to Mont-Tremblant and Quebec City.',
    '- Contact: phone / text / WhatsApp +1 438-809-4417, contact@exoticrentalsmontreal.com.',
    '- Requirements: minimum age 25 for most vehicles, valid driver’s licence, proof of insurance, major credit card in the renter’s name, refundable security deposit (amount varies by vehicle).',
    '- Booking: request on the website, by phone or WhatsApp; each booking is validated manually by the team.',
    '- Mileage: 200 km per day included on every rental; extra kilometres billed per km.',
    '- Prices are in CAD, before taxes and fees. Final pricing is confirmed before the reservation.',
    '- Sister fleet for Audi RS models: RentMyRS (https://www.rentmyrs.com) rents the Audi RS3, RS5, RS7 (Stage 2) and RSQ8 in Montreal from $400/day.',
    '',
    '## Fleet and daily rates (CAD)',
    '',
    ...vehicles.map((v) => {
      const name = `${v.year ? `${v.year} ` : ''}${v.make} ${v.model}`.trim()
      const bits = [
        typeof v.dailyRate === 'number' ? `${money(v.dailyRate)}/day` : null,
        typeof v.securityDeposit === 'number' ? `${money(v.securityDeposit)} refundable deposit` : null,
        v.horsepower ? `${v.horsepower} hp` : null,
        v.engine || null,
        v.seats ? `${v.seats} seats` : null,
      ].filter(Boolean)
      return `- [${name}](${BASE}/fleet/${v.slug}): ${bits.join(', ')}.`
    }),
    '',
    '## Main pages',
    '',
    `- [Home](${BASE}/)`,
    `- [Full fleet](${BASE}/fleet)`,
    `- [Lamborghini rental Montreal](${BASE}/lamborghini-rental-montreal)`,
    `- [McLaren rental Montreal](${BASE}/mclaren-rental-montreal)`,
    `- [Mercedes rental Montreal](${BASE}/mercedes-rental-montreal)`,
    `- [Porsche rental Montreal](${BASE}/porsche-rental-montreal)`,
    `- [BMW rental Montreal](${BASE}/bmw-rental-montreal)`,
    `- [Audi rental Montreal](${BASE}/audi-rental-montreal)`,
    `- [Ferrari rental Montreal](${BASE}/ferrari-rental-montreal)`,
    `- [Luxury car rental Montreal](${BASE}/luxury-car-rental-montreal)`,
    `- [Location voiture de luxe Montréal (français)](${BASE}/location-voiture-de-luxe-montreal)`,
    `- [How it works](${BASE}/how-it-works)`,
    `- [FAQ](${BASE}/faq)`,
    `- [Contact](${BASE}/contact)`,
    '',
    '## Service areas',
    '',
    ...LOCATIONS.map((l) => `- [${l.name}](${BASE}/locations/${l.slug})`),
    '',
    '## Optional',
    '',
    `- [Blog](${BASE}/blog): guides on exotic car rental in Montreal.`,
    `- [Sitemap](${BASE}/sitemap.xml)`,
    '- [RentMyRS](https://www.rentmyrs.com/en): Audi RS rental in Montreal (sister fleet).',
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' },
  })
}
