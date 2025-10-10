const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface CreateReservationData {
  roomId: number;
  checkIn: string;
  checkOut: string;
  duration: number;
  totalPrice: number;
}

class ReservationAPI {
  // Create new reservation
  async createReservation(data: CreateReservationData, token: string) {
    // ✅ CORRECT - Direct to /transactions (no /api prefix)
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create reservation");
    }

    return result;
  }

  // Upload payment proof
  async uploadPaymentProof(reservationId: number, file: File, token: string) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${API_BASE_URL}/transactions/${reservationId}/payment-proof`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to upload payment proof");
    }

    return result;
  }

  // Get user reservations
  async getUserReservations(token: string, status?: string, search?: string) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const queryString = params.toString();
    const url = queryString
      ? `${API_BASE_URL}/transactions/user?${queryString}`
      : `${API_BASE_URL}/transactions/user`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get reservations");
    }

    return result;
  }

  // Get tenant reservations
  async getTenantReservations(
    token: string,
    status?: string,
    propertyId?: number
  ) {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (propertyId) params.append("propertyId", propertyId.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_BASE_URL}/transactions?${queryString}`
      : `${API_BASE_URL}/transactions`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get reservations");
    }

    return result;
  }

  // Get reservation detail
  async getReservationDetail(reservationId: number, token: string) {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get reservation detail");
    }

    return result;
  }

  // Cancel reservation (User)
  async cancelReservation(reservationId: number, token: string) {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${reservationId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to cancel reservation");
    }

    return result;
  }

  // Confirm payment (Tenant)
  async confirmPayment(
    reservationId: number,
    isValid: boolean,
    rejectedReason: string | null,
    token: string
  ) {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${reservationId}/confirm-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isValid, rejectedReason }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to confirm payment");
    }

    return result;
  }

  // Cancel reservation (Tenant)
  async tenantCancelReservation(
    reservationId: number,
    reason: string,
    token: string
  ) {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${reservationId}/tenant-cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to cancel reservation");
    }

    return result;
  }
}

export const reservationAPI = new ReservationAPI();
