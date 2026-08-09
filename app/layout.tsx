import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-J3DCXV066G";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18142334755";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.exoticrentalsmontreal.com'),
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/erm-logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CarRental"],
  "name": "Exotic Rentals Montreal",
  "description": "Montreal's premier luxury exotic car rental service. RS7, RS6, M5 Competition, R8 V10, McLaren 600LT, Lamborghini Urus, G63 AMG.",
  "url": "https://www.exoticrentalsmontreal.com",
  "telephone": "+14388094417",
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
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
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
      </head>
      <body className="font-sans antialiased">
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
      </body>
    </html>
  );
}