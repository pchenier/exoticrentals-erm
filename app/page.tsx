import { vehicles as staticVehicles } from "@/lib/data";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  // Pass static data for instant first paint
  // HomeClient will fetch live data from /api/vehicles on mount
  return <HomeClient initialVehicles={staticVehicles} />;
}