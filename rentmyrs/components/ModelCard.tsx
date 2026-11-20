import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/site';
import type { RsModel } from '@/lib/fleet';
import { t } from '@/lib/dict';

export function Deposit({ model, locale }: { model: RsModel; locale: Locale }) {
  return (
    <span className="text-sm text-mute">
      {t(locale).fleet.deposit} : {model.deposit.toLocaleString(locale === 'fr' ? 'fr-CA' : 'en-CA')} $
    </span>
  );
}

export function Price({ model, locale }: { model: RsModel; locale: Locale }) {
  const d = t(locale).fleet;
  if (model.dailyRate == null) return <span className="text-sm text-mute">{d.onRequest}</span>;
  return (
    <span className="text-sm">
      <span className="text-mute">{d.from} </span>
      <span className="font-semibold">{model.dailyRate.toLocaleString(locale === 'fr' ? 'fr-CA' : 'en-CA')} $</span>
      <span className="text-mute">{d.perDay}</span>
    </span>
  );
}

export function ModelVisual({ model, priority = false, sizes }: { model: RsModel; priority?: boolean; sizes: string }) {
  if (model.images[0]) {
    return (
      <Image
        src={model.images[0]}
        alt={model.name}
        fill
        priority={priority}
        sizes={sizes}
        style={model.focus ? { objectPosition: model.focus } : undefined}
        className="object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }
  // Pas encore de photo : on affiche le badge du modèle.
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#2a2a2e,#0a0a0b_70%)]">
      <span className="text-7xl font-black italic tracking-tighter text-paper/90">
        <span className="text-rs">RS</span>
        {model.short.replace('RS', '')}
      </span>
    </div>
  );
}

export default function ModelCard({ model, locale }: { model: RsModel; locale: Locale }) {
  const d = t(locale).fleet;
  const href = `${locale === 'fr' ? '' : '/en'}/${model.slug[locale]}`;
  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl border border-line bg-panel transition hover:border-rs/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ModelVisual model={model} sizes="(min-width: 1024px) 50vw, 100vw" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs text-mute backdrop-blur">
          {model.body[locale]}
        </span>
        {model.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-rs px-3 py-1 text-xs font-bold italic text-white">
            {model.badge[locale]}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-semibold">{model.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-rs">
            {model.specs.hp} {d.hp}
          </span>
        </div>
        <p className="mt-1 text-sm text-mute">{model.tagline[locale]}</p>
        <div className="mt-4 flex items-center justify-between">
          <Price model={model} locale={locale} />
          <span className="text-sm font-medium group-hover:text-rs">{d.details} →</span>
        </div>
      </div>
    </Link>
  );
}
