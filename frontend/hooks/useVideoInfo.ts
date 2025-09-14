import { useState, useCallback } from "react";
import type { VideoInfo } from "@/types/video";
import { apiClient } from "@/lib/api";

interface FetchState {
  data: VideoInfo | null;
  loading: boolean;
  error: string | null;
}

export function useVideoInfo() {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchInfo = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiClient.fetchVideoInfo(url);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    fetchInfo,
    reset,
  };
}
