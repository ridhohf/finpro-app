"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { reviewAPI } from "@/lib/api/review.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Star, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface ReviewDialogProps {
  bookingId: number;
  propertyId: number;
  propertyName: string;
  onClose: () => void;
}

export function ReviewDialog({
  bookingId,
  propertyId,
  propertyName,
  onClose,
}: ReviewDialogProps) {
  const { token } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewAPI.createReview(
        {
          reservationId: bookingId,
          rating,
          comment: comment.trim(),
        },
        token!
      );

      toast.success("Review submitted successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <p className="text-gray-600 mt-1">{propertyName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-900">
              Your Rating *
            </Label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "😞 Poor"}
                {rating === 2 && "😕 Fair"}
                {rating === 3 && "😊 Good"}
                {rating === 4 && "😃 Very Good"}
                {rating === 5 && "🤩 Excellent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <Label
              htmlFor="comment"
              className="text-lg font-semibold text-gray-900"
            >
              Your Review *
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your experience... What did you like? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[200px] text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl resize-none"
              required
            />
            <p className="text-sm text-gray-500">
              Minimum 10 characters ({comment.length}/10)
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-sm text-blue-900 font-semibold mb-2">
              💡 Tips for a helpful review:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about what you liked or didn't like</li>
              <li>• Mention the cleanliness, location, and amenities</li>
              <li>• Share tips that might help future guests</li>
              <li>• Be honest but respectful</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || rating === 0 || comment.trim().length < 10
              }
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
