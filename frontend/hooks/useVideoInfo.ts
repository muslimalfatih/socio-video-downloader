import { useState, useCallback } from "react";
import type { VideoInfo, FetchState } from "@/types/video";
import { fetchVideoInfo } from "@/lib/api";

export function useVideoInfo() {
  const [state, setState] = useState<FetchState<VideoInfo>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchInfo = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchVideoInfo(url);
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
