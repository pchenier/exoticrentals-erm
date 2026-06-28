import postgres from 'postgres';

const connectionString = 'postgres://postgres.nmxwzdojtyidzloocmug:MPP9uIAoFFHKC1H1@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

const sql = postgres(connectionString, { ssl: 'require', max: 1 });

async function main() {
  // Check current state of fleet table
  const before = await sql`SELECT id, name, rate, original_rate FROM fleet ORDER BY sort_order`;
  console.log('\n=== BEFORE F1 PRICING ===');
  for (const car of before) {
    console.log(`  ${car.name}: rate=$${car.rate}, original_rate=$${car.original_rate ?? 'null'}`);
  }

  // Apply F1 week pricing:
  // 1. original_rate = rate (crossed-out "was" price)
  // 2. rate = rate * 2 (new doubled price)
  const updated = await sql`
    UPDATE fleet
    SET original_rate = rate,
        rate = rate * 2
    RETURNING id, name, original_rate, rate
  `;

  console.log('\n=== AFTER F1 PRICING ===');
  for (const car of updated) {
    console.log(`  ${car.name}: $${car.original_rate} → $${car.rate} (2x)`);
  }

  console.log(`\n✅ Updated ${updated.length} cars.`);
  await sql.end();
}

main().catch(err => { console.error(err); process.exit(1); });
