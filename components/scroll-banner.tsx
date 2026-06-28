"use client";

import { usePathname } from "next/navigation";

const MESSAGES = [
  "🚗 White-glove delivery to your hotel or residence — 24/7",
  "💳 We accept Credit Card, Crypto, E-Transfer & Cash",
  "⭐ 20 exotic vehicles · Lambo, Ferrari, McLaren, Porsche, AMG, M-Power, RS",
  "📞 Book now: 438-533-9053",
];

export default function ScrollBanner() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items = [...MESSAGES, ...MESSAGES];
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full h-8 overflow-hidden bg-[#0a0a0a] border-b border-[#c9a96e]/30">
      <div className="group flex h-full">
        <div className="flex shrink-0 animate-[scroll_40s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
          {items.map((msg, i) => (
            <span
              key={i}
              className="flex items-center px-6 h-8 text-[11px] sm:text-xs tracking-wide text-white/90"
            >
              <span>{msg}</span>
              <span className="ml-6 text-[#c9a96e]">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
