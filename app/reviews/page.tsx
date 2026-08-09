// @ts-nocheck
import { reviews } from "@/lib/data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { Star } from "lucide-react";

export const metadata = {
  title: "Reviews | Exotic Rentals Montreal",
  description: "Read verified reviews from our clients. Every reservation is handled with the same attention to detail.",
};

export default function ReviewsPage() {
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-obsidian min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-xs font-display font-bold tracking-[0.3em] text-champagne mb-4">
              CLIENT REVIEWS
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-warm-white mb-4">
              What Our Clients Say
            </h1>
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-champagne fill-champagne"
                  />
                ))}
              </div>
              <p className="text-sm text-silver">
                5.0 / 5. Based on verified reviews
              </p>
            </div>
          </div>

          {/* Reviews Grid */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-graphite border border-graphite p-6 flex flex-col"
                >
                  {/* Stars + Verified badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "text-champagne fill-champagne"
                              : "text-graphite"
                          }
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <Badge
                        name="verified"
                        label="Verified"
                        icon="shield-check"
                        size="sm"
                        showLabel={true}
                      />
                    )}
                  </div>

                  {/* Quote */}
                  <p className="text-silver text-sm leading-relaxed mb-6 flex-grow">
                    {review.title && (
                      <span className="block font-display font-semibold text-lg text-warm-white mb-2">
                        {review.title}
                      </span>
                    )}
                    “{review.text}”
                  </p>

                  {/* Footer: location + vehicle */}
                  <div className="border-t border-graphite pt-4 text-xs text-silver space-y-1">
                    {review.customerLabel && (
                      <div className="flex items-center gap-2">
                        <span className="font-display tracking-[0.1em] text-champagne">
                          LOCATION
                        </span>
                        <span>{review.customerLabel}</span>
                      </div>
                    )}
                    {review.vehicle && (
                      <div className="flex items-center gap-2">
                        <span className="font-display tracking-[0.1em] text-champagne">
                          VEHICLE
                        </span>
                        <span>{review.vehicle}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-silver">No reviews yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}