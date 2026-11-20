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
      <p className="text-2xl font-light tracking-tight sm:text-3xl">
        {value}
        {unit && <span className="ml-1 text-base text-mute">{unit}</span>}
      </p>
      <p className="label mt-1 text-mute">{label}</p>
    </div>
  );
}

/** Nom de modèle avec petit drapeau rouge incliné devant « RS » (dans l'esprit des badges RS, pas le logo officiel). */
export function RsMark({ name, className = '' }: { name: string; className?: string }) {
  // RS3, RSQ8… et aussi R8 : même drapeau rouge devant.
  const m = /^(RS|R(?=\d))\s?(.*)$/.exec(name);
  if (!m) return <span className={`italic ${className}`}>{name}</span>;
  return (
    <span className={`inline-flex items-center gap-[0.14em] italic ${className}`}>
      <span aria-hidden className="rs-flag" />
      <span>
        {m[1]}
        {m[2] && <span className={m[1] === 'RS' ? 'ml-[0.14em]' : ''}>{m[2]}</span>}
      </span>
    </span>
  );
}

/** Bande « danger » jaune/noire en travers d'une photo (véhicule non disponible ou en entretien). */
export function HazardBand({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <div aria-hidden={false} className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-black/35">
      <div className={`hazard flex w-[140%] -rotate-6 items-center justify-center shadow-[0_6px_24px_rgba(0,0,0,.6)] ${small ? 'h-7' : 'h-12 sm:h-14'}`}>
        <span className={`bg-black font-bold uppercase text-[#ffd400] ${small ? 'px-2 py-0.5 text-[9px] tracking-[0.12em]' : 'label px-4 py-1.5 text-xs sm:text-sm'}`}>{label}</span>
      </div>
    </div>
  );
}
