import { NextResponse } from 'next/server';
import { vehicles as staticVehicles } from '@/lib/data';

export async function GET() {
  return NextResponse.json(staticVehicles);
}