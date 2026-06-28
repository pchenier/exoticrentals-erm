import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// Token-issuing endpoint for direct browser → Vercel Blob uploads.
// The browser uses `upload()` from `@vercel/blob/client`, which calls this
// route to (a) get a one-shot upload token and (b) receive the
// upload-completed callback. The actual file bytes never transit through
// this serverless function, so we are NOT subject to the 4.5 MB body limit.
export const runtime = 'edge';

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Basic extension allowlist
        const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
        if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
          throw new Error('Invalid file type');
        }
        return {
          allowedContentTypes: ALLOWED,
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB cap (camera photos)
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Hook for future indexing / DB writes. For now, just log.
        console.log('photo uploaded:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error('POST /api/photos/upload error:', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Upload failed' },
      { status: 400 }
    );
  }
}
