import { getAllVehiclesLive } from "@/lib/vehicle-store";
import FleetClient from "./fleet-client";
import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our Fleet — Exotic & Luxury Cars for Rent | Exotic Rentals Montreal",
  description:
    "Browse our full exotic and luxury fleet in Montreal: Lamborghini, McLaren, Ferrari, Porsche, Audi RS, BMW M, Mercedes-AMG. From $400/day with free concierge delivery.",
  alternates: {
    canonical: "https://www.exoticrentalsmontreal.com/fleet",
  },
  openGraph: {
    title: "Our Fleet — Exotic & Luxury Cars for Rent | Exotic Rentals Montreal",
    description:
      "Browse our full exotic and luxury fleet in Montreal: Lamborghini, McLaren, Ferrari, Porsche, Audi RS, BMW M, Mercedes-AMG. From $400/day with free concierge delivery.",
    url: "https://www.exoticrentalsmontreal.com/fleet",
    siteName: "Exotic Rentals Montreal",
    type: "website",
    images: [
      {
        url: "https://www.exoticrentalsmontreal.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Exotic Rentals Montreal",
      },
    ],
  },
};

export default async function FleetPage() {
  noStore();
  const liveVehicles = await getAllVehiclesLive();
  return <FleetClient initialVehicles={liveVehicles} />;
}