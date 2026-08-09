import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About | Exotic Rentals Montreal",
  description: "Exotic Rentals Montreal is an independent, owner-operated exotic car rental house serving Greater Montreal.",
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">WHO WE ARE</div>
            <h1 className="font-display text-3xl md:text-5xl text-warm-white mb-6">An Independent House, Built by Enthusiasts.</h1>
            <p className="text-silver text-lg leading-relaxed max-w-2xl mx-auto">
              Exotic Rentals Montreal is an independent, owner-operated exotic car rental house serving Greater Montreal. Every vehicle in our collection is owned, maintained, and insured by us. No brokers. No middlemen. Just the car and the keys.
            </p>
          </div>

          <section className="mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4 text-center">OUR VISION</div>
            <h2 className="font-display font-bold tracking-[-0.02em] text-2xl md:text-3xl text-warm-white mb-6 text-center">The Best Exotic Rental Fleet in Quebec.</h2>
            <p className="text-silver leading-relaxed text-center max-w-2xl mx-auto">
              We own every vehicle we rent. Each car is selected for the emotion it delivers, not the badge it wears. An independent house, personal, ambitious, and growing. Our goal is to be the reference in Quebec for exotic car rentals.
            </p>
          </section>

          <section className="mb-20">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4 text-center">WHAT SETS US APART</div>
            <h2 className="font-display font-bold tracking-[-0.02em] text-2xl md:text-3xl text-warm-white mb-8 text-center">Selected, Not Collected.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Personally Handled", desc: "Every vehicle is handed off personally by our concierge team at our Montreal location. We walk you through the car, answer questions, and make sure you're comfortable before you drive off." },
                { title: "On Call", desc: "24/7 concierge support throughout your rental. Something comes up, we're one text away. No call centers, no waiting." },
                { title: "Owned, Not Brokered", desc: "We own every vehicle in our fleet. That means we control maintenance, condition, and availability. No surprises on pickup day." },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <h3 className="font-display font-bold text-xl tracking-[-0.02em] text-warm-white mb-3">{item.title}</h3>
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