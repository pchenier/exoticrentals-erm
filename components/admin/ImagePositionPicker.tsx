"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

type Props = {
  imageSrc: string | null;
  value: string;
  onChange: (v: string) => void;
};

const ACCENT = "#c9a96e";

function parseValue(v: string): { x: number; y: number } {
  // Accept "center 65%", "50% 65%", "" => default 50/50
  if (!v) return { x: 50, y: 50 };
  const parts = v.trim().split(/\s+/);
  const map = (s: string): number => {
    if (!s) return 50;
    if (s === "center") return 50;
    if (s === "left" || s === "top") return 0;
    if (s === "right" || s === "bottom") return 100;
    const m = s.match(/(-?\d+(?:\.\d+)?)%/);
    if (m) return Math.max(0, Math.min(100, parseFloat(m[1])));
    return 50;
  };
  if (parts.length === 1) return { x: map(parts[0]), y: 50 };
  return { x: map(parts[0]), y: map(parts[1]) };
}

const round5 = (n: number) => Math.round(n / 5) * 5;

export default function ImagePositionPicker({ imageSrc, value, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const { x, y } = parseValue(value);
  const objPos = `${x}% ${y}%`;

  const updateFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;
    const cx = round5(Math.max(0, Math.min(100, px)));
    const cy = round5(Math.max(0, Math.min(100, py)));
    onChange(`${cx}% ${cy}%`);
  }, [onChange]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updateFromPoint(e.clientX, e.clientY);
    const onUp = () => setDragging(false);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updateFromPoint]);

  if (!imageSrc) {
    return (
      <div className="aspect-video w-full rounded border border-white/10 bg-black/40 flex items-center justify-center text-xs text-white/40">
        Add an image first
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        onMouseDown={(e) => { e.preventDefault(); setDragging(true); updateFromPoint(e.clientX, e.clientY); }}
        onTouchStart={(e) => {
          if (e.touches[0]) { setDragging(true); updateFromPoint(e.touches[0].clientX, e.touches[0].clientY); }
        }}
        className="relative aspect-video w-full overflow-hidden rounded border border-white/10 bg-black/40 cursor-crosshair select-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="focal preview"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: objPos }}
        />
        <div
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 shadow-lg pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            borderColor: ACCENT,
            background: "rgba(0,0,0,0.35)",
            boxShadow: `0 0 0 2px rgba(0,0,0,0.5), 0 0 8px ${ACCENT}`,
          }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/60">Focal: <span style={{ color: ACCENT }}>{objPos}</span></span>
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-white/50 hover:text-white underline underline-offset-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
