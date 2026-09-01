"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper that disables itself on touch devices.
 * iOS Safari pauses requestAnimationFrame during momentum scroll, which makes
 * framer-motion whileInView animations freeze mid-way and "flash" to their final
 * position when scrolling stops. On touch devices we render static content instead.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  const disabled = prefersReducedMotion || isTouch;

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}