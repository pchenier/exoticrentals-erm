import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "The Experience | Exotic Rentals Montreal",
  description: "Your supercar, in four simple steps. Selection, reservation, pickup, the drive.",
};

export default function ExperiencePage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">THE EXPERIENCE</div>
            <h1 className="font-display text-3xl md:text-5xl text-warm-white mb-6">Your Supercar, in Four Steps.</h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">
              It's simple, it's straightforward. No paperwork mountains, no waiting rooms. Pick a car, book it online, pick it up at our Montreal location, you drive.
            </p>
          </div>

          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { num: "01", title: "CHOOSE YOUR MACHINE", desc: "Browse the fleet. Filter by category, sort by price or performance. Every car has full specs, real photos, and transparent pricing." },
                { num: "02", title: "BOOK ONLINE", desc: "Select your dates and reserve directly through the site. Or contact our concierge for custom requests and multi-day packages." },
                { num: "03", title: "PICKUP", desc: "Pick up your vehicle at our Montreal location. The car is detailed and fueled, ready to go. Delivery available by special arrangement." },
                { num: "04", title: "HIT THE ROAD", desc: "We walk you through the car, answer questions, and hand you the keys. 24/7 concierge support throughout your rental." },
              ].map((step) => (
                <div key={step.num} className="flex gap-6">
                  <div className="font-display font-extrabold text-5xl text-champagne flex-shrink-0">{step.num}</div>
                  <div>
                    <h3 className="font-display font-bold text-xl tracking-[-0.02em] text-warm-white mb-2">{step.title}</h3>
                    <p className="text-silver text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20 text-center">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">OUR VISION</div>
            <h2 className="font-display font-bold tracking-[-0.02em] text-2xl md:text-3xl text-warm-white mb-6">The Best Exotic Rental Fleet in Quebec.</h2>
            <p className="text-silver leading-relaxed max-w-2xl mx-auto mb-4">
              We're building something different. An independent house that owns every car, controls every detail, and treats every client like a member. No corporate scripts, no hidden fees, no surprises.
            </p>
            <div className="font-display font-extrabold text-3xl text-champagne mt-8">GOAL: #1 IN QUEBEC</div>
          </section>

          <section className="mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4 text-center">WHAT SETS US APART</div>
            <h2 className="font-display font-bold tracking-[-0.02em] text-2xl md:text-3xl text-warm-white mb-8 text-center">Selected, Not Collected.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "SELECTED, NOT COLLECTED", desc: "Every car is chosen for the emotion it delivers. Not for the badge, not for the spec sheet. For the drive." },
                { title: "PERSONAL HANDOFF", desc: "We don't hand you keys in a parking lot. At our Montreal location, we walk you through the car and make sure you're confident before you drive." },
                { title: "ON CALL", desc: "24/7 concierge support. Something comes up at 2 AM? We answer. Flat tire, question, route recommendation? We're one text away." },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <h3 className="font-display font-semibold text-lg text-warm-white mb-3">{item.title}</h3>
                  <p className="text-silver text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-16 border-t border-graphite">
            <h2 className="font-display font-bold tracking-[-0.02em] text-2xl md:text-3xl text-warm-white mb-6">Ready to Drive?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/fleet" className="px-8 py-4 bg-champagne text-obsidian font-body font-bold tracking-[0.1em] text-xs hover:bg-champagne/90 transition-colors">VIEW THE FLEET</a>
              <a href="tel:14388094417" className="px-8 py-4 border border-silver text-silver font-body font-bold tracking-[0.1em] text-xs hover:border-champagne hover:text-champagne transition-colors">438-809-4417</a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}