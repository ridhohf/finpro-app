const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ReportAPI {
  // Get sales report
  async getSalesReport(
    token: string,
    startDate?: string,
    endDate?: string,
    propertyId?: number
  ) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (propertyId) params.append("propertyId", propertyId.toString());

    const response = await fetch(
      `${API_BASE_URL}/reports/sales?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get sales report");
    }

    return result;
  }

  // Get property report (availability calendar)
  async getPropertyReport(
    token: string,
    propertyId: number,
    month: number,
    year: number
  ) {
    const response = await fetch(
      `${API_BASE_URL}/reports/property/${propertyId}?month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get property report");
    }

    return result;
  }

  // Get transaction summary
  async getTransactionSummary(
    token: string,
    startDate?: string,
    endDate?: string
  ) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await fetch(
      `${API_BASE_URL}/reports/summary?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get transaction summary");
    }

    return result;
  }
}

export const reportAPI = new ReportAPI();
