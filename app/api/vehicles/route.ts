import { NextResponse } from 'next/server';
import { getAllVehiclesLive } from '@/lib/vehicle-store';

// Force dynamic — never cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const vehicles = await getAllVehiclesLive();
  return NextResponse.json(vehicles, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}