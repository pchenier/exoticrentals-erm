import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
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
      UPDATE fleet SET
        name = ${name},
        nickname = ${nickname ?? null},
        rate = ${rate},
        original_rate = ${original_rate ?? null},
        description = ${description ?? null},
        specs = ${specs ?? null},
        engine = ${engine ?? null},
        hp = ${hp ?? null},
        sprint = ${sprint ?? null},
        image = ${resolvedImage},
        gallery = ${galleryArr},
        coming_soon = ${coming_soon ?? false},
        sort_order = ${sort_order ?? 0},
        deposit = ${deposit ?? 0},
        image_position = ${normalizedImagePosition},
        rate_3d = ${rate_3d ?? null},
        rate_7d = ${rate_7d ?? null},
        rate_14d = ${rate_14d ?? null},
        rate_30d = ${rate_30d ?? null}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('PUT /api/fleet/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await sql`DELETE FROM fleet WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/fleet/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
