"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck, KeyRound } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "BOOK",
    subtitle: "Select & Submit",
    description:
      "Browse the curated fleet, choose your vehicle, and submit a reservation request. A dedicated concierge will contact you within minutes to confirm availability and arrange every detail.",
    icon: CalendarCheck,
    details: [
      "Curated fleet of exotic & luxury vehicles",
      "Real-time availability confirmation",
      "Personal concierge assigned immediately",
    ],
  },
  {
    number: "02",
    title: "VERIFY",
    subtitle: "Identity & Insurance",
    description:
      "Complete a streamlined verification process including identity confirmation, insurance validation, and a refundable security deposit. The entire process is designed to take under 30 minutes.",
    icon: ShieldCheck,
    details: [
      "Secure identity verification",
      "Insurance coverage validation",
      "Refundable security deposit",
      "Completed in under 30 minutes",
    ],
  },
  {
    number: "03",
    title: "DRIVE",
    subtitle: "Pickup & Support",
    description:
      "Your vehicle is ready and waiting at our Montreal location—detailed, fueled, and inspected. Our concierge walks you through every detail before you drive off. Enjoy 24/7 concierge support throughout your entire rental period. Delivery available by special arrangement.",
    icon: KeyRound,
    details: [
      "Pick up at our Montreal location",
      "Professionally detailed & fueled",
      "24/7 concierge support during rental",
      "Delivery available by special request",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 bg-obsidian">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
              THE PROCESS
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-warm-white leading-tight mb-6">
              Three Steps to
              <br />
              <span className="text-champagne">the Extraordinary</span>
            </h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">
              From selection to pickup, every reservation is handled with
              precision, discretion, and an uncompromising standard of service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Reveal
              key={step.number}
              className={`relative py-20 md:py-28 ${
                index !== steps.length - 1 ? "border-b border-graphite" : ""
              }`}
              delay={0.1}
              duration={0.8}
              y={40}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Number */}
                <div className="lg:col-span-3">
                  <div className="font-spec text-8xl md:text-9xl text-graphite leading-none select-none">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-4 mb-4">
                    <step.icon
                      size={28}
                      className="text-champagne"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs font-spec tracking-[0.2em] text-silver uppercase">
                      {step.subtitle}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-warm-white mb-6">
                    {step.title}
                  </h2>
                  <p className="text-silver text-lg leading-relaxed mb-8 max-w-xl">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-3 text-sm text-silver"
                      >
                        <span className="w-1.5 h-1.5 bg-champagne rounded-full flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual accent */}
                <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
                  <div className="w-px h-48 bg-gradient-to-b from-transparent via-champagne/30 to-transparent" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline Summary */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-graphite">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
              AT A GLANCE
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-warm-white">
              The Premier Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "MINUTES",
                value: "0–5",
                description: "Concierge response after booking request",
              },
              {
                label: "MINUTES",
                value: "5–30",
                description: "Verification, insurance, and deposit completed",
              },
              {
                label: "HOURS",
                value: "1–4",
                description: "Vehicle prepared and ready for pickup at our Montreal location",
              },
            ].map((item, i) => (
              <Reveal
                key={item.value}
                className="text-center p-8 border border-graphite bg-obsidian"
                delay={i * 0.1}
              >
                <div className="text-xs font-spec tracking-[0.2em] text-silver mb-2">
                  {item.label}
                </div>
                <div className="font-display text-4xl md:text-5xl text-champagne mb-3">
                  {item.value}
                </div>
                <p className="text-sm text-silver">{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal duration={0.6}>
            <h2 className="font-display text-3xl md:text-4xl text-warm-white mb-6">
              Ready to Begin?
            </h2>
            <p className="text-silver mb-10 max-w-xl mx-auto">
              Browse the fleet or contact our concierge team directly. Your
              Montreal experience starts with a single request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/fleet"
                className="px-8 py-4 bg-burgundy text-warm-white font-spec tracking-[0.15em] hover:bg-burgundy-light transition-colors"
              >
                EXPLORE THE FLEET
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
