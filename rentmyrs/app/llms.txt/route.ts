// /llms.txt : résumé factuel du site pour les moteurs IA (ChatGPT, Perplexity, Claude, Gemini). Voir https://llmstxt.org
import { SITE } from '@/lib/site';
import { getFleet } from '@/lib/fleet-store';
import { LAMBOS } from '@/lib/fleet';
import { AREAS, GUIDE, NORTH, NORTH_SHORE } from '@/lib/seo';
import { allPosts, postPath } from '@/lib/blog';

// Toujours lu à la demande : les photos et prix de /admin ne doivent jamais être remplacés par les valeurs du code lors d'une mise à jour.
export const dynamic = 'force-dynamic';

export async function GET() {
  const models = await getFleet();
  const u = (p: string) => `${SITE.url}${p}`;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.name} (rentmyrs.com) is an Audi RS rental service in Montreal, Quebec, Canada. It rents the Audi RS3, RS5 Sportback, RS7 Sportback (Stage 2) and RSQ8, plus a yellow Audi R8 V10 Plus, with delivery on request across Montreal, Laval, the North Shore (Rive-Nord), the South Shore and Montréal-Trudeau airport (YUL). Bookings are requests confirmed by text by the team; there is no online payment. Bilingual: French and English.`,
    '',
    '## Key facts',
    '',
    `- Location: Montréal, QC, Canada. Service area: ${AREAS.join(', ')}.`,
    `- North Shore (Rive-Nord) delivery on request: ${NORTH_SHORE.join(', ')}. Every model (RS3, RS5, RS7, RSQ8, R8) can be delivered there.`,
    `- Phone / text / WhatsApp: ${SITE.phoneDisplay} (${SITE.phone}).`,
    '- Requirements: 25 years or older, valid driver’s licence, proof of insurance, credit card in the driver’s name for the refundable security deposit.',
    '- Booking: request form on the website, by text or WhatsApp. Availability, licence and deposit are confirmed by text before the booking. No online payment or deposit online.',
    '- Winter: every car has quattro all-wheel drive and winter tires in the cold season (winter tires are mandatory in Quebec from December 1 to March 15).',
    `- Sister fleet: ${SITE.sister.name} (${SITE.sister.url}) for Lamborghini, McLaren and other exotic cars.`,
    '',
    '## Fleet and prices (CAD, per day, before taxes and delivery)',
    '',
    ...models.map((m) => {
      const price = m.dailyRate != null ? `$${m.dailyRate}/day` : 'price on request';
      const status = m.status && m.status !== 'available' ? ` Currently ${m.status === 'maintenance' ? 'in maintenance' : 'unavailable'}.` : '';
      return `- [${m.name}](${u(`/en/${m.slug.en}`)}): ${price}, $${m.deposit.toLocaleString('en-CA')} refundable deposit. ${m.specs.engine}, ${m.specs.hp} hp stock${m.badge ? ` (${m.badge.en} tune)` : ''}, 0-100 km/h ${m.specs.zeroTo100}, ${m.specs.seats} seats, quattro AWD. ${m.tagline.en}${status}`;
    }),
    ...LAMBOS.map((l) => `- ${l.name} (via ${SITE.sister.name}): from $${l.dailyRate.toLocaleString('en-CA')}/day, ${l.hp} hp.`),
    '',
    '## Pages',
    '',
    `- [Home (French)](${u('/')}): Location Audi RS à Montréal.`,
    `- [Home (English)](${u('/en')}): Audi RS rental in Montreal.`,
    `- [Audi RS rental guide and comparison (English)](${u(GUIDE.en)})`,
    `- [Guide : quelle Audi RS louer à Montréal (français)](${u(GUIDE.fr)})`,
    `- [Location Audi RS Rive-Nord (français)](${u(NORTH.fr)}): Laval, Terrebonne, Blainville, Boisbriand, Mirabel, Repentigny, Saint-Jérôme.`,
    `- [Audi RS rental North Shore Montreal (English)](${u(NORTH.en)})`,
    ...models.map((m) => `- [Location ${m.name} Montréal (français)](${u(`/${m.slug.fr}`)})`),
    '',
    '## Blog',
    '',
    ...allPosts().slice(0, 30).map((p) => `- [${p.title}](${u(postPath(p))}) (${p.locale.toUpperCase()}, ${p.date}): ${p.description}`),
    '',
    '## Optional',
    '',
    `- [Sitemap](${u('/sitemap.xml')})`,
    `- [${SITE.sister.name}](${SITE.sister.url}): exotic car rental in Montreal (Lamborghini, McLaren, Audi R8, more).`,
    '',
    'RentMyRS is an independent rental service, not affiliated with Audi AG.',
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' },
  });
}
