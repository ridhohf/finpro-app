// Review Interface
export interface Review {
  id: number;
  userId: number;
  propertyId: number;
  reservationId: number;
  rating: number;
  comment: string;
  tenantReply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  property?: {
    id: number;
    name: string;
  };
}

// Request Types
export interface SubmitReviewRequest {
  rating: number;
  comment: string;
}

export interface ReplyReviewRequest {
  reply: string;
}

// Response Types
export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: {
    review: {
      id: number;
      rating: number;
      comment: string;
      reviewDate: string;
      user: string;
      property: string;
      tenantReply?: string;
      replyDate?: string;
    };
  };
}

export interface PropertyReviewsResponse {
  success: boolean;
  message: string;
  data?: {
    propertyId: number;
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
      id: number;
      rating: number;
      comment: string;
      reviewDate: string;
      tenantReply?: string;
      replyDate?: string;
      user: string;
    }>;
  };
}
