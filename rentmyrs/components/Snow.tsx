'use client';

import { useEffect, useState } from 'react';

// Neige par-dessus la photo d'accueil, en trois plans pour la profondeur :
// au loin (petits, lents, pâles), au milieu, et tout près (gros, flous, rapides, peu nombreux).
// Chaque flocon tombe sur toute la hauteur et se balance doucement. Généré côté client,
// désactivé si la personne a demandé moins d'animations.
type Flake = { left: number; size: number; dur: number; delay: number; sway: number; swayDur: number; op: number; blur: number };

const LAYERS = [
  { share: 0.55, size: [1.5, 3], dur: [16, 26], op: [0.35, 0.6], blur: 0, sway: [8, 20] },
  { share: 0.35, size: [3, 5], dur: [10, 16], op: [0.55, 0.85], blur: 0.4, sway: [15, 35] },
  { share: 0.1, size: [7, 12], dur: [6, 9], op: [0.35, 0.6], blur: 2.5, sway: [25, 50] },
] as const;

const rand = ([a, b]: readonly [number, number]) => a + Math.random() * (b - a);

export default function Snow({ count = 110 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const n = window.innerWidth < 640 ? Math.round(count * 0.55) : count;
    const out: Flake[] = [];
    for (const l of LAYERS) {
      for (let i = 0; i < Math.round(n * l.share); i++) {
        const dur = rand(l.dur);
        out.push({
          left: Math.random() * 100,
          size: rand(l.size),
          dur,
          delay: -Math.random() * dur,
          sway: rand(l.sway) * (Math.random() < 0.5 ? -1 : 1),
          swayDur: rand([3, 6]),
          op: rand(l.op),
          blur: l.blur,
        });
      }
    }
    setFlakes(out);
  }, [count]);

  return (
    <div aria-hidden className="snow pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowfall"
          style={{ left: `${f.left}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
        >
          <span
            className="snowflake"
            style={{
              width: f.size,
              height: f.size,
              opacity: f.op,
              filter: f.blur ? `blur(${f.blur}px)` : undefined,
              animationDuration: `${f.swayDur}s`,
              animationDelay: `${-Math.random() * f.swayDur}s`,
              ['--sway' as string]: `${f.sway}px`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
