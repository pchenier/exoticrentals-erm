"use client";

import { useEffect, useRef } from "react";

/**
 * Light, low-cost snowfall drawn on a single <canvas>.
 * - Not rendered at all with prefers-reduced-motion or Save-Data.
 * - Pauses when off-screen or when the tab is hidden.
 * - Particle count scales with width (≈25 on phones, ≤80 on wide screens).
 */
export default function Snowfall({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      canvas.style.display = "none";
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Flake = { x: number; y: number; r: number; a: number; vy: number; phase: number; sway: number };
    let flakes: Flake[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;

    const spawn = (anywhere: boolean): Flake => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -5,
      r: 1 + Math.random() * 2,
      a: 0.35 + Math.random() * 0.5,
      vy: 18 + Math.random() * 32, // px per second
      phase: Math.random() * Math.PI * 2,
      sway: 6 + Math.random() * 14,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.max(20, Math.min(80, Math.round(w / 18)));
      while (flakes.length < target) flakes.push(spawn(true));
      flakes.length = target;
    };

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      for (const f of flakes) {
        f.y += f.vy * dt;
        f.phase += dt * 0.8;
        const x = f.x + Math.sin(f.phase) * f.sway;
        if (f.y > h + 5) Object.assign(f, spawn(false));
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
