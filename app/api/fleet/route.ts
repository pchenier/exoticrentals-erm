import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM fleet ORDER BY sort_order ASC, id ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/fleet error:', err);
    return NextResponse.json({ error: 'Failed to fetch fleet' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      nickname,
      rate,
      original_rate,
      description,
      specs,
      engine,
      hp,
      sprint,
      image,
      gallery,
      coming_soon,
      sort_order,
      deposit,
      image_position,
      rate_3d,
      rate_7d,
      rate_14d,
      rate_30d,
    } = body;

    const galleryArr = Array.isArray(gallery) ? gallery : [];
    const resolvedImage = galleryArr[0] ?? image ?? null;
    const normalizedImagePosition =
      typeof image_position === 'string' && image_position.trim().length > 0
        ? image_position.trim()
        : null;

    const { rows } = await sql`
      INSERT INTO fleet (name, nickname, rate, original_rate, description, specs, engine, hp, sprint, image, gallery, coming_soon, sort_order, deposit, image_position, rate_3d, rate_7d, rate_14d, rate_30d)
      VALUES (
        ${name},
        ${nickname ?? null},
        ${rate},
        ${original_rate ?? null},
        ${description ?? null},
        ${specs ?? null},
        ${engine ?? null},
        ${hp ?? null},
        ${sprint ?? null},
        ${resolvedImage},
        ${galleryArr},
        ${coming_soon ?? false},
        ${sort_order ?? 0},
        ${deposit ?? 0},
        ${normalizedImagePosition},
        ${rate_3d ?? null},
        ${rate_7d ?? null},
        ${rate_14d ?? null},
        ${rate_30d ?? null}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('POST /api/fleet error:', err);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}
