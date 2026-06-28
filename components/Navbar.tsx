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
            <a
              href="https://www.instagram.com/exotics.mtl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#c9a96e] transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
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
        <div className="w-12 h-px bg-[#c9a96e]" />
        <a
          href="https://www.instagram.com/exotics.mtl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-[#c9a96e] transition-colors duration-200"
          aria-label="Instagram"
          onClick={() => setMenuOpen(false)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
