"use client";

const steps = [
  {
    step: "01",
    title: "Select Your Machine",
    description:
      "Browse our curated fleet and identify the vehicle that matches your vision. Not sure which to choose? Our specialists are standing by to pair you with your perfect match.",
  },
  {
    step: "02",
    title: "Reserve with Ease",
    description:
      "Reach out via WhatsApp or email with your desired dates and delivery location. We confirm availability instantly and handle all documentation with minimal friction.",
  },
  {
    step: "03",
    title: "Experience the Road",
    description:
      "Your vehicle arrives fully detailed, gassed, and ready. Return it at your chosen time and place. No queues, no counters — just the open road and the machine you deserve.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#0d0d0d] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Header */}
          <div>
            <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4 font-light">
              Simple by Design
            </p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light tracking-wide text-white mb-6 leading-tight">
              How It
              <br />
              <span className="text-[#c9a96e]">Works</span>
            </h2>
            <div className="w-16 h-px bg-[#c9a96e] mb-8" />
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-md">
              We&apos;ve eliminated every point of friction from the traditional
              rental experience. Three steps. Zero hassle. Pure driving pleasure.
            </p>

            {/* Decorative element */}
            <div className="mt-12 hidden lg:block">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border border-[#c9a96e]/10" />
                <div className="absolute inset-4 rounded-full border border-[#c9a96e]/5" />
                <div className="absolute inset-8 rounded-full border border-[#c9a96e]/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-4xl font-light text-[#c9a96e]">
                      3
                    </span>
                    <span className="text-[9px] tracking-[0.2em] text-white/30 block mt-1 uppercase">
                      Simple Steps
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Steps */}
          <div className="space-y-0">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`relative flex gap-8 py-10 ${
                  i < steps.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
              >
                {/* Step number */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <span className="font-display text-4xl font-light text-[#c9a96e] leading-none">
                    {item.step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 min-h-[2rem] bg-gradient-to-b from-[#c9a96e]/20 to-transparent mt-4" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="font-display text-xl font-light tracking-wide text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
