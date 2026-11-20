/**
 * Draped string of warm holiday lights (pure SVG + CSS, no JS).
 * Palette stays on-brand: champagne gold, warm white, burgundy, pine.
 * Twinkle is CSS-only and disabled under prefers-reduced-motion.
 */
const COLORS = ["#D4BC9A", "#FFF1D6", "#A8323F", "#3E7A5E"];
const SWAG_W = 200;
const TOP = 4;
const SAG = 46;

function swagPoint(x0: number, t: number) {
  // Quadratic curve from (x0, TOP) via control (x0+100, TOP+2*SAG) to (x0+200, TOP)
  const x = x0 + SWAG_W * t;
  const y = TOP + 2 * (1 - t) * t * (2 * SAG);
  return { x, y };
}

function Lights({ swags }: { swags: number }) {
  const width = swags * SWAG_W;
  const height = TOP + SAG + 22;
  const bulbs: { x: number; y: number; c: string; d: number }[] = [];
  let k = 0;
  for (let s = 0; s < swags; s++) {
    for (const t of [0.14, 0.32, 0.5, 0.68, 0.86]) {
      const p = swagPoint(s * SWAG_W, t);
      bulbs.push({ ...p, c: COLORS[k % COLORS.length], d: (k * 0.37) % 2.4 });
      k++;
    }
  }
  const wire = Array.from({ length: swags }, (_, s) => {
    const x0 = s * SWAG_W;
    return `M${x0},${TOP} Q${x0 + SWAG_W / 2},${TOP + 2 * SAG} ${x0 + SWAG_W},${TOP}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block" aria-hidden="true">
      <defs>
        <filter id={`glow-${swags}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <path d={wire} fill="none" stroke="#1f2a22" strokeWidth="1.6" opacity="0.9" />
      {Array.from({ length: swags + 1 }, (_, s) => (
        <circle key={`hook-${s}`} cx={s * SWAG_W} cy={TOP} r="2.2" fill="#D4BC9A" opacity="0.8" />
      ))}
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          <rect x="-1.6" y="0" width="3.2" height="3" fill="#2b2b2b" />
          <g className="erm-twinkle" style={{ animationDelay: `${b.d}s` }}>
            <ellipse cx="0" cy="9" rx="6" ry="7.5" fill={b.c} opacity="0.55" filter={`url(#glow-${swags})`} />
            <ellipse cx="0" cy="8.5" rx="3" ry="5" fill={b.c} />
            <ellipse cx="-0.9" cy="6.8" rx="0.9" ry="1.6" fill="#fff" opacity="0.6" />
          </g>
        </g>
      ))}
    </svg>
  );
}

export default function Garland({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="md:hidden"><Lights swags={3} /></div>
      <div className="hidden md:block"><Lights swags={7} /></div>
    </div>
  );
}
