"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useVideoInfo } from "@/hooks/useVideoInfo";
import { URLInput } from "@/components/URLInput";
import { VideoInfoCard } from "@/components/VideoInfoCard";

export default function HomePage() {
  const { data: videoInfo, loading, error, fetchInfo, reset } = useVideoInfo();

  const handleURLSubmit = async (url: string) => {
    try {
      await fetchInfo(url);
    } catch {
      // Error is already handled in the hook
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            Socio Video Downloader
          </h1>
          <p className="text-muted-foreground text-center">
            Analyze videos from social media platforms instantly
          </p>
        </CardHeader>
        <CardContent>
          <URLInput 
            onSubmit={handleURLSubmit}
            loading={loading}
            placeholder="Paste Instagram, TikTok, YouTube, or Twitter video URL..."
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {videoInfo && (
        <div className="space-y-4">
          <VideoInfoCard videoInfo={videoInfo} />
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full"
            >
              Analyze Another Video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
