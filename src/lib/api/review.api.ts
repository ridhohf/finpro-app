const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateReviewData {
  reservationId: number;
  rating: number;
  comment: string;
}

class ReviewAPI {
  // Create review
  async createReview(data: CreateReviewData, token: string) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create review");
    }

    return result;
  }

  // Reply to review (Tenant)
  async replyToReview(reviewId: number, reply: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reply }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to reply to review");
    }

    return result;
  }

  // Get property reviews
  async getPropertyReviews(propertyId: number) {
    const response = await fetch(
      `${API_BASE_URL}/reviews/property/${propertyId}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get reviews");
    }

    return result;
  }

  // Check if user can review
  async canUserReview(reservationId: number, token: string) {
    const response = await fetch(
      `${API_BASE_URL}/reviews/can-review/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to check review eligibility");
    }

    return result;
  }
}

export const reviewAPI = new ReviewAPI();
