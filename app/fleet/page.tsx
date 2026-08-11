import { vehicles as staticVehicles } from "@/lib/data";
import FleetClient from "./fleet-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FleetPage() {
  return <FleetClient initialVehicles={staticVehicles} />;
}