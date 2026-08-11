// Live data layer: reads from GitHub raw via vehicle-store
// Falls back to static data if GitHub is unreachable

import { vehicles as staticVehicles, type Vehicle } from './data';
import { getAllVehiclesLive, getVehicleBySlugLive } from './vehicle-store';

export async function getAllVehicles(): Promise<Vehicle[]> {
  return getAllVehiclesLive();
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  return getVehicleBySlugLive(slug);
}