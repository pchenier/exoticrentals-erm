import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Exotic Rentals Montreal | 438-533-9053",
  description:
    "Book an exotic car rental in Montreal. Call, text or WhatsApp us at 438-533-9053. Available 24/7. Delivery across Montreal, Laval, South Shore, Quebec City and Mont-Tremblant.",
  alternates: {
    canonical: "https://www.exoticrentalsmontreal.com/contact",
  },
  openGraph: {
    title: "Contact Exotic Rentals Montreal",
    description: "Available 24/7. Call or WhatsApp 438-533-9053.",
    url: "https://www.exoticrentalsmontreal.com/contact",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Exotic Rentals Montreal",
  description:
    "Montreal's premier luxury exotic car rental service. Concierge delivery across Greater Montreal.",
  url: "https://www.exoticrentalsmontreal.com",
  telephone: "+14385339053",
  email: "contact@exoticrentalsmontreal.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Montreal",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.5017,
    longitude: -73.5673,
  },
  openingHours: "Mo-Su 00:00-23:59",
  priceRange: "$$$",
  sameAs: [],
  areaServed: [
    "Montreal",
    "Laval",
    "Longueuil",
    "Brossard",
    "South Shore Montreal",
    "Quebec City",
    "Mont-Tremblant",
    "Gatineau",
    "Ottawa",
  ],
};

const contactMethods = [
  {
    label: "Phone",
    value: "438-533-9053",
    href: "tel:+14385339053",
    description: "Call or text anytime",
  },
  {
    label: "WhatsApp",
    value: "438-533-9053",
    href: "https://wa.me/+14385339053",
    description: "Fastest response — available 24/7",
    external: true,
  },
  {
    label: "Email",
    value: "contact@exoticrentalsmontreal.com",
    href: "mailto:contact@exoticrentalsmontreal.com",
    description: "For detailed inquiries",
  },
];

const serviceAreas = [
  "Montreal",
  "Laval",
  "South Shore",
  "Quebec City",
  "Mont-Tremblant",
  "Gatineau / Ottawa",
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="min-h-screen bg-[#060606] text-white">
        {/* Nav spacer */}
        <div className="h-32" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
          {/* Header */}
          <div className="mb-20">
            <p className="text-[9px] tracking-[0.4em] text-[#c9a96e] uppercase mb-6 font-light">
              Contact
            </p>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-none">
              Let&apos;s Talk.
            </h1>
            <div className="w-12 h-px bg-[#c9a96e]/40 mb-8" />
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-md">
              Available around the clock. Reach out by call, text, or WhatsApp
              and we&apos;ll get back to you within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact methods */}
            <div className="space-y-10">
              <p className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase font-light">
                Reach Us
              </p>
              {contactMethods.map((method) => (
                <div key={method.label} className="group">
                  <p className="text-[9px] tracking-[0.3em] text-white/25 uppercase font-light mb-2">
                    {method.label}
                  </p>
                  <a
                    href={method.href}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    className="block text-lg md:text-xl font-light text-white/80 hover:text-white transition-colors duration-300 mb-1"
                  >
                    {method.value}
                  </a>
                  <p className="text-xs text-white/25 font-light">
                    {method.description}
                  </p>
                </div>
              ))}

              {/* Primary CTA */}
              <div className="pt-6">
                <a
                  href="https://wa.me/+14385339053"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#c9a96e] text-black text-xs tracking-[0.25em] uppercase font-medium px-8 py-4 hover:bg-white transition-colors duration-300"
                >
                  <span>Message on WhatsApp</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Service info */}
            <div className="space-y-12">
              {/* Hours */}
              <div>
                <p className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase font-light mb-6">
                  Hours
                </p>
                <p className="text-2xl font-light text-white/80 mb-2">24 / 7</p>
                <p className="text-xs text-white/30 font-light">
                  Every day, including holidays
                </p>
              </div>

              {/* Delivery areas */}
              <div>
                <p className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase font-light mb-6">
                  Delivery Areas
                </p>
                <div className="space-y-3">
                  {serviceAreas.map((area) => (
                    <div
                      key={area}
                      className="flex items-center gap-3 text-sm text-white/40 font-light"
                    >
                      <div className="w-1 h-1 bg-[#c9a96e]/40 rounded-full flex-shrink-0" />
                      {area}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/20 font-light mt-4">
                  Delivery fees may apply outside Montreal island.
                </p>
              </div>

              {/* Location */}
              <div>
                <p className="text-[9px] tracking-[0.35em] text-[#c9a96e] uppercase font-light mb-6">
                  Based In
                </p>
                <p className="text-sm text-white/40 font-light">
                  Montreal, Quebec, Canada
                </p>
              </div>
            </div>
          </div>

          {/* Back to fleet */}
          <div className="mt-24 pt-12 border-t border-white/5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[9px] tracking-[0.3em] text-white/30 hover:text-white uppercase font-light transition-colors duration-300"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>View the Fleet</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
