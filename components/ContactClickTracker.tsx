"use client";

import { useEffect } from "react";

/**
 * Site-wide contact click tracking (delegated listener).
 * Catches every wa.me / tel: / sms: / mailto: click on any page,
 * including server components that can't use onClick.
 * Fires GA4 events + the Google Ads Contact conversion (once per channel per session).
 */

const CONTACT_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
  "AW-18142334755/ed45CJ_V1IEdEKOe-MpD";

const fired = new Set<string>();

export default function ContactClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href") || "";

      let channel: string | null = null;
      if (href.startsWith("https://wa.me/") || href.includes("whatsapp")) channel = "whatsapp";
      else if (href.startsWith("tel:")) channel = "phone";
      else if (href.startsWith("sms:")) channel = "sms";
      else if (href.startsWith("mailto:")) channel = "email";
      if (!channel) return;

      // GA4 event (every click — good for funnel analysis)
      window.gtag?.("event", channel + "_click", {
        event_category: "contact",
        event_label: href,
        page_location: window.location.pathname,
      });

      // Google Ads Contact conversion — once per channel per session
      if (!fired.has(channel)) {
        fired.add(channel);
        window.gtag?.("event", "conversion", {
          send_to: CONTACT_CONVERSION_SEND_TO,
          event_label: channel,
        });
      }
    };

    document.addEventListener("click", handler, { passive: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
