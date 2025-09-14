export interface VideoFormat {
  format_note: string;
  ext: string;
  url?: string;
}

export interface VideoInfo {
  title: string;
  platform: string;
  thumbnail: string;
  duration: number;
  formats: VideoFormat[];
}

export interface APIError {
  detail: string;
  status?: number;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
