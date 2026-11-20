'use client';

import { useEffect, useState } from 'react';

// Flocons qui tombent par-dessus la photo d'accueil. Générés côté client (pas d'écart d'hydratation),
// désactivés si la personne a demandé moins d'animations.
type Flake = { left: number; size: number; dur: number; delay: number; drift: number; op: number };

export default function Snow({ count = 70 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const n = window.innerWidth < 640 ? Math.round(count * 0.6) : count;
    setFlakes(
      Array.from({ length: n }, () => ({
        left: Math.random() * 100,
        size: 3 + Math.random() * 5,
        dur: 8 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: (Math.random() - 0.5) * 80,
        op: 0.5 + Math.random() * 0.5,
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.op,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
