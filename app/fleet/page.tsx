import { getAllVehiclesLive } from "@/lib/vehicle-store";
import FleetClient from "./fleet-client";

// Force server-side render on every request so admin changes appear instantly
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function FleetPage() {
  const liveVehicles = await getAllVehiclesLive();
  return <FleetClient initialVehicles={liveVehicles} />;
}