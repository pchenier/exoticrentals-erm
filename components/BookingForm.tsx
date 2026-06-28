"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";
import { trackBookingConversion } from "@/lib/analytics";

interface FleetCar {
  id: number;
  name: string;
  sort_order: number;
}

interface BookingFormProps {
  defaultCar?: string;
}

// ─── DatePickerInput ──────────────────────────────────────────────────────────
interface DatePickerInputProps {
  label: string;
  value: string; // "YYYY-MM-DD" or ""
  onChange: (val: string) => void;
  disabled: Matcher[];
  placeholder?: string;
  /** If provided, calendar starts on this month instead of the current one */
  defaultMonth?: Date;
  modifiers?: Record<string, Matcher | Matcher[]>;
  modifiersClassNames?: Record<string, string>;
}

function DatePickerInput({
  label,
  value,
  onChange,
  disabled,
  placeholder = "Select date",
  defaultMonth,
  modifiers,
  modifiersClassNames,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Parse the stored "YYYY-MM-DD" string back into a local Date for DayPicker
  const selected: Date | undefined = value
    ? (() => {
        const [y, m, d] = value.split("-").map(Number);
        return new Date(y, m - 1, d);
      })()
    : undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const labelClass =
    "block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2";
  const inputClass =
    "w-full bg-[#1a1a1a] border border-white/10 focus:border-[#c9a96e]/50 focus:outline-none text-white text-sm px-4 py-3 transition-colors duration-200 cursor-pointer select-none";

  return (
    <div ref={ref} className="relative">
      <label className={labelClass}>{label}</label>

      {/* Trigger */}
      <div
        className={inputClass}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((v) => !v)}
      >
        {value ? (
          value
        ) : (
          <span className="text-white/20">{placeholder}</span>
        )}
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 border border-white/10 shadow-2xl"
          style={
            {
              background: "#161616",
              /* Override react-day-picker CSS variables for dark theme */
              "--rdp-accent-color": "#c9a96e",
              "--rdp-accent-background-color": "rgba(201,169,110,0.15)",
              "--rdp-day_button-border-radius": "2px",
              "--rdp-today-color": "#c9a96e",
              "--rdp-outside-opacity": "0.3",
              "--rdp-disabled-opacity": "0.25",
            } as React.CSSProperties
          }
        >
          {/* Extra dark-theme overrides injected via a style tag per instance */}
          <style>{`
            .rdp-root {
              color: #fff;
              font-size: 13px;
              padding: 12px;
            }
            .rdp-month_caption {
              color: #c9a96e;
              font-size: 11px;
              letter-spacing: 0.25em;
              text-transform: uppercase;
            }
            .rdp-weekday {
              color: rgba(255,255,255,0.3);
              font-size: 10px;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }
            .rdp-day_button {
              color: #fff;
            }
            .rdp-day_button:hover:not([disabled]) {
              background: rgba(201,169,110,0.2) !important;
              color: #c9a96e;
            }
            .rdp-selected .rdp-day_button {
              background: #c9a96e !important;
              color: #000 !important;
            }
            .rdp-nav button {
              color: #c9a96e;
            }
            .rdp-nav button:hover {
              background: rgba(201,169,110,0.15);
            }
            .rdp-disabled .rdp-day_button {
              color: rgba(255,255,255,0.15) !important;
              cursor: not-allowed;
            }
            .rdp-day_past {
              opacity: 0.3 !important;
            }
          `}</style>

          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={defaultMonth ?? selected ?? new Date()}
            onSelect={(date) => {
              if (!date) return;
              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, "0");
              const d = String(date.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${d}`);
              setOpen(false);
            }}
            disabled={disabled}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        </div>
      )}
    </div>
  );
}

// ─── BookingForm ──────────────────────────────────────────────────────────────
export default function BookingForm({ defaultCar = "" }: BookingFormProps) {
  const [vehicles, setVehicles] = useState<string[]>([]);

  // Fetch fleet from API
  useEffect(() => {
    fetch("/api/fleet")
      .then((r) => r.json())
      .then((data: FleetCar[]) => {
        const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order);
        setVehicles(sorted.map((c) => c.name));
      })
      .catch(() => {
        setVehicles([
          "Audi RS5",
          "Audi RS6",
          "Audi RS7",
          "BMW M5 Competition",
          "Audi R8",
          "McLaren 600LT",
          "Lamborghini Urus",
          "Mercedes G63 AMG",
        ]);
      });
  }, []);

  const [form, setForm] = useState({
    name: "",
    vehicle: defaultCar,
    phone: "",
    sms_consent: false,
  });

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");


  // Read ?car= URL param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const carParam = params.get("car");
      if (carParam) {
        setForm((prev) => ({ ...prev, vehicle: carParam }));
      }
    }
  }, []);

  // Sync when parent pre-selects a car
  useEffect(() => {
    if (defaultCar) {
      setForm((prev) => ({ ...prev, vehicle: defaultCar }));
    }
  }, [defaultCar]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      // Send SMS notification via OpenPhone
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          data: {
            name: form.name,
            phone: form.phone,
            vehicle: form.vehicle,
            pickup_date: pickupDate,
            return_date: returnDate,
          },
        }),
      });
      // Save booking to DB
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_name: form.vehicle,
          client_name: form.name,
          client_phone: form.phone,
          pickup_date: pickupDate,
          return_date: returnDate,
          status: "pending",
          sms_consent: form.sms_consent,
        }),
      });
      // Fire GA4 generate_lead + Google Ads conversion (with enhanced conversions PII)
      trackBookingConversion({
        car: form.vehicle,
        pickup_date: pickupDate,
        return_date: returnDate,
        phone: form.phone,
      });
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or text us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  // Today at midnight (local) — used to disable past dates
  const today = todayMidnight();

  // Disabled matchers for pickup: before today only
  const pickupDisabled: Matcher[] = [{ before: today }];

  // Disabled matchers for return: before day after pickup (or tomorrow)
  const minReturn = pickupDate
    ? addDays(parseLocalDate(pickupDate), 1)
    : addDays(today, 1);
  const returnDisabled: Matcher[] = [{ before: minReturn }];

  const inputClass =
    "w-full bg-[#1a1a1a] border border-white/10 focus:border-[#c9a96e]/50 focus:outline-none text-white text-sm px-4 py-3 transition-colors duration-200 placeholder:text-white/20";
  const labelClass =
    "block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2";

  return (
    <section
      id="booking"
      className="relative bg-[#0f0f0f] border-t border-[#c9a96e]/20 py-24 px-6"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#c9a96e]/[0.02] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e] font-light">
            Inquire Now
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white font-light tracking-wider mt-3">
            RESERVE YOUR VEHICLE
          </h2>
          <div className="w-16 h-px bg-[#c9a96e]/50 mx-auto mt-6" />
        </div>

        {/* Success state */}
        {submitted && (
          <div className="text-center py-12 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border border-[#c9a96e]/40 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-white font-light tracking-wider">Request Received</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              We&apos;ll be in touch shortly —<br />check your phone for a confirmation.
            </p>
            <div className="w-16 h-px bg-[#c9a96e]/30 mx-auto" />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={`space-y-6 ${submitted ? "hidden" : ""}`}>
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          {/* Vehicle */}
          <div>
            <label htmlFor="vehicle" className={labelClass}>
              Vehicle
            </label>
            <select
              id="vehicle"
              name="vehicle"
              required
              value={form.vehicle}
              onChange={handleChange}
              className={`${inputClass} appearance-none cursor-pointer`}
              style={{ backgroundImage: "none" }}
            >
              <option value="" disabled className="bg-[#1a1a1a] text-white/40">
                Select a vehicle
              </option>
              {vehicles.map((v) => (
                <option key={v} value={v} className="bg-[#1a1a1a] text-white">
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup + Return dates */}
          <div className="grid grid-cols-2 gap-4">
            <DatePickerInput
              label="Pickup Date"
              value={pickupDate}
              onChange={(val) => {
                setPickupDate(val);
                if (returnDate && returnDate <= val) setReturnDate("");
              }}
              disabled={pickupDisabled}
              placeholder="YYYY-MM-DD"
              modifiers={{ past: { before: today } }}
              modifiersClassNames={{ past: "rdp-day_past" }}
            />
            <DatePickerInput
              label="Return Date"
              value={returnDate}
              onChange={setReturnDate}
              disabled={returnDisabled}
              placeholder="YYYY-MM-DD"
              defaultMonth={pickupDate ? parseLocalDate(pickupDate) : undefined}
              modifiers={{ past: { before: today } }}
              modifiersClassNames={{ past: "rdp-day_past" }}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (514) 000-0000"
              className={inputClass}
            />
          </div>

          {/* Payment Methods */}
          <div className="pt-2">
            <p className={labelClass}>Accepted Payments</p>
            <div className="flex flex-wrap gap-2">
              {["Credit Card", "Crypto", "E-Transfer", "Cash"].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 border border-white/10 text-white/50 text-[10px] tracking-[0.15em] uppercase"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* SMS Consent */}
          <div className="flex items-start gap-3 pt-1">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                id="sms_consent"
                name="sms_consent"
                type="checkbox"
                checked={form.sms_consent}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div
                onClick={() => setForm((prev) => ({ ...prev, sms_consent: !prev.sms_consent }))}
                className="w-4 h-4 border border-white/20 bg-[#1a1a1a] cursor-pointer peer-focus:border-[#c9a96e]/50 flex items-center justify-center transition-colors duration-200"
                style={{ minWidth: "1rem" }}
              >
                {form.sms_consent && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5 5 4 7.5 8.5 2" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <label
              htmlFor="sms_consent"
              className="text-[10px] text-white/40 leading-relaxed cursor-pointer select-none"
              onClick={() => setForm((prev) => ({ ...prev, sms_consent: !prev.sms_consent }))}
            >
              I would like to receive updates by text. We&apos;ll be sending you booking confirmations and rental updates from Exotic Rentals Montreal. Message and data rates may apply. Message frequency varies. Text HELP for help. You can opt out at any time by replying STOP.{" "}
              <a
                href="https://www.quo.com/policies/ORrOf5XtVY"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a96e]/70 hover:text-[#c9a96e] underline transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Error */}
          {submitError && (
            <p className="text-red-400 text-xs text-center">{submitError}</p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!form.name || !form.vehicle || !pickupDate || !returnDate || !form.phone || submitting}
              className="w-full bg-[#c9a96e] text-black text-xs tracking-[0.3em] uppercase font-medium py-4 hover:bg-[#e2c898] transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "SENDING..." : "REQUEST RESERVATION"}
            </button>
          </div>

          <p className="text-center text-[10px] tracking-[0.2em] text-white/20 uppercase pt-1">
            We&apos;ll reach out to confirm your booking
          </p>
        </form>
      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "YYYY-MM-DD" or ISO timestamp as a local midnight Date (avoids UTC offset issues). */
function parseLocalDate(s: string): Date {
  // Take only the date portion (first 10 chars) to handle both "YYYY-MM-DD" and ISO timestamps
  const datePart = s.substring(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Returns today at local midnight. */
function todayMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Add N days to a Date. */
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}


