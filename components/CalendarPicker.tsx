"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  label: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarPicker({ value, onChange, minDate, label }: CalendarPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value + "T00:00:00");
    if (minDate) return new Date(minDate + "T00:00:00");
    return new Date();
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setViewDate(new Date(value + "T00:00:00"));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const minD = minDate ? new Date(minDate + "T00:00:00") : null;
  const selected = value ? new Date(value + "T00:00:00") : null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (minD && d < minD) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const t = new Date();
    return (
      t.getFullYear() === year &&
      t.getMonth() === month &&
      t.getDate() === day
    );
  };

  const formatted = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-display tracking-[0.15em] text-silver mb-1.5 uppercase">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-obsidian border border-silver/20 rounded-lg px-3 py-2.5 text-sm text-left focus:outline-none focus:border-champagne transition-colors flex items-center justify-between"
      >
        <span className={value ? "text-warm-white" : "text-silver/40"}>
          {formatted || "Select date"}
        </span>
        <ChevronRight
          size={15}
          className={`text-silver transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-graphite border border-silver/20 rounded-lg p-4 shadow-xl w-[280px] left-0">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 text-silver hover:text-champagne transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-display text-warm-white tracking-wide">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 text-silver hover:text-champagne transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-display tracking-wider text-silver/60 uppercase py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDisabled(day);
              const selectedDay = isSelected(day);
              const today = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(toISO(new Date(year, month, day)));
                    setOpen(false);
                  }}
                  className={`
                    aspect-square text-xs rounded transition-colors
                    ${selectedDay
                      ? "bg-champagne text-obsidian font-bold"
                      : disabled
                        ? "text-silver/20 cursor-not-allowed"
                        : today
                          ? "border border-champagne/50 text-champagne hover:bg-champagne/10"
                          : "text-warm-white hover:bg-obsidian border border-transparent"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}