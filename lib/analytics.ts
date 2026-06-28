// Google Analytics 4 event helpers for conversion tracking.
// These events are intended to be imported into Google Ads as conversions.
//
// Events fired:
//  - generate_lead   → booking form submit (PRIMARY conversion)
//  - phone_click     → tel: link click
//  - whatsapp_click  → wa.me link click
//
// Enhanced conversions: user data (email, phone) is SHA-256 hashed
// client-side before sending to Google Ads for better attribution.

type GtagParams = Record<string, unknown>;

function safeGtag(event: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* noop */
  }
}

/**
 * SHA-256 hash a string, returning lowercase hex.
 * Normalises per Google's enhanced conversions spec:
 *   - trim leading/trailing whitespace
 *   - lowercase for email
 *   - remove non-digit chars for phone, keep leading +
 */
async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalisePhone(phone: string): string {
  // Keep digits and leading + only
  const digits = phone.replace(/[^\d+]/g, "");
  // If it starts with 1 and has 11 digits (US/CA), prepend +
  if (/^1\d{10}$/.test(digits)) return `+${digits}`;
  // If already has + prefix, keep it
  if (digits.startsWith("+")) return digits;
  // Otherwise assume CA local number, prepend +1
  if (/^\d{10}$/.test(digits)) return `+1${digits}`;
  return digits;
}

export function trackGenerateLead(params: GtagParams = {}) {
  safeGtag("generate_lead", {
    event_category: "engagement",
    event_label: "booking_form_submit",
    currency: "CAD",
    ...params,
  });
}

const GOOGLE_ADS_CONVERSION_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
  "AW-18142334755/dhMBCK618akcEKOe-MpD";

export async function trackBookingConversion(payload?: {
  car?: string;
  pickup_date?: string;
  return_date?: string;
  value?: number;
  redirectUrl?: string;
  /** User email for enhanced conversions (hashed before sending) */
  email?: string;
  /** User phone for enhanced conversions (hashed before sending) */
  phone?: string;
}) {
  // GA4 lead event
  trackGenerateLead({
    event_label: "booking_form_submit",
    car: payload?.car,
    pickup_date: payload?.pickup_date,
    return_date: payload?.return_date,
  });

  if (typeof window === "undefined") return;

  const redirectUrl = payload?.redirectUrl;
  let redirected = false;
  const doRedirect = () => {
    if (redirected || !redirectUrl) return;
    redirected = true;
    window.location.href = redirectUrl;
  };

  // Build enhanced conversion user_data with SHA-256 hashed PII
  const userData: Record<string, string> = {};
  try {
    if (payload?.email) {
      const emailHash = await sha256(normaliseEmail(payload.email));
      userData.em = emailHash;
    }
    if (payload?.phone) {
      const phoneHash = await sha256(normalisePhone(payload.phone));
      userData.ph = phoneHash;
    }
  } catch {
    /* hashing failed, proceed without user_data */
  }

  try {
    const conversionParams: Record<string, unknown> = {
      send_to: GOOGLE_ADS_CONVERSION_ID,
      value: payload?.value ?? 100,
      currency: "CAD",
      event_callback: doRedirect,
    };

    // Include hashed user data for enhanced conversions
    if (Object.keys(userData).length > 0) {
      conversionParams.user_data = userData;
    }

    window.gtag?.("event", "conversion", conversionParams);
  } catch {
    /* noop */
  }

  // Safety net: redirect after 1s in case gtag callback never fires
  if (redirectUrl) {
    setTimeout(doRedirect, 1000);
  }
}

export function trackPhoneClick(label = "phone_438_533_9053") {
  safeGtag("phone_click", {
    event_category: "contact",
    event_label: label,
  });
}

export function trackWhatsAppClick(label = "whatsapp_438_533_9053") {
  safeGtag("whatsapp_click", {
    event_category: "contact",
    event_label: label,
  });
}

export function trackSmsClick(label = "sms_438_533_9053") {
  safeGtag("phone_click", {
    event_category: "contact",
    event_label: label,
  });
}
