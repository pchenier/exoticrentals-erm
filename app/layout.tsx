import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import type { Viewport } from "next";
import FloatingWA from "@/components/FloatingWA";
import ScrollBanner from "@/components/scroll-banner";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-J3DCXV066G";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18142334755";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const viewport: Viewport = {};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.exoticrentalsmontreal.com'),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/erm-logo.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon-192.png",
  },
  title: 'Exotic Rentals Montreal — Luxury Exotic Car Rentals',
  description: "Montreal's #1 exotic car rental. RS7, RS6, M5 Competition, R8 V10 Spyder, McLaren 600LT, Lamborghini Urus, G63 AMG. Book now — Available 24/7.",
  keywords: [
    'exotic car rental montreal',
    'luxury car rental montreal',
    'sports car rental montreal',
    'lamborghini rental montreal',
    'mclaren rental montreal',
    'mercedes g63 rental montreal',
    'audi rs7 rental montreal',
    'location voiture exotique montreal',
    'location voiture de luxe montreal',
    'louer mclaren montreal',
    'louer lamborghini montreal',
    'audi rs5 rental montreal',
  ],
  openGraph: {
    title: 'Exotic Rentals Montreal',
    description: "Montreal's premier exotic car rental. Available 24/7.",
    url: 'https://www.exoticrentalsmontreal.com',
    siteName: 'Exotic Rentals Montreal',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: 'https://www.exoticrentalsmontreal.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'McLaren 600LT — Exotic Rentals Montreal',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exotic Rentals Montreal',
    description: "Montreal's premier exotic car rental. Available 24/7.",
    images: ['https://www.exoticrentalsmontreal.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.exoticrentalsmontreal.com',
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What exotic cars can I rent in Montreal?",
      "acceptedAnswer": { "@type": "Answer", "text": "We offer the McLaren 600LT, Lamborghini Huracán EVO, Lamborghini Huracán Tecnica, Lamborghini Urus, Audi RS7, Audi RS6, Audi R8 V10 Spyder, BMW M5 Competition, BMW M3 Isle of Man, BMW M4 Competition, Mercedes G63 AMG, Mercedes E63S AMG, Mercedes S63 AMG, Ferrari 488 GTB, Porsche 911 TechArt, Porsche Panamera GTS and more. 20+ vehicles available year round." }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to rent an exotic car in Montreal?",
      "acceptedAnswer": { "@type": "Answer", "text": "Prices start at $400/day for the Audi RS5 or Porsche Macan GTS, and go up to $1,799/day for the Lamborghini Huracán Tecnica. The Ferrari 488 GTB is $1,399/day, the Lamborghini Urus $1,499/day, and the McLaren 600LT $1,599/day." }
    },
    {
      "@type": "Question",
      "name": "What is the security deposit for an exotic car rental?",
      "acceptedAnswer": { "@type": "Answer", "text": "The deposit varies by vehicle: $1,500 to $10,000 CAD depending on the car. For example, the Audi RS5 requires a $5,000 deposit, while the Lamborghini Urus requires $10,000. Deposits are fully refundable upon return of the vehicle in the same condition." }
    },
    {
      "@type": "Question",
      "name": "What insurance is required to rent an exotic car?",
      "acceptedAnswer": { "@type": "Answer", "text": "Full comprehensive insurance on the rented vehicle is required. You can use your personal auto insurance policy (if it covers rentals) or purchase coverage through us. We require proof of insurance at time of pickup or delivery." }
    },
    {
      "@type": "Question",
      "name": "Do you deliver the car to my location in Montreal?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer white glove delivery and pickup anywhere in Greater Montreal including downtown, Westmount, Laval, the South Shore, Longueuil, and airport hotels. Delivery is available 24/7 and is included in most rentals." }
    },
    {
      "@type": "Question",
      "name": "Can you deliver to Montreal-Trudeau Airport (YUL)?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We regularly deliver and pick up vehicles at Pierre Elliott Trudeau International Airport (YUL) and Montréal-Mirabel Airport. Contact us in advance to coordinate timing with your flight." }
    },
    {
      "@type": "Question",
      "name": "What is the minimum rental period?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our minimum rental is 1 day (24 hours). We also offer multi-day discounts — the longer your rental, the better the rate. Contact us for weekly pricing." }
    },
    {
      "@type": "Question",
      "name": "What are the age requirements to rent an exotic car?",
      "acceptedAnswer": { "@type": "Answer", "text": "You must be at least 21 years old with a valid driver's license. Some vehicles may require a minimum age of 25. A clean driving record is required for all rentals." }
    },
    {
      "@type": "Question",
      "name": "Can I rent an exotic car for a wedding in Montreal?",
      "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Our vehicles are frequently rented for weddings, anniversaries, proposals, and other milestone events. We can deliver the car to your venue and arrange flexible pickup times to accommodate your schedule." }
    },
    {
      "@type": "Question",
      "name": "Can I rent an exotic car for a photoshoot or film production?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We regularly work with photographers, videographers, music video productions, and ad agencies. Our vehicles are always freshly detailed and camera-ready. Contact us via WhatsApp for custom packages, hourly rates, and multi-vehicle production quotes." }
    },
    {
      "@type": "Question",
      "name": "Do you offer exotic car rentals in Quebec City or outside Montreal?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, we can deliver throughout Quebec including Quebec City, Mont Tremblant, the Eastern Townships, the Laurentians, and the South Shore. Long-distance delivery fees may apply. Contact us for exact pricing." }
    },
    {
      "@type": "Question",
      "name": "What happens if the car is damaged during my rental?",
      "acceptedAnswer": { "@type": "Answer", "text": "Any damage is assessed upon vehicle return. The security deposit covers minor incidents up to the deposit amount. For major damage exceeding the deposit, your personal or rental insurance applies. We document the vehicle condition before every rental with photos and video." }
    },
    {
      "@type": "Question",
      "name": "Can I take the exotic car on a road trip outside Quebec?",
      "acceptedAnswer": { "@type": "Answer", "text": "Travel within Canada is generally permitted. Trips to the United States require prior written approval. Contact us before booking if you plan to cross provincial or national borders." }
    },
    {
      "@type": "Question",
      "name": "How do I book an exotic car rental in Montreal?",
      "acceptedAnswer": { "@type": "Answer", "text": "Simply text or WhatsApp us at +1 (438) 533-9053 with your desired vehicle, dates, and delivery location. We confirm availability within the hour, collect a deposit to secure your booking, and deliver the car freshly detailed to your door." }
    },
    {
      "@type": "Question",
      "name": "Are there mileage limits on exotic car rentals?",
      "acceptedAnswer": { "@type": "Answer", "text": "Daily rentals include a standard mileage allowance. Additional kilometers are available for a per-km fee. Multi-day packages often include higher mileage limits. Ask us about unlimited mileage options for road trips." }
    }
  ]
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CarRental"],
  "name": "Exotic Rentals Montreal",
  "description": "Montreal's premier luxury exotic car rental service. RS7, RS6, M5 Competition, R8 V10, McLaren 600LT, Lamborghini Urus, G63 AMG.",
  "url": "https://www.exoticrentalsmontreal.com",
  "telephone": "+14385339053",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Montreal",
    "addressRegion": "QC",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.5017,
    "longitude": -73.5673
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$$$",
  "sameAs": []
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/cars/mclaren_2.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased bg-[#0a0a0a] text-white`}
      >
        {/* Google Analytics 4 — used for Google Ads conversion import */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        {/* Google Ads tag — loaded separately so Google detects AW-18142334755 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
          gtag('config', '${GOOGLE_ADS_ID}', {
            'allow_enhanced_conversions': true
          });
        `}</Script>
        {children}
        <ScrollBanner />
        <FloatingWA />
      </body>
    </html>
  );
}
