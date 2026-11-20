import Link from 'next/link';

type BtnProps = { href: string; children: React.ReactNode; variant?: 'solid' | 'ghost'; className?: string };

/** Bouton rectangulaire avec flèche, façon showroom. */
export function Btn({ href, children, variant = 'solid', className = '' }: BtnProps) {
  const base =
    'cta group inline-flex items-center gap-4 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.16em]';
  const look =
    variant === 'solid'
      ? 'cta-idle bg-rs text-paper hover:bg-paper hover:text-ink'
      : 'bg-white/15 text-paper backdrop-blur-sm hover:bg-paper hover:text-ink';
  const cls = `${base} ${look} ${className}`;
  const inner = (
    <>
      {children}
      <span aria-hidden className="text-base transition-transform duration-200 group-hover:translate-x-1.5">→</span>
    </>
  );
  return href.startsWith('#') || href.startsWith('http') ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

export function Logo({ className = "h-9 sm:h-11" }: { className?: string }) {
  // Logo officiel (fond transparent) : public/logo.png
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="RentMyRS" width={594} height={160} className={`${className} w-auto`} />;
}

/** Grand chiffre + petite étiquette. */
export function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-light tracking-tight sm:text-4xl">
        {value}
        {unit && <span className="ml-1 text-base text-mute">{unit}</span>}
      </p>
      <p className="label mt-1 text-mute">{label}</p>
    </div>
  );
}

/** Nom de modèle avec petit drapeau rouge incliné devant « RS » (dans l'esprit des badges RS, pas le logo officiel). */
export function RsMark({ name, className = '' }: { name: string; className?: string }) {
  const m = /^RS\s?(.*)$/.exec(name);
  if (!m) return <>{name}</>;
  return (
    <span className={`inline-flex items-center gap-[0.14em] italic ${className}`}>
      <span aria-hidden className="rs-flag" />
      <span>
        RS{m[1] && <span className="ml-[0.14em]">{m[1]}</span>}
      </span>
    </span>
  );
}
