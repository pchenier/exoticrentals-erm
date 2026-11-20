import postgres from 'postgres';

const url = process.env.POSTGRES_URL || '';

// Connexion paresseuse : aucune base configurée = pas de connexion.
let client: ReturnType<typeof postgres> | null = null;
export function db() {
  if (!url) return null;
  client ??= postgres(url, { ssl: /@(localhost|127\.0\.0\.1)[:\/]/.test(url) ? false : 'require', max: 1 });
  return client;
}
