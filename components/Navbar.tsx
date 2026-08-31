"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPhoneClick } from "@/lib/analytics";

const navLinks = [
  { label: "Fleet", href: "#fleet" },
  { label: "Experience", href: "#experience" },
  { label: "Book Now", href: "#booking" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed ${isHome ? "top-8" : "top-0"} left-0 right-0 z-50 transition-all duration-500 animate-slide-down ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/erm-logo.svg" alt="ERM" className="h-14 w-auto" width={160} height={40} />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.slice(0, 2).map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-xs tracking-[0.2em] text-white/70 hover:text-white transition-colors duration-300 font-light uppercase"
              >
                {link.label}
              </button>
            ))}
            <a
              href="tel:+14388094417"
              onClick={() => trackPhoneClick("navbar_phone")}
              className="text-[11px] text-white/40 hover:text-[#c9a96e] transition-colors duration-200 tracking-wide font-light hidden lg:block"
            >
              438‑809‑4417
            </a>
            <a
              href="tel:+14388094417"
              onClick={() => trackPhoneClick("navbar_phone_icon")}
              aria-label="Call Exotic Rentals Montreal at 438-809-4417"
              title="Call us: 438-809-4417"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#c9a96e]/60 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0a0a0a] hover:border-[#c9a96e] transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <button
              onClick={() => handleNavClick("#booking")}
              className="text-xs tracking-[0.2em] px-6 py-2.5 border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-all duration-300 font-light uppercase"
            >
              Book Now
            </button>

          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-px bg-white block origin-center transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-px bg-white block transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-6 h-px bg-white block origin-center transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center gap-10 md:hidden transition-all duration-400 ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNavClick(link.href)}
            className="font-display text-4xl font-light tracking-widest text-white hover:text-[#c9a96e] transition-colors duration-300"
          >
            {link.label}
          </button>
        ))}

        <a
          href="tel:+14388094417"
          onClick={() => trackPhoneClick("mobile_menu_phone")}
          className="flex items-center gap-3 mt-4 text-[#c9a96e] hover:text-white transition-colors duration-300"
          aria-label="Call Exotic Rentals Montreal at 438-809-4417"
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[#c9a96e]/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="text-xl tracking-widest uppercase">Call 438‑809‑4417</span>
        </a>

      </div>
    </>
  );
}
