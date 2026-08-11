import FleetClient from "./fleet-client";
import { unstable_noStore as noStore } from "next/cache";
import type { Vehicle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FleetPage() {
  noStore();
  let liveVehicles: Vehicle[] = [];
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/vehicles`, { cache: 'no-store' });
    if (res.ok) {
      liveVehicles = await res.json();
    }
  } catch (e) {
    console.error('FleetPage fetch error:', e);
  }
  return <FleetClient initialVehicles={liveVehicles} />;
}