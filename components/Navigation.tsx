"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ERMLogo from "./ERMLogo";
import BookingModal from "./BookingModal";

const navLinks = [
  { href: "/fleet", label: "FLEET" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/about", label: "ABOUT" },
  { href: "/blog", label: "BLOG" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-obsidian/90 backdrop-blur-md border-b border-graphite" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-3">
              <ERMLogo size="sm" showWordmark={false} />
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-silver hover:text-warm-white transition-colors tracking-[0.15em] font-display">
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => setBookingOpen(true)}
                className="px-5 py-2 bg-champagne text-obsidian text-xs font-body font-bold tracking-[0.1em] hover:bg-champagne/90 transition-colors"
              >
                BOOK
              </button>
            </div>

            <button className="lg:hidden text-warm-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-graphite">
              <ERMLogo size="sm" showWordmark={false} />
              <button className="text-warm-white" onClick={() => setMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="font-display font-bold tracking-[-0.02em] text-2xl text-warm-white hover:text-champagne transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                onClick={() => { setMobileOpen(false); setBookingOpen(true); }}
                className="mt-8 px-8 py-3 bg-champagne text-obsidian font-display tracking-[0.15em] text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                BOOK
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-obsidian/95 backdrop-blur-md border-t border-graphite px-4 py-3">
        <button
          onClick={() => setBookingOpen(true)}
          className="block w-full py-3 bg-champagne text-obsidian text-center font-display tracking-[0.15em] text-sm"
        >
          BOOK
        </button>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}