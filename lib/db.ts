import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = postgres(connectionString, { ssl: 'require', max: 1 } as any);

// Wrap postgres tagged-template to return { rows } like @vercel/postgres
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sql(strings: TemplateStringsArray, ...values: any[]): Promise<{ rows: any[] }> {
  // Build the SQL string with $1, $2, ... placeholders
  const query = strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ''),
    ''
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await client.unsafe(query, values as any[]);
  return { rows: Array.from(result) };
}
