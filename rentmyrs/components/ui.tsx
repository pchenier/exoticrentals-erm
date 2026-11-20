import Link from 'next/link';

type BtnProps = { href: string; children: React.ReactNode; variant?: 'solid' | 'ghost'; className?: string };

/** Bouton rectangulaire avec flèche, façon showroom. */
export function Btn({ href, children, variant = 'solid', className = '' }: BtnProps) {
  const base =
    'group inline-flex items-center gap-4 px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] transition';
  const look =
    variant === 'solid'
      ? 'bg-paper text-ink hover:bg-rs hover:text-paper'
      : 'border border-paper/40 text-paper hover:border-paper';
  const cls = `${base} ${look} ${className}`;
  const inner = (
    <>
      {children}
      <span aria-hidden className="transition group-hover:translate-x-1">→</span>
    </>
  );
  return href.startsWith('#') || href.startsWith('http') ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-[15px] font-semibold uppercase tracking-[0.2em]">
      RentMy
      <span className="slant px-2 py-0.5 text-[13px] font-bold italic tracking-normal"><span>RS</span></span>
    </span>
  );
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
