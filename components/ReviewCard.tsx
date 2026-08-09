import { Star } from "lucide-react";
import Badge from "./Badge";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string | null;
    text: string;
    customerLabel?: string | null;
    verified: boolean;
    rentalDate?: Date | null;
    reviewDate: Date;
    customer?: { firstName: string; lastName: string } | null;
    vehicle?: { make: string; model: string } | null;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const customerName = review.customer
    ? `${review.customer.firstName} ${review.customer.lastName.charAt(0)}.`
    : "Anonymous";

  return (
    <div className="bg-graphite border border-graphite p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-warm-white">{customerName}</span>
            {review.verified && (
              <Badge name="verified" label="Verified Rental" icon="shield-check" size="sm" showLabel={false} />
            )}
          </div>
          {review.customerLabel && (
            <div className="text-xs text-silver">{review.customerLabel}</div>
          )}
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? "text-champagne fill-champagne" : "text-graphite"}
            />
          ))}
        </div>
      </div>

      {review.title && (
        <h4 className="font-display text-lg text-warm-white mb-2">{review.title}</h4>
      )}
      <p className="text-silver text-sm leading-relaxed mb-4">{review.text}</p>

      <div className="flex items-center justify-between text-xs text-silver">
        <div>
          {review.vehicle && (
            <span>
              {review.vehicle.make} {review.vehicle.model}
            </span>
          )}
        </div>
        <div>
          {review.rentalDate && (
            <span>
              Rented {new Date(review.rentalDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
