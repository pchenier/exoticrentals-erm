"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import {
  MapPin,
  Sparkles,
  Camera,
  CalendarRange,
  Briefcase,
  UserCheck,
  Search,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: MapPin,
    title: "Montreal Pickup Location",
    description:
      "Pick up your vehicle at our Montreal location—detailed, fueled, and inspection-ready. Our concierge walks you through every detail before you drive off. The default, and the fastest way to get behind the wheel.",
    tag: "Default · Ready in Hours",
  },
  {
    icon: Sparkles,
    title: "Special Delivery Arrangements",
    description:
      "Delivery is available by special arrangement for select cases—hotels, residences, airports, marinas, and production locations within Montreal area and Greater Montreal. Coordinated with our concierge team and quoted on request.",
    tag: "By Arrangement · Quote on Request",
  },
  {
    icon: Sparkles,
    title: "Event & Wedding Rentals",
    description:
      "Make an entrance that matches the occasion. Multi-vehicle coordination, red-carpet timing, and picture-perfect presentation for your day.",
    tag: "Multi-Vehicle Coordination",
  },
  {
    icon: Camera,
    title: "Photoshoot Rentals",
    description:
      "Vehicles prepared for editorial, commercial, and social media production. Detailed, positioned, and ready for the lens. Pickup at our Montreal location or delivery arranged for your shoot.",
    tag: "Production Ready",
  },
  {
    icon: CalendarRange,
    title: "Long-Term Rentals",
    description:
      "Extended access to the fleet for weeks or months. Preferential rates, priority scheduling, and vehicle rotation options for extended stays.",
    tag: "Preferential Rates",
  },
  {
    icon: Briefcase,
    title: "Corporate Accounts",
    description:
      "Dedicated account management for businesses, production companies, and hospitality groups. Streamlined billing and priority fleet access.",
    tag: "Dedicated Management",
  },
  {
    icon: UserCheck,
    title: "Chauffeur Service",
    description:
      "Professional chauffeurs available on request. Discreet, experienced drivers who know Montreal's routes, venues, and protocols.",
    tag: "On Request",
  },
  {
    icon: Search,
    title: "Custom Sourcing",
    description:
      "Looking for something specific? We locate and secure any vehicle—rare exotics, limited editions, or vintage classics—through our network.",
    tag: "Any Vehicle, Anywhere",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
              SERVICES
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-warm-white leading-tight mb-6">
              Concierge-Level Access,
              <br />
              <span className="text-champagne">Every Detail Handled</span>
            </h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">
              Pick up at our Montreal location or arrange delivery by special
              request. Every service is built around your schedule, your
              standards, and the drive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metallic divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent metallic-line" />
      </div>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <Reveal
                key={service.title}
                delay={i * 0.08}
                duration={0.6}
                y={30}
                className="group relative"
              >
                <div className="relative h-full bg-graphite border border-graphite p-8 md:p-10 transition-all duration-500 hover:border-champagne/30">
                  {/* Icon */}
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 border border-champagne/20 text-champagne group-hover:border-champagne/50 group-hover:bg-champagne/5 transition-all duration-500">
                    <service.icon size={26} strokeWidth={1.5} />
                  </div>

                  {/* Tag */}
                  <div className="text-[10px] font-spec tracking-[0.2em] text-champagne/60 mb-3 uppercase">
                    {service.tag}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl md:text-3xl text-warm-white mb-4 group-hover:text-champagne transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-silver leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Hover arrow */}
                  <div className="flex items-center gap-2 text-champagne opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-spec tracking-[0.15em]">
                      INQUIRE
                    </span>
                    <ArrowRight size={14} />
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-champagne/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pickup Standard */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-graphite">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal duration={0.8}>
            <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
              THE PREMIER STANDARD
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-warm-white mb-6">
              Ready for Pickup, Every Time
            </h2>
            <p className="text-silver mb-10 max-w-2xl mx-auto">
              Vehicles are detailed, fueled, and inspected before every rental.
              Our team confirms timing 24 hours in advance and remains available
              throughout your rental for adjustments, extensions, or additional
              requests. Delivery available by special arrangement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
              {[
                {
                  label: "24/7",
                  desc: "Concierge & support availability",
                },
                {
                  label: "1–4 HRS",
                  desc: "Typical prep time for pickup readiness",
                },
                {
                  label: "100%",
                  desc: "Pre-pickup inspection & detail",
                },
              ].map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={i * 0.1}
                  className="text-center sm:text-left"
                >
                  <div className="font-spec text-3xl text-champagne mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-silver">{stat.desc}</div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal duration={0.8}>
            <h2 className="font-display text-3xl md:text-4xl text-warm-white mb-6">
              Ready to Arrange Your Service?
            </h2>
            <p className="text-silver mb-8">
              Contact our concierge team to arrange pickup, discuss special
              delivery, custom sourcing, or set up a corporate account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:14388094417"
                className="px-8 py-4 bg-burgundy text-warm-white font-spec tracking-[0.15em] hover:bg-burgundy-light transition-colors"
              >
                CALL 438-809-4417
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border border-silver text-silver font-spec tracking-[0.15em] hover:border-champagne hover:text-champagne transition-colors"
              >
                REQUEST A VEHICLE
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
