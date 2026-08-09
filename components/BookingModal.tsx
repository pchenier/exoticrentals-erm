"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, Mail, MessageSquare } from "lucide-react";
import { vehicles as staticVehicles, type Vehicle } from "@/lib/data";
import CalendarPicker from "./CalendarPicker";

export default function BookingModal({
  open,
  onClose,
  vehicleName,
  vehicleId,
}: {
  open: boolean;
  onClose: () => void;
  vehicleName?: string;
  vehicleId?: string;
}) {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(staticVehicles);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicleId: vehicleId || "",
    startDate: "",
    endDate: "",
    message: "",
  });

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  // Fetch live vehicles from API (prices may differ from static fallback)
  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAllVehicles(data);
      })
      .catch(() => {});
  }, []);

  const selectedVehicle = allVehicles.find((v) => v.id === form.vehicleId);
  const today = new Date().toISOString().slice(0, 10);

  const calcTotal = () => {
    if (!selectedVehicle || !form.startDate || !form.endDate) return null;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    const base = days * selectedVehicle.dailyRate;
    let discount = 0;
    let discountPct = 0;
    if (days >= 14) {
      discount = Math.round(base * 0.15);
      discountPct = 15;
    } else if (days >= 7) {
      discount = Math.round(base * 0.10);
      discountPct = 10;
    }
    return { base, discount, total: base - discount, days, discountPct };
  };

  const estimate = calcTotal();

  const isFormValid = form.name && form.phone && form.startDate && form.endDate && form.vehicleId;

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    setSubmitError(false);

    const v = selectedVehicle
      ? `${selectedVehicle.make} ${selectedVehicle.model}`
      : vehicleName || "Not specified";

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          vehicle: v,
          startDate: form.startDate,
          endDate: form.endDate,
          estimate: estimate ? `${estimate.total} (${estimate.days} days${estimate.discountPct ? `, ${estimate.discountPct}% promo applied` : ""})` : "",
          message: form.message,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-obsidian border border-silver/20 rounded-lg px-3 py-2.5 pl-9 text-sm text-warm-white placeholder-silver/40 focus:outline-none focus:border-champagne transition-colors";
  const labelClass =
    "block text-xs font-display tracking-[0.15em] text-silver mb-1.5 uppercase";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-obsidian/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-graphite border border-silver/20 rounded-2xl max-w-lg w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-silver hover:text-warm-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-warm-white mb-1">
            {vehicleName ? `Reserve the ${vehicleName}` : "Reserve a Vehicle"}
          </h2>
          <p className="text-silver text-sm">
            Fill out the form and we&apos;ll receive your request instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle selector */}
          <div>
            <label className={labelClass}>Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => update("vehicleId", e.target.value)}
              className="w-full bg-obsidian border border-silver/20 rounded-lg px-3 py-2.5 text-sm text-warm-white focus:outline-none focus:border-champagne transition-colors"
              required
            >
              <option value="">Select a vehicle</option>
              {allVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} — ${v.dailyRate}/day
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
              <input
                type="text"
                className={inputClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                <input
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(305) 555-0199"
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <CalendarPicker
              label="Pickup Date"
              value={form.startDate}
              onChange={(d) => update("startDate", d)}
              minDate={today}
            />
            <CalendarPicker
              label="Return Date"
              value={form.endDate}
              onChange={(d) => update("endDate", d)}
              minDate={form.startDate || today}
            />
          </div>

          {/* Message */}
          <div>
            <label className={labelClass}>Notes (optional)</label>
            <div className="relative">
              <MessageSquare size={15} className="absolute left-3 top-4 text-silver" />
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Special requests, delivery arrangements..."
              />
            </div>
          </div>

          {/* Estimate */}
          {estimate !== null && (
            <div className="bg-obsidian/60 rounded-lg px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display tracking-[0.15em] text-silver uppercase">
                  {estimate.days} {estimate.days === 1 ? "Day" : "Days"} × ${selectedVehicle?.dailyRate.toLocaleString()}/day
                </span>
                <span className="text-sm text-silver">
                  ${estimate.base.toLocaleString()}
                </span>
              </div>
              {estimate.discountPct > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display tracking-[0.15em] text-champagne uppercase">
                    {estimate.discountPct}% Long Rental Promo
                  </span>
                  <span className="text-sm text-champagne">
                    &minus;${estimate.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-silver/20 pt-2">
                <span className="text-xs font-display tracking-[0.15em] text-silver uppercase">
                  Estimated Total
                </span>
                <span className="font-display text-lg text-champagne">
                  ${estimate.total.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Submit / Confirmation */}
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-champagne text-4xl mb-3">✓</div>
              <p className="font-display text-lg text-warm-white mb-1">Request Sent!</p>
              <p className="text-silver text-sm">We&apos;ll text you back within 30 minutes.</p>
            </div>
          ) : (
            <>
              <button
                type="submit"
                disabled={!isFormValid || submitting}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-champagne text-obsidian font-display tracking-[0.12em] text-sm uppercase rounded-lg hover:bg-champagne/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Booking Request"}
              </button>

              {submitError && (
                <p className="text-center text-xs text-red-400">
                  Something went wrong. Call or text us at 438-809-4417.
                </p>
              )}

              <p className="text-center text-xs text-silver/50">
                We reply within 30 minutes.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}