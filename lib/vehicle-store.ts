// Instant data layer: reads vehicles.json from GitHub API at runtime.
// Repo is public so no token needed. GitHub API returns changes immediately
// (unlike raw.githubusercontent.com which has a 5min CDN cache).

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
const CACHE_TTL_MS = 2_000; // 2 seconds

async function fetchVehicleData(): Promise<VehicleData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache',
    };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      { cache: 'no-store', headers }
    );
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const fileData = await res.json();
    if (!fileData.content) throw new Error('No content in GitHub response');
    const content = typeof Buffer !== 'undefined'
      ? Buffer.from(fileData.content, 'base64').toString('utf-8')
      : atob(fileData.content.replace(/\n/g, ''));
    const data = JSON.parse(content) as VehicleData;
    if (!data.vehicles || !Array.isArray(data.vehicles) || data.vehicles.length === 0) {
      throw new Error('No vehicles in data');
    }
    cache = { data, ts: Date.now() };
    return data;
  } catch (err) {
    console.error('vehicle-store fetch error, using static:', err);
    return {
      vehicles: staticVehicles,
      faqs: staticFaqs,
      reviews: staticReviews,
    };
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