export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = {
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      throw new ApiError(result.error || result.message, response.status);
    }

    return result.data as T;
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
    );
    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      throw new ApiError(result.error || result.message, response.status);
    }

    return result.data as T;
  },
};
