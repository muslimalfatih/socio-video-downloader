import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VideoInfo } from "@/types/video";



interface VideoInfoCardProps {
  videoInfo: VideoInfo;
}

export function VideoInfoCard({ videoInfo }: VideoInfoCardProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        {videoInfo.thumbnail && (
          <Image 
            width={400}
            height={200}
            src={videoInfo.thumbnail} 
            alt={videoInfo.title}
            className="w-full max-h-48 object-cover rounded-lg"
            loading="lazy"
          />
        )}
        <div>
          <h2 className="text-lg font-bold line-clamp-2">{videoInfo.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">
              {videoInfo.platform}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDuration(videoInfo.duration)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Available Formats:</h3>
          <div className="grid grid-cols-2 gap-2">
            {videoInfo.formats.map((format, index) => (
              <div 
                key={index}
                className="text-xs bg-muted p-2 rounded flex justify-between items-center"
              >
                <span>{format.format_note}</span>
                <Badge variant="outline" className="text-xs">
                  {format.ext.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
