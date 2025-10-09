'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Star, MessageSquare, Send } from 'lucide-react';
import { formatDate, getRelativeTime } from '@/lib/utils/date';
import type { Review } from '@/types/review.types';

interface ReviewCardProps {
  review: Review;
  canReply?: boolean;
  onReply?: (reply: string) => Promise<void>;
}

export function ReviewCard({ review, canReply, onReply }: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!onReply || replyText.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      await onReply(replyText);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-6 bg-white border-2">
      {/* User Review */}
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 flex-shrink-0">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
              {getInitials(review.user?.name || 'U')}
            </div>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-gray-900">
                {review.user?.name || 'Anonymous'}
              </h4>
              <p className="text-sm text-gray-500">
                {getRelativeTime(review.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{review.rating}</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{review.comment}</p>

          {/* Tenant Reply */}
          {review.tenantReply && (
            <div className="mt-4 pl-4 border-l-4 border-blue-200 bg-blue-50 p-4 rounded-r-xl">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  Balasan dari Pemilik
                </span>
                <span className="text-xs text-gray-500">
                  • {formatDate(review.repliedAt || '')}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{review.tenantReply}</p>
            </div>
          )}

          {/* Reply Form */}
          {canReply && !review.tenantReply && !isReplying && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(true)}
              className="mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Balas Review
            </Button>
          )}

          {isReplying && (
            <div className="mt-4 space-y-3">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan Anda..."
                className="min-h-24 rounded-xl border-2 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText('');
                  }}
                  disabled={isSubmitting}
                  className="rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={isSubmitting || replyText.trim().length === 0}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Mengirim...' : 'Kirim Balasan'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
