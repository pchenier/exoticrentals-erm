'use client';

import { useState } from 'react';

interface CarRates {
  rate: number;
  original_rate: number | null;
  rate_3d: number | null;
  rate_7d: number | null;
  rate_14d: number | null;
  rate_30d: number | null;
}

const DURATIONS = [
  { key: '1d', label: '1 Day', days: 1, field: null as string | null },
  { key: '3d', label: '3 Days', days: 3, field: 'rate_3d' },
  { key: '7d', label: '7 Days', days: 7, field: 'rate_7d' },
  { key: '14d', label: '14 Days', days: 14, field: 'rate_14d' },
  { key: '30d', label: '30 Days', days: 30, field: 'rate_30d' },
] as const;

export default function DurationPicker({ car }: { car: CarRates }) {
  const [selected, setSelected] = useState('1d');

  const current = DURATIONS.find(d => d.key === selected) ?? DURATIONS[0];
  const price: number | null = current.field
    ? (car[current.field as keyof CarRates] as number | null) ?? null
    : car.rate;
  const total = price ? price * current.days : null;

  const available = DURATIONS.filter(d => {
    if (!d.field) return true;
    const val = car[d.field as keyof CarRates] as number | null;
    return val != null && val > 0;
  });

  if (available.length <= 1) {
    return (
      <>
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-2 font-light">Daily Rate</p>
        <div className="flex items-baseline gap-1 mb-2">
          {car.original_rate && (
            <span className="text-sm text-white/30 line-through mr-2">${car.original_rate.toLocaleString()}</span>
          )}
          <span className="font-display text-5xl font-light text-[#c9a96e]">${car.rate.toLocaleString()}</span>
          <span className="text-xs text-white/30 tracking-wide">/ day</span>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-3 font-light">Select Duration</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {available.map(d => (
          <button
            key={d.key}
            onClick={() => setSelected(d.key)}
            className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-light border transition-all duration-200 ${
              selected === d.key
                ? 'border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5'
                : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        {car.original_rate && selected === '1d' && (
          <span className="text-sm text-white/30 line-through">${car.original_rate.toLocaleString()}</span>
        )}
        <span className="font-display text-5xl font-light text-[#c9a96e]">
          ${price != null ? price.toLocaleString() : car.rate.toLocaleString()}
        </span>
        <span className="text-xs text-white/30 tracking-wide">/ day</span>
      </div>
      {total != null && current.days > 1 && (
        <div className="mb-1">
          <span className="text-[11px] text-white/40 tracking-wide">${total.toLocaleString()} total</span>
          <span className="text-white/10 mx-1">·</span>
          <span className="text-[10px] text-[#c9a96e]/60 tracking-wide">
            Save ${((car.rate * current.days) - total).toLocaleString()} vs daily
          </span>
        </div>
      )}
    </>
  );
}