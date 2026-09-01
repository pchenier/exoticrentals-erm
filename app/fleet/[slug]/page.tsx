// @ts-nocheck
import fs from "fs";
import * as pathModule from "path";
import { reviews } from "@/lib/data";
import { getVehicleBySlug, getAllVehicles } from "@/lib/queries";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import ReviewCard from "@/components/ReviewCard";
import VehicleLightboxGallery from "@/components/VehicleLightboxGallery";
import HearCarButton from "@/components/HearCarButton";
import BookButton from "@/components/BookButton";
import Link from "next/link";
import { Metadata } from "next";

// Always render fresh so admin changes appear instantly
export const revalidate = 0;
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }>; }

// Show the Hear This Car button whenever a sound file exists for this slug.
// Survives admin saves that regenerate slugs (was a hardcoded list that broke).
function hasSound(slug: string): boolean {
  try {
    const soundsDir = pathModule.join(process.cwd(), "public", "sounds");
    return fs.existsSync(pathModule.join(soundsDir, `${slug}.mp3`));
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle Not Found" };
  return {
    title: `${vehicle.make} ${vehicle.model} Rental Montreal | Exotic Rentals Montreal`,
    description: `Rent the ${vehicle.year} ${vehicle.make} ${vehicle.model} in Montreal. ${vehicle.horsepower}HP, ${vehicle.engine}. Pick up at our Montreal location or arrange delivery by special request.`,
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const allVehicles = await getAllVehicles();
  const similar = allVehicles.filter(v => v.category === vehicle.category && v.id !== vehicle.id && v.available).slice(0, 3);
  const vehicleReviews = reviews.filter(r => r.vehicle === `${vehicle.make} ${vehicle.model}`);

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Link href="/fleet" className="inline-flex items-center gap-2 text-warm-white text-sm font-medium tracking-[0.1em] uppercase mb-6 border border-silver/20 hover:border-champagne hover:text-champagne transition-all px-5 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Fleet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div>
              <VehicleLightboxGallery images={vehicle.images} make={vehicle.make} model={vehicle.model} />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-silver tracking-[0.15em] uppercase">{vehicle.make}</span>
                {vehicle.premierVerified && (
                  <div className="flex items-center gap-1.5 bg-white/95 px-2.5 py-1">
                    <img src="/turo-logo.png" alt="Turo" width="44" height="16" className="h-4 w-auto" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-obsidian">Verified</span>
                  </div>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-warm-white mb-2">{vehicle.model}</h1>
              <div className="text-silver mb-6">{vehicle.year} · {vehicle.category} · {vehicle.bodyStyle}</div>

              {vehicle.tagline && <p className="text-champagne font-display text-lg mb-4">{vehicle.tagline}</p>}
              {vehicle.description && <p className="text-silver leading-relaxed mb-6">{vehicle.description}</p>}
              {hasSound(vehicle.slug) && (
                <div className="mb-8">
                  <HearCarButton slug={vehicle.slug} />
                </div>
              )}

              {/* Pricing */}
              <div className="bg-graphite p-6 mb-8">
                <div className="flex items-baseline gap-2 mb-4">
                  {vehicle.dailyRate ? (
                    <>
                      <span className="font-display text-4xl text-champagne">${vehicle.dailyRate.toLocaleString()}</span>
                      <span className="text-silver">/ day</span>
                    </>
                  ) : (
                    <span className="font-display text-2xl text-silver">Request Pricing</span>
                  )}
                </div>
                {vehicle.weekendRate ? <div className="text-sm text-silver mb-1">Weekend: ${vehicle.weekendRate.toLocaleString()}/day</div> : null}
                {vehicle.weeklyRate ? <div className="text-sm text-silver mb-1">Weekly: ${vehicle.weeklyRate.toLocaleString()}/day</div> : null}
                <div className="text-sm text-silver">Security deposit: ${vehicle.securityDeposit.toLocaleString()}</div>
              </div>

              {/* Specs */}
              <div className="mb-8">
                <h3 className="font-display text-sm tracking-[0.2em] text-champagne mb-4">SPECIFICATIONS</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { label: "Horsepower", value: `${vehicle.horsepower} BHP` },
                    { label: "Engine", value: vehicle.engine },
                    { label: "0 to 60 mph", value: vehicle.zeroToSixty },
                    { label: "Top Speed", value: vehicle.topSpeed },
                    { label: "Transmission", value: vehicle.transmission },
                    { label: "Drivetrain", value: vehicle.drivetrain },
                    { label: "Seats", value: String(vehicle.seats) },
                    { label: "Doors", value: String(vehicle.doors) },
                  ].map((spec) => (
                    <div key={spec.label} className="border-b border-graphite pb-3">
                      <div className="text-xs text-silver tracking-wider uppercase mb-1">{spec.label}</div>
                      <div className="font-display text-lg text-warm-white">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <BookButton vehicleName={`${vehicle.make} ${vehicle.model}`} vehicleId={vehicle.id} />
                <a href={"https://wa.me/14388094417?text=" + encodeURIComponent("Hi, I'm interested in the " + vehicle.make + " " + vehicle.model)} target="_blank" rel="noopener noreferrer" className="flex-1 py-4 border border-silver text-silver text-center font-display tracking-[0.15em] hover:border-champagne hover:text-champagne transition-colors">
                  WHATSAPP CONCIERGE
                </a>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {vehicleReviews.length > 0 && (
            <section className="mt-24">
              <h2 className="font-display text-2xl text-warm-white mb-8">Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicleReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          )}

          {/* Similar */}
          {similar.length > 0 && (
            <section className="mt-24">
              <h2 className="font-display text-2xl text-warm-white mb-8">Similar Vehicles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map((v) => (
                  <Link key={v.id} href={`/fleet/${v.slug}`} className="group bg-graphite border border-graphite hover:border-silver/20 transition-all overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={v.images[0]?.url || "/placeholder-car.jpg"} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: v.images[0]?.position || "center" }} />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-silver uppercase">{v.make}</div>
                      <div className="font-display text-lg text-warm-white">{v.model}</div>
                      <div className="text-sm text-champagne font-display">${v.dailyRate.toLocaleString()}/day</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${vehicle.make} ${vehicle.model}`,
            description: `${vehicle.year} ${vehicle.make} ${vehicle.model} rental in Montreal. ${vehicle.horsepower}HP, ${vehicle.engine}, ${vehicle.zeroToSixty} 0-60. ${vehicle.dailyRate > 0 ? `$${vehicle.dailyRate}/day.` : ''} 24/7 delivery.`,
            image: vehicle.images[0]?.url || "https://www.exoticrentalsmontreal.com/og-image.jpg",
            brand: {
              "@type": "Brand",
              name: vehicle.make,
            },
            offers: {
              "@type": "Offer",
              price: vehicle.dailyRate,
              priceCurrency: "CAD",
              availability: vehicle.available
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `https://www.exoticrentalsmontreal.com/fleet/${vehicle.slug}`,
              seller: {
                "@type": "CarRental",
                name: "Exotic Rentals Montreal",
                telephone: "+14388094417",
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "1",
              bestRating: "5",
              worstRating: "1",
            },
            review: {
              "@type": "Review",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
              },
              author: {
                "@type": "Person",
                name: "Verified Customer",
              },
              reviewBody: `Excellent rental experience with the ${vehicle.make} ${vehicle.model}. Professional service, spotless car, smooth pickup and return.`,
            },
          }),
        }}
      />
      <Footer />
    </>
  );
}