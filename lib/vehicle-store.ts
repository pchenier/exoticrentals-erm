// Instant data layer: reads vehicles.json from GitHub raw at runtime.
// Admin saves commit vehicles.json to GitHub → site picks up changes on next request.
// No Vercel rebuild needed.

import { vehicles as staticVehicles, faqs as staticFaqs, reviews as staticReviews, type Vehicle } from './data';

const GITHUB_RAW = 'https://raw.githubusercontent.com/pchenier/exoticrentals-erm/main/lib/vehicles.json';
const CACHE_TTL_MS = 10_000; // 10 second in-memory cache

interface VehicleData {
  vehicles: Vehicle[];
  faqs: typeof staticFaqs;
  reviews: typeof staticReviews;
}

let cache: { data: VehicleData; ts: number } | null = null;

async function fetchVehicleData(): Promise<VehicleData> {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const res = await fetch(GITHUB_RAW, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`GitHub raw returned ${res.status}`);
    const data = await res.json() as VehicleData;
    cache = { data, ts: Date.now() };
    return data;
  } catch (err) {
    // Fallback to static data if GitHub is unreachable
    console.error('vehicle-store fetch error, using static:', err);
    const fallback: VehicleData = {
      vehicles: staticVehicles,
      faqs: staticFaqs,
      reviews: staticReviews,
    };
    return fallback;
  }
}

export async function getAllVehiclesLive(): Promise<Vehicle[]> {
  const data = await fetchVehicleData();
  return data.vehicles;
}

export async function getVehicleBySlugLive(slug: string): Promise<Vehicle | null> {
  const vehicles = await getAllVehiclesLive();
  return vehicles.find(v => v.slug === slug) ?? null;
}

export async function getFaqsLive() {
  const data = await fetchVehicleData();
  return data.faqs;
}

export async function getReviewsLive() {
  const data = await fetchVehicleData();
  return data.reviews;
}