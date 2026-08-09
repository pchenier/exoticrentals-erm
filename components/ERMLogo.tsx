"use client";

interface ERMLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  animated?: boolean;
}

export default function ERMLogo({ size = "md", showWordmark = true }: ERMLogoProps) {
  const heights = {
    sm: "h-24",
    md: "h-32",
    lg: "h-48",
    xl: "h-64",
  };

  return (
    <img
      src="/erm-logo-new.png"
      alt="Exotic Rentals Montreal"
      className={`${heights[size]} w-auto`}
    />
  );
}