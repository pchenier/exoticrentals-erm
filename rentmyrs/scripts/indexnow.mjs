// Soumet toutes les URL du sitemap de rentmyrs.com à IndexNow (Bing, Yandex, Seznam, Naver...).
// Usage : node scripts/indexnow.mjs [url ...]   (à lancer après chaque publication/mise à jour d'article, une fois le déploiement en ligne)
import fs from 'node:fs';
import path from 'node:path';

const HOST = 'www.rentmyrs.com';
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public');
const keyFile = fs.readdirSync(dir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('Clé IndexNow introuvable dans public/');
const key = keyFile.replace('.txt', '');

// URL passées en argument, sinon toutes celles du sitemap.
let urlList = process.argv.slice(2).filter((u) => u.startsWith(`https://${HOST}/`));
if (!urlList.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (!urlList.length) throw new Error('Sitemap vide ou inaccessible');

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow : ${urlList.length} URL, réponse ${res.status}`);
if (res.status >= 400) process.exit(1);
