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
              href="tel:+14385339053"
              onClick={() => trackPhoneClick("navbar_phone")}
              className="text-[11px] text-white/40 hover:text-[#c9a96e] transition-colors duration-200 tracking-wide font-light hidden lg:block"
            >
              438‑533‑9053
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

      </div>
    </>
  );
}
