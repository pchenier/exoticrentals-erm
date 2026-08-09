"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection({ faqs, showHeader = true }: { faqs: FAQ[]; showHeader?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className={`${showHeader ? "py-24" : ""} px-4 sm:px-6 lg:px-8 ${showHeader ? "bg-graphite" : ""}`}>
      <div className="max-w-3xl mx-auto">
        {showHeader && (
          <div className="text-center mb-16">
            <div className="text-xs font-spec tracking-[0.3em] text-champagne mb-4">
              FAQ
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-warm-white">
              Questions? We've Got Answers.
            </h2>
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-graphite overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-obsidian/50 transition-colors"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <span className="font-medium text-warm-white">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-silver transition-transform ${
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
    </section>
  );
}
