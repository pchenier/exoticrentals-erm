// Use static vehicle data from data.ts (PMR fleet adapted for Montreal)
// No more fetching from old Postgres — all data is static now.

import { vehicles as staticVehicles, type Vehicle } from './data';

export async function getAllVehicles(): Promise<Vehicle[]> {
  return staticVehicles;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  return staticVehicles.find(v => v.slug === slug) ?? null;
}