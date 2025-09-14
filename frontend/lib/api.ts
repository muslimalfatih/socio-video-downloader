import type { VideoInfo, UsageInfo, DownloadResult } from "@/types/video";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async fetchVideoInfo(url: string): Promise<VideoInfo> {
    return this.request<VideoInfo>("/api/video-info", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }

  async downloadVideo(url: string, format?: string): Promise<DownloadResult> {
    return this.request<DownloadResult>("/api/download", {
      method: "POST",
      body: JSON.stringify({ url, format }),
    });
  }

  async getUsage(): Promise<UsageInfo> {
    return this.request<UsageInfo>("/api/usage");
  }
}

export const apiClient = new APIClient();
