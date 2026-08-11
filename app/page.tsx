import { getAllVehiclesLive } from "@/lib/vehicle-store";
import HomeClient from "./home-client";
import { unstable_noStore as noStore } from "next/cache";

// Force server-side render on every request so admin changes appear instantly
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  noStore(); // Opt out of static rendering
  const liveVehicles = await getAllVehiclesLive();
  return <HomeClient initialVehicles={liveVehicles} />;
}