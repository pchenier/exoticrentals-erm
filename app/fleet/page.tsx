import { getAllVehiclesLive } from "@/lib/vehicle-store";
import FleetClient from "./fleet-client";
import { unstable_noStore as noStore } from "next/cache";

// Force server-side render on every request so admin changes appear instantly
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FleetPage() {
  noStore(); // Opt out of static rendering
  const liveVehicles = await getAllVehiclesLive();
  return <FleetClient initialVehicles={liveVehicles} />;
}