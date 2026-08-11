// Instant data layer: reads vehicles.json from GitHub at runtime.
// Uses GitHub API (immediate, no CDN delay) with jsDelivr as fallback.

import { vehicles as staticVehicles, faqs as staticFaqs, reviews as staticReviews, type Vehicle } from './data';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const REPO_OWNER = 'pchenier';
const REPO_NAME = 'exoticrentals-erm';
const FILE_PATH = 'lib/vehicles.json';

interface VehicleData {
  vehicles: Vehicle[];
  faqs: typeof staticFaqs;
  reviews: typeof staticReviews;
}

let cache: { data: VehicleData; ts: number } | null = null;
const CACHE_TTL_MS = 2_000;

async function fetchVehicleData(): Promise<VehicleData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    // GitHub API first (returns latest commit immediately, no CDN cache)
    let data: VehicleData | null = null;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        { cache: 'no-store', headers }
      );
      if (res.ok) {
        const fileData = await res.json();
        const content = typeof Buffer !== 'undefined'
          ? Buffer.from(fileData.content, 'base64').toString('utf-8')
          : atob(fileData.content.replace(/\n/g, ''));
        data = JSON.parse(content) as VehicleData;
      }
    } catch (e) {
      // GitHub API failed
    }

    // Fallback to jsDelivr CDN
    if (!data || !data.vehicles || data.vehicles.length === 0) {
      try {
        const rawRes = await fetch(
          `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@main/${FILE_PATH}`,
          { cache: 'no-store' }
        );
        if (rawRes.ok) {
          data = await rawRes.json() as VehicleData;
        }
      } catch (e) {
        // jsDelivr failed
      }
    }

    if (!data || !data.vehicles || data.vehicles.length === 0) {
      throw new Error('No vehicles in data from any source');
    }
    cache = { data, ts: Date.now() };
    return data;
  } catch (err) {
    console.error('vehicle-store fetch error, using static:', err);
    return { vehicles: staticVehicles, faqs: staticFaqs, reviews: staticReviews };
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