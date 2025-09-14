import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Clock, HardDrive } from "lucide-react";
import type { VideoInfo } from "@/types/video";
import { apiClient } from "@/lib/api";

interface VideoInfoCardProps {
  videoInfo: VideoInfo;
  onDownloadComplete?: () => void;
}

export function VideoInfoCard({ videoInfo, onDownloadComplete }: VideoInfoCardProps) {
  const [downloading, setDownloading] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDownload = async (format: string = "best[height<=720]") => {
    setDownloading(true);

    try {
      const result = await apiClient.downloadVideo(videoInfo.original_url, format);
      
      // Trigger browser download
      const link = document.createElement('a');
      link.href = result.download_url;
      link.download = `${result.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Notify parent component to refresh usage
      if (onDownloadComplete) {
        onDownloadComplete();
      }

    } catch (error: unknown) {
      // Handle rate limit errors
      if (error instanceof Error && error.message?.includes("Daily download limit")) {
        try {
          const errorData = JSON.parse(error.message);
          alert(`Daily limit reached! Resets in ${errorData.reset_in_hours} hours.`);
        } catch {
          alert("Daily download limit reached. Please try again tomorrow.");
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Download failed: ${errorMessage}`);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        {videoInfo.thumbnail && (
          <img 
            src={videoInfo.thumbnail} 
            alt={videoInfo.title}
            className="w-full max-h-48 object-cover rounded-lg"
            loading="lazy"
          />
        )}
        <div>
          <h2 className="text-lg font-bold line-clamp-2 mb-2">{videoInfo.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="capitalize">
              {videoInfo.platform}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(videoInfo.duration)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Available Formats */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Available Formats:</h3>
          <div className="grid grid-cols-1 gap-2">
            {videoInfo.formats.slice(0, 3).map((format, index) => (
              <div 
                key={index}
                className="text-xs bg-muted p-2 rounded flex justify-between items-center"
              >
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {format.ext.toUpperCase()}
                  </Badge>
                  {format.format_note}
                </span>
                {format.filesize && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <HardDrive className="h-3 w-3" />
                    {formatFileSize(format.filesize)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleDownload("best[height<=720]")} 
            disabled={downloading}
            className="flex-1"
          >
            {downloading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading...</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> HD Quality</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleDownload("worst[height>=360]")} 
            disabled={downloading}
          >
            {downloading ? "Processing..." : "SD Quality"}
          </Button>
        </div>

        {/* Download Info */}
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          💡 Downloads expire in 24 hours. Save to your device immediately.
        </div>
      </CardContent>
    </Card>
  );
}
