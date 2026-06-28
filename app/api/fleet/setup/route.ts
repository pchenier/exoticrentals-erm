import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS fleet (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        nickname TEXT,
        rate INTEGER NOT NULL,
        original_rate INTEGER,
        description TEXT,
        specs TEXT,
        engine TEXT,
        hp TEXT,
        sprint TEXT,
        image TEXT,
        gallery TEXT[],
        coming_soon BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        image_position TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    // Idempotent migration in case the table predates this column
    await sql`ALTER TABLE fleet ADD COLUMN IF NOT EXISTS image_position TEXT;`;

    // Seed data — ON CONFLICT DO NOTHING requires a unique constraint on name
    // We use a manual check approach: insert only if name not exists
    const cars = [
      {
        name: 'Audi RS5',
        nickname: 'The Phantom',
        rate: 400,
        original_rate: 479,
        description: "The RS5 doesn't announce itself — it just arrives. Nardo grey, carbon details, red stitching inside. Calm when you want, savage when you push it.",
        specs: '450 hp · V6 Biturbo · quattro AWD',
        engine: '2.9L V6 Biturbo',
        hp: '450 hp',
        sprint: '3.9s',
        image: '/cars/rs5.jpg',
        gallery: ['/cars/rs5.jpg', '/cars/rs5_2.jpg', '/cars/rs5_3.jpg', '/cars/rs5_4.jpg', '/cars/rs5_5.jpg'],
        coming_soon: false,
        sort_order: 0,
      },
      {
        name: 'Audi RS6',
        nickname: 'The Performer',
        rate: 549,
        original_rate: null,
        description: 'The RS6 Avant is the ultimate sleeper — 591hp family wagon that outruns supercars.',
        specs: '591 hp · V8 Twin-Turbo · AWD',
        engine: '4.0L V8 Biturbo',
        hp: '591 hp',
        sprint: '3.6s',
        image: '/cars/rs6.jpg',
        gallery: ['/cars/rs6.jpg'],
        coming_soon: false,
        sort_order: 1,
      },
      {
        name: 'Audi RS7',
        nickname: 'The Executive',
        rate: 599,
        original_rate: null,
        description: 'The RS7 redefines executive performance — a 591hp twin-turbo V8 coupé that dominates both highway and city.',
        specs: '591 hp · V8 Twin-Turbo · AWD',
        engine: '4.0L V8 Biturbo',
        hp: '591 hp',
        sprint: '3.6s',
        image: '/cars/rs7_2.jpg',
        gallery: ['/cars/rs7_2.jpg', '/cars/rs7.jpg', '/cars/rs7_3.jpg', '/cars/rs7_4.jpg'],
        coming_soon: false,
        sort_order: 2,
      },
      {
        name: 'BMW M5 Competition',
        nickname: 'The Legend',
        rate: 599,
        original_rate: null,
        description: "BMW's most iconic performance sedan. 617hp, rear-biased AWD, and a soundtrack you'll never forget.",
        specs: '617 hp · V8 Twin-Turbo · xDrive',
        engine: '4.4L V8 Biturbo',
        hp: '617 hp',
        sprint: '3.4s',
        image: '/cars/m5.jpg',
        gallery: ['/cars/m5.jpg', '/cars/m5_2.jpg', '/cars/m5_3.jpg', '/cars/m5_4.jpg'],
        coming_soon: false,
        sort_order: 3,
      },
      {
        name: 'Audi R8',
        nickname: 'The Icon',
        rate: 899,
        original_rate: null,
        description: "Mid-engine perfection. The R8 V10 Spyder is Audi's crown jewel — naturally aspirated, raw, and stunning.",
        specs: '562 hp · V10 N/A · RWD · Pearl White',
        engine: '5.2L V10 NA',
        hp: '562 hp',
        sprint: '3.2s',
        image: '/cars/r8.jpg',
        gallery: ['/cars/r8.jpg', '/cars/r8_2.jpg', '/cars/r8_3.jpg', '/cars/r8_4.jpg', '/cars/r8_5.jpg'],
        coming_soon: false,
        sort_order: 4,
      },
      {
        name: 'McLaren 600LT',
        nickname: 'The Beast',
        rate: 1199,
        original_rate: null,
        description: 'The McLaren 600LT is track-bred and street-legal. 592hp of pure British engineering.',
        specs: '592 hp · V8 Twin-Turbo · RWD · Longtail',
        engine: '3.8L V8 Biturbo',
        hp: '592 hp',
        sprint: '2.9s',
        image: '/cars/mclaren.jpg',
        gallery: ['/cars/mclaren.jpg', '/cars/mclaren_2.jpg', '/cars/mclaren_3.jpg', '/cars/mclaren_4.jpg', '/cars/mclaren_5.jpg'],
        coming_soon: false,
        sort_order: 5,
      },
      {
        name: 'Lamborghini Urus Black on Black',
        nickname: 'The Throne',
        rate: 1200,
        original_rate: null,
        description: 'Nero Noctis, blacked-out wheels, black interior. The Urus in stealth mode — 641hp SUV that disappears into the night and reappears in your rearview.',
        specs: '641 hp · V8 Twin-Turbo · AWD',
        engine: '4.0L V8 Biturbo',
        hp: '641 hp',
        sprint: '3.5s',
        image: '/cars/urus_black1.jpg',
        gallery: ['/cars/urus_black1.jpg', '/cars/urus_black2.jpg', '/cars/urus_black3.jpg'],
        coming_soon: false,
        sort_order: 12,
      },
      {
        name: 'Mercedes G63 AMG',
        nickname: 'The Commander',
        rate: 999,
        original_rate: null,
        description: 'The G63 AMG is an icon. 577hp of AMG muscle in the most recognizable silhouette on the road.',
        specs: '577 hp · V8 Bi-Turbo · 4MATIC',
        engine: '4.0L V8 Biturbo',
        hp: '577 hp',
        sprint: '4.5s',
        image: '/cars/g63_3.jpg',
        gallery: ['/cars/g63_3.jpg', '/cars/g63_4.jpg', '/cars/g63_2.jpg', '/cars/g63_5.jpg', '/cars/g63_6.jpg', '/cars/g63_7.jpg'],
        coming_soon: false,
        sort_order: 7,
      },
    ];

    let inserted = 0;
    for (const car of cars) {
      const { rows: existing } = await sql`SELECT id FROM fleet WHERE name = ${car.name} LIMIT 1`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO fleet (name, nickname, rate, original_rate, description, specs, engine, hp, sprint, image, gallery, coming_soon, sort_order)
          VALUES (
            ${car.name},
            ${car.nickname},
            ${car.rate},
            ${car.original_rate},
            ${car.description},
            ${car.specs},
            ${car.engine},
            ${car.hp},
            ${car.sprint},
            ${car.image},
            ${car.gallery},
            ${car.coming_soon},
            ${car.sort_order}
          )
        `;
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fleet table ready. ${inserted} car(s) seeded.`,
    });
  } catch (err) {
    console.error('GET /api/fleet/setup error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
