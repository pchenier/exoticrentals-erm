import postgres from 'postgres';

const url = (process.env.POSTGRES_URL || '').trim();

// Une valeur qui n'est pas une adresse postgres:// (ex. mauvaise variable collée) = pas de base,
// au lieu de faire planter tout le site.
const valid = /^postgres(ql)?:\/\/\S+$/.test(url);
if (url && !valid) console.error('db: POSTGRES_URL is not a postgres:// URL, database disabled');

// Connexion paresseuse : aucune base configurée = pas de connexion.
let client: ReturnType<typeof postgres> | null = null;
export function db() {
  if (!valid) return null;
  client ??= postgres(url, { ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(url) ? false : 'require', max: 1 });
  return client;
}
