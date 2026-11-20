import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';
import { Btn, RsMark, Stat, HazardBand } from './ui';

export const money = (n: number, locale: Locale) => n.toLocaleString(locale === 'fr' ? 'fr-CA' : 'en-CA');
export const accel = (m: RsModel, locale: Locale) =>
  (locale === 'fr' ? m.specs.zeroTo100.replace('.', ',') : m.specs.zeroTo100).replace(' s', '');
export const modelHref = (m: RsModel, locale: Locale) => `${locale === 'fr' ? '' : '/en'}/${m.slug[locale]}`;

export function Badge({ model, locale }: { model: RsModel; locale: Locale }) {
  if (!model.badge) return null;
  return (
    <span className="slant px-2.5 py-1 text-xs font-bold italic uppercase tracking-wider">
      <span>{model.badge[locale]}</span>
    </span>
  );
}

/** Ruban jaune/noir par-dessus la photo quand le véhicule n'est pas disponible. */
export function StatusBand({ model, locale }: { model: RsModel; locale: Locale }) {
  if (!model.status || model.status === 'available') return null;
  const d = t(locale).fleet;
  return <HazardBand label={model.status === 'maintenance' ? d.maintenance : d.unavailable} />;
}

export function StatusTag({ model, locale }: { model: RsModel; locale: Locale }) {
  if (!model.status || model.status === 'available') return null;
  const d = t(locale).fleet;
  return (
    <span className="label border border-paper/40 bg-black/60 px-2.5 py-1 text-paper">
      {model.status === 'maintenance' ? d.maintenance : d.unavailable}
    </span>
  );
}

/** Photo bord à bord (pas de bandes floues), cadrée sur le point choisi dans /admin (X/Y), sinon un peu sous le centre où se trouve l'auto. */
export function WholeImage({ src, alt, sizes, priority = false, focus }: { src: string; alt: string; sizes: string; priority?: boolean; focus?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      style={{ objectPosition: focus ?? '50% 60%' }}
      className="object-cover transition duration-700 group-hover:scale-[1.03]"
    />
  );
}

export function ModelVisual({ model, priority = false, sizes, index = 0 }: { model: RsModel; priority?: boolean; sizes: string; index?: number }) {
  const src = model.images[index];
  if (src) {
    const focus = model.focuses?.[src] ?? (index === 0 ? model.focus : undefined);
    return <WholeImage src={src} alt={model.name} sizes={sizes} priority={priority} focus={focus} />;
  }
  // Pas encore de photo : grand nom du modèle en filigrane.
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,#1c1c1e,#000_70%)]">
      <span className="select-none text-[22vw] wide font-bold leading-none tracking-tight text-white/[0.07] lg:text-[12vw]">
        {model.short}
      </span>
    </div>
  );
}

/** Bande pleine largeur pour un modèle : photo d'un côté, chiffres de l'autre. */
export default function ModelRow({ model, locale, flip = false }: { model: RsModel; locale: Locale; flip?: boolean }) {
  const d = t(locale);
  return (
    <article className="group grid border-t border-line lg:grid-cols-2">
      <Link href={modelHref(model, locale)} className={`relative block aspect-[3/2] overflow-hidden bg-black lg:aspect-auto lg:min-h-[420px] ${flip ? 'lg:order-2' : ''}`}>
        <ModelVisual model={model} sizes="(min-width: 1024px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-14 lg:py-10">
        <div className="flex items-center gap-4">
          <p className="label text-mute">{model.body[locale]}</p>
          <Badge model={model} locale={locale} />
          <StatusTag model={model} locale={locale} />
        </div>
        <h3 className="mt-3 wide text-4xl font-bold leading-none tracking-tight sm:text-5xl"><RsMark name={model.short} /></h3>
        <p className="mt-3 max-w-md font-light text-paper/80">{model.tagline[locale]}</p>
        <div className="mt-6 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-5">
          <Stat value={String(model.specs.hp)} unit={d.fleet.hp} label={d.model.power.split(' (')[0]} />
          <Stat value={accel(model, locale)} unit="s" label="0-100 km/h" />
          {model.dailyRate != null ? (
            <Stat value={money(model.dailyRate, locale)} unit="$" label={d.fleet.perDayLabel} />
          ) : (
            <Stat value="—" label={d.fleet.onRequest} />
          )}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Btn href={modelHref(model, locale)}>{d.fleet.details}</Btn>
        </div>
      </div>
    </article>
  );
}

/** Carte compacte pour la grille de l'accueil : photo entière en haut, infos en dessous. */
export function ModelTile({ model, locale }: { model: RsModel; locale: Locale }) {
  const d = t(locale);
  const href = modelHref(model, locale);
  return (
    <article className="group flex flex-col border border-line bg-ink transition duration-300 hover:-translate-y-1 hover:border-paper/30 active:translate-y-0 active:scale-[0.97] active:duration-100">
      <Link href={href} className="relative block aspect-[3/2] overflow-hidden bg-black">
        <ModelVisual model={model} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        <StatusBand model={model} locale={locale} />
        <div className="absolute left-3 top-3 z-20 flex gap-2">
          <Badge model={model} locale={locale} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="label text-mute">{model.body[locale]}</p>
        <h3 className="mt-2 wide text-3xl font-bold leading-none tracking-tight">
          <Link href={href}><RsMark name={model.short} /></Link>
        </h3>
        <p className="mt-3 text-sm font-light text-paper/75">{model.tagline[locale]}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div>
            <dt className="label text-[10px] text-mute">{d.model.power.split(' (')[0]}</dt>
            <dd className="mt-1 font-light">{model.specs.hp} {d.fleet.hp}</dd>
          </div>
          <div>
            <dt className="label text-[10px] text-mute">0-100 km/h</dt>
            <dd className="mt-1 font-light">{accel(model, locale)} s</dd>
          </div>
        </dl>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p>
            <span className="text-2xl font-light tracking-tight">
              {model.dailyRate != null ? `${money(model.dailyRate, locale)} $` : '—'}
            </span>
            <span className="label ml-1 text-[10px] text-mute">{model.dailyRate != null ? d.fleet.perDay : d.fleet.onRequest}</span>
          </p>
          <Link href={href} className="label inline-flex items-center gap-2 text-paper transition group-hover:text-rs">
            {d.fleet.details}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
