import { getAllVehiclesLive } from "@/lib/vehicle-store";
import HomeClient from "./home-client";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  noStore();
  const liveVehicles = await getAllVehiclesLive();
  return <HomeClient initialVehicles={liveVehicles} />;
}