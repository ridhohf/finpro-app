"use client";

import { ReviewsSection } from "@/components/properties/reviewSection";
import { MessageCircle } from "lucide-react";

interface PropertyReviewsProps {
  reviews: any[];
  averageRating: number;
  totalReviews: number;
}

export function PropertyReviews({
  reviews,
  averageRating,
  totalReviews,
}: PropertyReviewsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        Guest Reviews
      </h2>
      <ReviewsSection
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
      />
    </div>
  );
}