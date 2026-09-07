import { getAllVehiclesLive } from "@/lib/vehicle-store";
import HomeClient from "./home-client";
import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// URLs with ?car= are deep-links into the fleet filter — not separate pages.
// Keep them out of the index so Google stops crawling duplicates of the homepage.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  if (params.car) {
    return { robots: { index: false, follow: true } };
  }
  return {};
}

export default async function HomePage() {
  noStore();
  const liveVehicles = await getAllVehiclesLive();
  return <HomeClient initialVehicles={liveVehicles} />;
}