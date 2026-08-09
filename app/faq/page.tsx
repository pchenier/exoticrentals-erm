"use client";

import { useState } from "react";
import { faqs } from "@/lib/data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  // Group FAQs by category
  const categories: { label: string; items: typeof faqs }[] = [
    {
      label: "ELIGIBILITY",
      items: faqs.filter((f) => ["faq-1", "faq-8"].includes(f.id)),
    },
    {
      label: "VERIFICATION & INSURANCE",
      items: faqs.filter((f) => ["faq-3", "faq-4", "faq-11"].includes(f.id)),
    },
    {
      label: "DEPOSITS & PAYMENT",
      items: faqs.filter((f) => ["faq-2", "faq-9", "faq-12"].includes(f.id)),
    },
    {
      label: "LOGISTICS",
      items: faqs.filter((f) =>
        ["faq-5", "faq-6", "faq-7"].includes(f.id)
      ),
    },
    {
      label: "AVAILABILITY",
      items: faqs.filter((f) =>
        ["faq-10", "faq-13"].includes(f.id)
      ),
    },
  ];

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">
              FAQ
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-warm-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-silver max-w-xl mx-auto">
              Everything you need to know about renting with Exotic Rentals Montreal.
            </p>
          </div>

          {/* Categorized FAQs */}
          <div className="space-y-14">
            {categories.map((category) => (
              <div key={category.label}>
                <h2 className="font-display tracking-[0.2em] text-champagne mb-6 text-sm">
                  {category.label}
                </h2>
                <div className="space-y-3">
                  {category.items.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-graphite overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-graphite/50 transition-colors"
                        onClick={() =>
                          setOpenId(openId === faq.id ? null : faq.id)
                        }
                      >
                        <span className="font-medium text-warm-white pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`text-silver transition-transform shrink-0 ${
                            openId === faq.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openId === faq.id && (
                        <div className="px-5 pb-5 text-silver text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <p className="text-silver mb-6 text-lg font-display">
              Still have a question?
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 border border-champagne text-champagne font-display tracking-[0.15em] hover:bg-champagne hover:text-obsidian transition-colors"
            >
              CONTACT CONCIERGE
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}