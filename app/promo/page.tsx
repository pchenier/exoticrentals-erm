"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Percent, Trophy, Sparkles, ArrowRight } from "lucide-react";

const promos = [
  {
    icon: Percent,
    discount: "10% OFF",
    title: "7+ Day Rentals",
    desc: "Rent any vehicle for 7 days or more and get 10% off the total. Automatically applied to your booking.",
    tag: "7+ days",
  },
  {
    icon: Trophy,
    discount: "15% OFF",
    title: "14+ Day Rentals",
    desc: "Going for two weeks or more? Lock in 15% off your entire rental. The longer you ride, the more you save.",
    tag: "14+ days",
  },
];

export default function PromoPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-obsidian pt-32 pb-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-champagne/30 rounded-full mb-6">
            <Sparkles size={14} className="text-champagne" />
            <span className="text-xs font-display tracking-[0.15em] text-champagne uppercase">
              Limited Time Offer
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-warm-white mb-4">
            Long Rental? <span className="text-champagne">Pay Less.</span>
          </h1>
          <p className="text-silver text-lg max-w-xl mx-auto">
            The longer you keep the car, the less you pay per day. No codes, no fine print.
            Discounts apply automatically when you book 7 days or more.
          </p>
        </section>

        {/* Promo Cards */}
        <section className="max-w-4xl mx-auto px-6 grid gap-6">
          {promos.map((promo, i) => (
            <div
              key={i}
              className="bg-graphite border border-silver/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="flex items-center gap-5 flex-1">
                <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center shrink-0">
                  <promo.icon size={28} className="text-champagne" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-display text-2xl text-champagne">{promo.discount}</span>
                    <span className="text-xs font-display tracking-[0.15em] text-silver/60 uppercase px-2 py-0.5 border border-silver/20 rounded">
                      {promo.tag}
                    </span>
                  </div>
                  <h2 className="font-display text-xl text-warm-white mb-2">{promo.title}</h2>
                  <p className="text-silver text-sm leading-relaxed">{promo.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <div className="bg-graphite/50 border border-silver/20 rounded-2xl p-8">
            <h2 className="font-display text-xl text-warm-white mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-champagne" />
                </div>
                <h3 className="text-warm-white font-display text-sm mb-1">Pick Your Dates</h3>
                <p className="text-silver/70 text-xs">Select 7+ days at checkout</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto mb-3">
                  <Percent size={20} className="text-champagne" />
                </div>
                <h3 className="text-warm-white font-display text-sm mb-1">Discount Auto Applies</h3>
                <p className="text-silver/70 text-xs">10% or 15% off automatically</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto mb-3">
                  <ArrowRight size={20} className="text-champagne" />
                </div>
                <h3 className="text-warm-white font-display text-sm mb-1">Drive & Save</h3>
                <p className="text-silver/70 text-xs">Less per day, more fun</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 mt-16 text-center">
          <a
            href="/fleet"
            className="inline-flex items-center gap-2 px-8 py-4 bg-champagne text-obsidian font-display font-bold tracking-[0.1em] text-xs uppercase rounded-lg hover:bg-champagne/90 transition-colors"
          >
            Browse The Fleet
            <ArrowRight size={16} />
          </a>
          <p className="text-silver/50 text-xs mt-4">
            Discounts apply to all available vehicles. No promo code needed.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}