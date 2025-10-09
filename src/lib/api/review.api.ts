import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type {
  SubmitReviewRequest,
  ReplyReviewRequest,
  ReviewResponse,
  PropertyReviewsResponse,
} from '@/types/review.types';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ReviewAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ Works!
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data;
  }

  // Submit review for transaction
  async submitReview(
    transactionId: number,
    data: SubmitReviewRequest,
    token: string
  ): Promise<ReviewResponse> {
    return this.request(
      `${API_ENDPOINTS.SUBMIT_REVIEW}/${transactionId}/review`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  }

  // Tenant: Reply to review
  async replyToReview(
    reviewId: number,
    data: ReplyReviewRequest,
    token: string
  ): Promise<ReviewResponse> {
    return this.request(
      `${API_ENDPOINTS.REPLY_REVIEW}/${reviewId}/reply`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  }

  // Get property reviews (public)
  async getPropertyReviews(
    propertyId: number
  ): Promise<PropertyReviewsResponse> {
    return this.request(
      `${API_ENDPOINTS.PROPERTY_REVIEWS}/${propertyId}/reviews`,
      { method: 'GET' }
    );
  }
}

export const reviewAPI = new ReviewAPI();
