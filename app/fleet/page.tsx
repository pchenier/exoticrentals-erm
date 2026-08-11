import { getAllVehiclesLive } from "@/lib/vehicle-store";
import FleetClient from "./fleet-client";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FleetPage() {
  noStore();
  const liveVehicles = await getAllVehiclesLive();
  return <FleetClient initialVehicles={liveVehicles} />;
}