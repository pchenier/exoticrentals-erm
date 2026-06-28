import { NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
} as const;

const STATIC_CARS_PHOTOS = [
  'g63.jpg', 'g63_2.jpg', 'g63_3.jpg', 'g63_4.jpg', 'g63_5.jpg', 'g63_6.jpg', 'g63_7.jpg',
  'm5.jpg', 'm5_2.jpg', 'm5_3.jpg', 'm5_4.jpg',
  'mclaren.jpg', 'mclaren_2.jpg', 'mclaren_3.jpg', 'mclaren_4.jpg', 'mclaren_5.jpg',
  'r8.jpg', 'r8_2.jpg', 'r8_3.jpg', 'r8_4.jpg', 'r8_5.jpg',
  'rs5.jpg', 'rs5_2.jpg', 'rs5_3.jpg', 'rs5_4.jpg', 'rs5_5.jpg',
  'rs6.jpg',
  'rs7.jpg', 'rs7_2.jpg', 'rs7_3.jpg', 'rs7_4.jpg',
].map((filename) => ({ path: `/cars/${filename}`, filename }));

const STATIC_ROOT_PHOTOS = [
  'x5m.jpg', 'x5m_2.jpg', 'x5m_3.jpg', 'x5m_4.jpg',
].map((filename) => ({ path: `/${filename}`, filename }));

const STATIC_PHOTOS = [...STATIC_CARS_PHOTOS, ...STATIC_ROOT_PHOTOS];

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json() as { url: string };
    if (!url || !url.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/photos error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { blobs } = await list();
    const blobPhotos = blobs.map((b) => ({
      path: b.url,
      filename: b.pathname,
    }));

    // Deduplicate: blob wins over static if same filename
    const blobFilenames = new Set(blobPhotos.map((p) => p.filename));
    const filteredStatic = STATIC_PHOTOS.filter((p) => !blobFilenames.has(p.filename));

    const photos = [...blobPhotos, ...filteredStatic];
    return NextResponse.json(photos, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('GET /api/photos error:', err);
    // Fall back to static-only if blob list fails
    return NextResponse.json(STATIC_PHOTOS, { status: 200, headers: NO_CACHE_HEADERS });
  }
}
