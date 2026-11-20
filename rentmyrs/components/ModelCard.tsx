import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';
import { Btn, Stat } from './ui';

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

export function StatusTag({ model, locale }: { model: RsModel; locale: Locale }) {
  if (!model.status || model.status === 'available') return null;
  const d = t(locale).fleet;
  return (
    <span className="label border border-paper/40 bg-black/60 px-2.5 py-1 text-paper">
      {model.status === 'maintenance' ? d.maintenance : d.unavailable}
    </span>
  );
}

export function ModelVisual({ model, priority = false, sizes, index = 0 }: { model: RsModel; priority?: boolean; sizes: string; index?: number }) {
  const src = model.images[index];
  if (src) {
    return (
      <Image
        src={src}
        alt={model.name}
        fill
        priority={priority}
        sizes={sizes}
        style={index === 0 && model.focus ? { objectPosition: model.focus } : undefined}
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
      />
    );
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
      <Link href={modelHref(model, locale)} className={`relative block aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[620px] ${flip ? 'lg:order-2' : ''}`}>
        <ModelVisual model={model} sizes="(min-width: 1024px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-16 lg:py-20">
        <div className="flex items-center gap-4">
          <p className="label text-mute">{model.body[locale]}</p>
          <Badge model={model} locale={locale} />
          <StatusTag model={model} locale={locale} />
        </div>
        <h3 className="mt-4 wide text-6xl font-bold leading-none tracking-tight sm:text-8xl">{model.short}</h3>
        <p className="mt-5 max-w-md text-lg font-light text-paper/80">{model.tagline[locale]}</p>
        <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
          <Stat value={String(model.specs.hp)} unit={d.fleet.hp} label={d.model.power.split(' (')[0]} />
          <Stat value={accel(model, locale)} unit="s" label="0-100 km/h" />
          {model.dailyRate != null ? (
            <Stat value={money(model.dailyRate, locale)} unit="$" label={d.fleet.perDayLabel} />
          ) : (
            <Stat value="—" label={d.fleet.onRequest} />
          )}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Btn href={modelHref(model, locale)}>{d.fleet.details}</Btn>
        </div>
      </div>
    </article>
  );
}
