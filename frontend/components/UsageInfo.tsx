import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Download } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { UsageInfo as UsageInfoType } from "@/types/video";

export function UsageInfo() {
  const [usage, setUsage] = useState<UsageInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const data = await apiClient.getUsage();
      setUsage(data);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh usage info
  const refreshUsage = () => {
    fetchUsage();
  };

  if (loading || !usage) return null;

  const usagePercentage = (usage.downloads_used / 5) * 100;
  const isNearLimit = usage.downloads_remaining <= 1;

  return (
    <Card className={`${isNearLimit ? 'border-yellow-200 bg-yellow-50' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Daily Downloads
          </span>
          <span className="font-medium">
            {usage.downloads_used}/5 used
          </span>
        </div>
        
        <Progress 
          value={usagePercentage} 
          className={`h-2 ${isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{usage.downloads_remaining} downloads remaining</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Resets in {usage.reset_in_hours}h
          </span>
        </div>
        
        {isNearLimit && (
          <div className="mt-2 text-xs text-yellow-700">
            ⚠️ Almost at daily limit. Consider upgrading for unlimited downloads!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
