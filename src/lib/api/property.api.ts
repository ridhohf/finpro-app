import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import type {
  PropertySearchResponse,
  PropertyDetail,
  PriceCalendar,
  SearchParams,
} from "../../types/property.types";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class PropertyAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  async searchProperties(
    params: SearchParams
  ): Promise<PropertySearchResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    return this.request(
      `${API_ENDPOINTS.PROPERTY_SEARCH}?${queryParams.toString()}`
    );
  }

  async getPropertyDetail(
    propertyId: number,
    checkIn?: string,
    checkOut?: string
  ): Promise<ApiResponse<PropertyDetail>> {
    const queryParams = new URLSearchParams();
    if (checkIn) queryParams.append("checkIn", checkIn);
    if (checkOut) queryParams.append("checkOut", checkOut);

    return this.request(
      `${
        API_ENDPOINTS.PROPERTY_DETAIL
      }/${propertyId}/detail?${queryParams.toString()}`
    );
  }

  async getRoomPriceCalendar(
    roomId: number,
    month: number,
    year: number
  ): Promise<ApiResponse<PriceCalendar>> {
    return this.request(
      `${API_ENDPOINTS.ROOM_CALENDAR}/${roomId}/calendar?month=${month}&year=${year}`
    );
  }

  async getCities(): Promise<ApiResponse<string[]>> {
    return this.request(API_ENDPOINTS.PROPERTY_CITIES);
  }
}

export const propertyAPI = new PropertyAPI();
