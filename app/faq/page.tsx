import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — Exotic Car Rental Montreal | Exotic Rentals Montreal',
  description: 'Frequently asked questions about exotic car rentals in Montreal. Prices, deposits, insurance, delivery, age requirements and more.',
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com/faq',
  },
  openGraph: {
    title: 'FAQ — Exotic Car Rental Montreal',
    description: 'Everything you need to know about renting an exotic car in Montreal.',
    url: 'https://www.exoticrentalsmontreal.com/faq',
  },
};

const faqs = [
  {
    q: 'What exotic cars can I rent in Montreal?',
    a: 'We offer the McLaren 600LT, Lamborghini Huracán EVO, Lamborghini Huracán Tecnica, Lamborghini Urus, Audi RS7, Audi RS6, Audi R8 V10 Spyder, BMW M5 Competition, BMW M3 Isle of Man, BMW M4 Competition, Mercedes G63 AMG, Mercedes E63S AMG, Mercedes S63 AMG, Ferrari 488 GTB, Porsche 911 TechArt, Porsche Panamera GTS and more. 20+ vehicles available year round.',
  },
  {
    q: 'How much does it cost to rent an exotic car in Montreal?',
    a: 'Prices start at $400/day for the Audi RS5 or Porsche Macan GTS, and go up to $1,799/day for the Lamborghini Huracán Tecnica. The Ferrari 488 GTB is $1,399/day, the Lamborghini Urus $1,499/day, and the McLaren 600LT $1,599/day.',
  },
  {
    q: 'What is the security deposit for an exotic car rental?',
    a: 'The deposit varies by vehicle: $1,500 to $10,000 CAD depending on the car. For example, the Audi RS5 requires a $5,000 deposit, while the Lamborghini Urus requires $10,000. Deposits are fully refundable upon return of the vehicle in the same condition.',
  },
  {
    q: 'What insurance is required to rent an exotic car?',
    a: 'Full comprehensive insurance on the rented vehicle is required. You can use your personal auto insurance policy (if it covers rentals) or purchase coverage through us. We require proof of insurance at time of pickup or delivery.',
  },
  {
    q: 'Do you deliver the car to my location in Montreal?',
    a: 'Yes, we offer white glove delivery and pickup anywhere in Greater Montreal including downtown, Westmount, Laval, the South Shore, Longueuil, and airport hotels. Delivery is available 24/7 and is included in most rentals.',
  },
  {
    q: 'Can you deliver to Montreal-Trudeau Airport (YUL)?',
    a: 'Yes. We regularly deliver and pick up vehicles at Pierre Elliott Trudeau International Airport (YUL) and Montréal-Mirabel Airport. Contact us in advance to coordinate timing with your flight.',
  },
  {
    q: 'What is the minimum rental period?',
    a: 'Our minimum rental is 1 day (24 hours). We also offer multi-day discounts — the longer your rental, the better the rate. Contact us for weekly pricing.',
  },
  {
    q: 'What are the age requirements to rent an exotic car?',
    a: "You must be at least 21 years old with a valid driver's license. Some vehicles may require a minimum age of 25. A clean driving record is required for all rentals.",
  },
  {
    q: 'Can I rent an exotic car for a wedding in Montreal?',
    a: 'Absolutely. Our vehicles are frequently rented for weddings, anniversaries, proposals, and other milestone events. We can deliver the car to your venue and arrange flexible pickup times to accommodate your schedule.',
  },
  {
    q: 'Can I rent an exotic car for a photoshoot or film production?',
    a: 'Yes. We regularly work with photographers, videographers, music video productions, and ad agencies. Our vehicles are always freshly detailed and camera-ready. Contact us via WhatsApp for custom packages, hourly rates, and multi-vehicle production quotes.',
  },
  {
    q: 'Do you offer exotic car rentals in Quebec City or outside Montreal?',
    a: 'Yes, we can deliver throughout Quebec including Quebec City, Mont Tremblant, the Eastern Townships, the Laurentians, and the South Shore. Long-distance delivery fees may apply. Contact us for exact pricing.',
  },
  {
    q: 'What happens if the car is damaged during my rental?',
    a: 'Any damage is assessed upon vehicle return. The security deposit covers minor incidents up to the deposit amount. For major damage exceeding the deposit, your personal or rental insurance applies. We document the vehicle condition before every rental with photos and video.',
  },
  {
    q: 'Can I take the exotic car on a road trip outside Quebec?',
    a: 'Travel within Canada is generally permitted. Trips to the United States require prior written approval. Contact us before booking if you plan to cross provincial or national borders.',
  },
  {
    q: 'How do I book an exotic car rental in Montreal?',
    a: 'Simply text or WhatsApp us at +1 (438) 533-9053 with your desired vehicle, dates, and delivery location. We confirm availability within the hour, collect a deposit to secure your booking, and deliver the car freshly detailed to your door.',
  },
  {
    q: 'Are there mileage limits on exotic car rentals?',
    a: 'Daily rentals include a standard mileage allowance. Additional kilometers are available for a per-km fee. Multi-day packages often include higher mileage limits. Ask us about unlimited mileage options for road trips.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#666] mb-10">
          <Link href="/" className="hover:text-[#c9a96e] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#aaa]">FAQ</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl text-white mb-4 tracking-wide">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-[#888] mb-14 text-base">
          Everything you need to know about renting an exotic car in Montreal.
          Still have questions?{' '}
          <a
            href="https://wa.me/14385339053"
            className="text-[#c9a96e] hover:underline"
          >
            WhatsApp us
          </a>{' '}
          and we reply within minutes.
        </p>

        <div className="space-y-0 divide-y divide-[#1a1a1a]">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="py-7">
              <h2 className="text-white font-semibold text-base mb-3 leading-snug">
                {q}
              </h2>
              <p className="text-[#999] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-[#222] bg-[#111] p-8 text-center">
          <p className="text-[#aaa] text-sm mb-4">
            Ready to book or have a specific question?
          </p>
          <a
            href="https://wa.me/14385339053"
            className="inline-block bg-[#c9a96e] text-black font-semibold text-sm px-8 py-3 rounded-full hover:bg-[#d4b87a] transition-colors"
          >
            WhatsApp us — (438) 533-9053
          </a>
        </div>
      </div>
    </main>
  );
}
