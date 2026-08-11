import { getAllVehiclesLive } from "@/lib/vehicle-store";
import HomeClient from "./home-client";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const liveVehicles = await getAllVehiclesLive();
  return <HomeClient initialVehicles={liveVehicles} />;
}