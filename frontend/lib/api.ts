import type { VideoInfo, APIError } from "@/types/video";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT = 10000; // 10 seconds

class APIClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData: APIError = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }
      
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      throw new Error("Invalid JSON response");
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
    });
    return this.handleResponse<T>(response);
  }
}

// Create singleton instance
const apiClient = new APIClient();

// API Methods
export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  return apiClient.post<VideoInfo>("/api/video-info", { url });
}

// Future API methods
export async function downloadVideo(url: string, format?: string): Promise<{ download_url: string }> {
  return apiClient.post<{ download_url: string }>("/api/download", { url, format });
}
