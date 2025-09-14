export interface VideoFormat {
  format_note: string;
  ext: string;
  filesize?: number;
}

export interface VideoInfo {
  title: string;
  platform: string;
  thumbnail: string;
  duration: number;
  original_url: string;
  formats: VideoFormat[];
}

export interface UsageInfo {
  downloads_used: number;
  downloads_remaining: number;
  reset_in_hours: number;
  reset_time: string;
}

export interface DownloadResult {
  download_id: string;
  title: string;
  duration: number;
  file_size: number;
  download_url: string;
  expires_at: string;
  usage: {
    downloads_used: number;
    downloads_remaining: number;
  };
}
