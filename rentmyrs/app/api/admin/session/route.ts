import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminConfigured,
  adminToken,
  checkPassword,
  isAdmin,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET: is the current browser logged in as admin?
export async function GET(req: Request) {
  return NextResponse.json(
    { authed: await isAdmin(req), configured: adminConfigured() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

// POST { password }: log in, sets an httpOnly session cookie.
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured on the server' },
      { status: 503 },
    );
  }
  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  if (!(await checkPassword(password))) {
    // Small delay to slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ authed: true });
  res.cookies.set(ADMIN_COOKIE, await adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}

// DELETE: log out.
export async function DELETE() {
  const res = NextResponse.json({ authed: false });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
