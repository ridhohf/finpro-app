'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  propertyName: string;
}

export function ReviewForm({ onSubmit, propertyName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Berikan rating terlebih dahulu');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Komentar minimal 10 karakter');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      toast.success('Review berhasil dikirim!');
      setRating(0);
      setComment('');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Berikan Review untuk {propertyName}
        </h3>

        {/* Rating Stars */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Rating
          </label>
          <div className="flex gap-2">
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
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {rating === 1 && 'Sangat Buruk'}
              {rating === 2 && 'Buruk'}
              {rating === 3 && 'Cukup'}
              {rating === 4 && 'Baik'}
              {rating === 5 && 'Sangat Baik'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Komentar
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan pengalaman Anda menginap di properti ini..."
            className="min-h-32 rounded-xl border-2 focus:border-blue-500"
            maxLength={500}
          />
          <p className="mt-2 text-xs text-gray-500 text-right">
            {comment.length}/500 karakter
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl h-12 font-semibold"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
        </Button>
      </div>
    </form>
  );
}
