import HomeClient from "./home-client";
import { unstable_noStore as noStore } from "next/cache";
import type { Vehicle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  noStore();
  // Fetch from our own API route (has access to GITHUB_TOKEN as sensitive env var)
  let liveVehicles: Vehicle[] = [];
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/vehicles`, { cache: 'no-store' });
    if (res.ok) {
      liveVehicles = await res.json();
    }
  } catch (e) {
    console.error('HomePage fetch error:', e);
  }
  return <HomeClient initialVehicles={liveVehicles} />;
}