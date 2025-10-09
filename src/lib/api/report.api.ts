import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type {
  SalesReportFilter,
  AvailabilityReportFilter,
  SalesReportResponse,
  AvailabilityReportResponse,
} from '@/types/report.types';

class ReportAPI {
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

  // Get sales report
  async getSalesReport(
    tenantId: number,
    token: string,
    filters?: SalesReportFilter
  ): Promise<SalesReportResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = filters
      ? `${
          API_ENDPOINTS.SALES_REPORT
        }/${tenantId}/sales?${queryParams.toString()}`
      : `${API_ENDPOINTS.SALES_REPORT}/${tenantId}/sales`;

    return this.request(endpoint, { method: 'GET' }, token);
  }

  // Get availability report
  async getAvailabilityReport(
    tenantId: number,
    token: string,
    filters?: AvailabilityReportFilter
  ): Promise<AvailabilityReportResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = filters
      ? `${
          API_ENDPOINTS.AVAILABILITY_REPORT
        }/${tenantId}/availability?${queryParams.toString()}`
      : `${API_ENDPOINTS.AVAILABILITY_REPORT}/${tenantId}/availability`;

    return this.request(endpoint, { method: 'GET' }, token);
  }
}

export const reportAPI = new ReportAPI();
