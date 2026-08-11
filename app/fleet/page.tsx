import { getAllVehiclesLive } from "@/lib/vehicle-store";
import FleetClient from "./fleet-client";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const liveVehicles = await getAllVehiclesLive();
  return <FleetClient initialVehicles={liveVehicles} />;
}