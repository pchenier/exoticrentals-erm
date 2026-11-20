/**
 * Seasonal theme switch for the home page.
 *
 * To turn the winter look off: set `enabled: false` (one-line change), or just
 * let it expire — it switches itself off automatically after `until`.
 * An env override also works without a code change on Vercel:
 *   NEXT_PUBLIC_WINTER_THEME=off  -> force off
 *   NEXT_PUBLIC_WINTER_THEME=on   -> force on (ignores `until`)
 */
export const WINTER_THEME = {
  enabled: true,
  /** Last day (inclusive, Montreal time is close enough) the theme shows. */
  until: "2027-01-10",
};

export function isWinterThemeActive(now: Date = new Date()): boolean {
  const override = process.env.NEXT_PUBLIC_WINTER_THEME;
  if (override === "off") return false;
  if (override === "on") return true;
  if (!WINTER_THEME.enabled) return false;
  return now <= new Date(`${WINTER_THEME.until}T23:59:59-05:00`);
}
