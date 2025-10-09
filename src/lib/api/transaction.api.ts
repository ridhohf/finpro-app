import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type {
  Transaction,
  TransactionResponse,
  TransactionListResponse,
  CreateBookingRequest,
  TransactionFilter,
} from '@/types/transaction.types';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class TransactionAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
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

  private async requestWithFile<T>(
    endpoint: string,
    formData: FormData,
    token: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Upload failed');
    }

    return data;
  }

  // Create booking/transaction
  async createBooking(
    data: CreateBookingRequest,
    token: string
  ): Promise<TransactionResponse> {
    return this.request(
      API_ENDPOINTS.TRANSACTIONS,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  }

  // Get all transactions (user or tenant)
  async getAllTransactions(
    token: string,
    filters?: TransactionFilter
  ): Promise<TransactionListResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = filters
      ? `${API_ENDPOINTS.TRANSACTIONS}?${queryParams.toString()}`
      : API_ENDPOINTS.TRANSACTIONS;

    return this.request(endpoint, { method: 'GET' }, token);
  }

  // Get transaction detail by ID
  async getTransactionById(
    id: number,
    token: string
  ): Promise<TransactionResponse> {
    return this.request(
      `${API_ENDPOINTS.TRANSACTION_DETAIL}/${id}`,
      { method: 'GET' },
      token
    );
  }

  // Upload payment proof
  async uploadPaymentProof(
    transactionId: number,
    file: File,
    token: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('paymentProof', file);

    return this.requestWithFile(
      `${API_ENDPOINTS.UPLOAD_PAYMENT}/${transactionId}/upload-payment`,
      formData,
      token
    );
  }

  // Tenant: Confirm payment
  async confirmPayment(
    transactionId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.CONFIRM_PAYMENT}/${transactionId}/confirm`,
      { method: 'PATCH' },
      token
    );
  }

  // Tenant: Reject payment
  async rejectPayment(
    transactionId: number,
    reason: string,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.REJECT_PAYMENT}/${transactionId}/reject`,
      {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      },
      token
    );
  }

  // Cancel transaction (user or tenant)
  async cancelTransaction(
    transactionId: number,
    reason: string | undefined,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.CANCEL_TRANSACTION}/${transactionId}/cancel`,
      {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      },
      token
    );
  }
}

export const transactionAPI = new TransactionAPI();
