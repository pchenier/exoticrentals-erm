import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENPHONE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'no key' });
  }

  const res = await fetch('https://api.openphone.com/v1/phone-numbers', {
    headers: { 'Authorization': apiKey },
  });

  const data = await res.json();
  return NextResponse.json(data);
}