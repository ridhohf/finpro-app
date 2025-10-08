import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class TenantAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  private async requestWithFile<T>(
    endpoint: string,
    formData: FormData,
    token: string,
    method: string = "POST"
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // ========== PROPERTY CATEGORIES ==========

  async getCategories(token: string): Promise<ApiResponse> {
    return this.request(
      API_ENDPOINTS.TENANT_CATEGORIES,
      { method: "GET" },
      token
    );
  }

  async getCategoryById(
    categoryId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_CATEGORIES}/${categoryId}`,
      { method: "GET" },
      token
    );
  }

  async createCategory(
    data: { name: string; description: string },
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      API_ENDPOINTS.TENANT_CATEGORIES,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  }

  async updateCategory(
    categoryId: number,
    data: { name?: string; description?: string },
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_CATEGORIES}/${categoryId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  }

  async deleteCategory(
    categoryId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_CATEGORIES}/${categoryId}`,
      { method: "DELETE" },
      token
    );
  }

  // ========== PROPERTIES ==========

  async getProperties(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      categoryId?: number;
      sortBy?: string;
      sortOrder?: string;
    },
    token: string
  ): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    return this.request(
      `${API_ENDPOINTS.TENANT_PROPERTIES}?${queryParams.toString()}`,
      { method: "GET" },
      token
    );
  }

  async getPropertyById(
    propertyId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_PROPERTIES}/${propertyId}`,
      { method: "GET" },
      token
    );
  }

  async createProperty(
    data: {
      categoryId: number;
      name: string;
      description: string;
      address: string;
      city: string;
    },
    images: File[],
    token: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    return this.requestWithFile(
      API_ENDPOINTS.TENANT_PROPERTIES,
      formData,
      token,
      "POST"
    );
  }

  async updateProperty(
    propertyId: number,
    data: {
      categoryId?: number;
      name?: string;
      description?: string;
      address?: string;
      city?: string;
    },
    images: File[],
    token: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    return this.requestWithFile(
      `${API_ENDPOINTS.TENANT_PROPERTIES}/${propertyId}`,
      formData,
      token,
      "PUT"
    );
  }

  async deleteProperty(
    propertyId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_PROPERTIES}/${propertyId}`,
      { method: "DELETE" },
      token
    );
  }

  // ========== ROOMS ==========

  async getRoomsByProperty(
    propertyId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_ROOMS}/property/${propertyId}`,
      { method: "GET" },
      token
    );
  }

  async getRoomById(roomId: number, token: string): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_ROOMS}/${roomId}`,
      { method: "GET" },
      token
    );
  }

  async createRoom(
    data: {
      propertyId: number;
      name: string;
      description: string;
      basePrice: number;
      maxGuests: number;
    },
    images: File[],
    token: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    return this.requestWithFile(
      API_ENDPOINTS.TENANT_ROOMS,
      formData,
      token,
      "POST"
    );
  }

  async updateRoom(
    roomId: number,
    data: {
      name?: string;
      description?: string;
      basePrice?: number;
      maxGuests?: number;
    },
    images: File[],
    token: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    images.forEach((image) => {
      formData.append("images", image);
    });

    return this.requestWithFile(
      `${API_ENDPOINTS.TENANT_ROOMS}/${roomId}`,
      formData,
      token,
      "PUT"
    );
  }

  async deleteRoom(roomId: number, token: string): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_ROOMS}/${roomId}`,
      { method: "DELETE" },
      token
    );
  }

  // ========== ROOM AVAILABILITY ==========

  async getAvailability(
    roomId: number,
    month: number,
    year: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_ROOM_AVAILABILITY}/${roomId}?month=${month}&year=${year}`,
      { method: "GET" },
      token
    );
  }

  async updateSingleAvailability(
    roomId: number,
    data: {
      date: string;
      isAvailable: boolean;
      priceOverride?: number;
    },
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_ROOM_AVAILABILITY}/${roomId}/single`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  }

  async bulkUpdateAvailability(
    roomId: number,
    data: {
      startDate: string;
      endDate: string;
      isAvailable: boolean;
      priceOverride?: number;
    },
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_ROOM_AVAILABILITY}/${roomId}/bulk`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  }

  // ========== PEAK SEASONS ==========

  async getPeakSeasons(roomId: number, token: string): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_PEAK_SEASONS}/room/${roomId}`,
      { method: "GET" },
      token
    );
  }

  async getPeakSeasonById(
    peakSeasonId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_PEAK_SEASONS}/${peakSeasonId}`,
      { method: "GET" },
      token
    );
  }

  async createPeakSeason(
    data: {
      roomId: number;
      name: string;
      startDate: string;
      endDate: string;
      priceIncreaseType: "percentage" | "nominal";
      value: number;
    },
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      API_ENDPOINTS.TENANT_PEAK_SEASONS,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  }

  async updatePeakSeason(
    peakSeasonId: number,
    data: {
      name?: string;
      startDate?: string;
      endDate?: string;
      priceIncreaseType?: "percentage" | "nominal";
      value?: number;
    },
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_PEAK_SEASONS}/${peakSeasonId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  }

  async deletePeakSeason(
    peakSeasonId: number,
    token: string
  ): Promise<ApiResponse> {
    return this.request(
      `${API_ENDPOINTS.TENANT_PEAK_SEASONS}/${peakSeasonId}`,
      { method: "DELETE" },
      token
    );
  }

  // ========== DASHBOARD ==========

  async getDashboard(token: string): Promise<ApiResponse> {
    return this.request(
      API_ENDPOINTS.TENANT_DASHBOARD,
      { method: "GET" },
      token
    );
  }
}

export const tenantAPI = new TenantAPI();
