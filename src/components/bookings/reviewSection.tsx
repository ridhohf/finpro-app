"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ReviewSectionProps {
  onWriteReview: () => void;
}

export function ReviewSection({ onWriteReview }: ReviewSectionProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Write a Review
          </h2>
          <p className="text-gray-600">
            Share your experience with other guests
          </p>
        </div>
        <Button
          onClick={onWriteReview}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
        >
          <Star className="w-4 h-4 mr-2" />
          Write Review
        </Button>
      </div>
    </div>
  );
}
