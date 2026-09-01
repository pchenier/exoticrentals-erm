"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper that is SAFE for SSR: children render fully visible
 * in the server HTML. After mount, on desktop hover devices we enable the
 * scroll-reveal animation. Touch devices and prefers-reduced-motion stay
 * static (iOS Safari freezes rAF during momentum scroll which made
 * whileInView reveals flash or stick at opacity:0).
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
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const isDesktopHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setCanAnimate(isDesktopHover && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  if (!canAnimate) {
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