import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface URLInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export function URLInput({ onSubmit, loading = false, placeholder = "Paste video URL here..." }: URLInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const canSubmit = url.trim() && isValidURL(url.trim()) && !loading;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        disabled={loading}
      />
      <Button 
        type="submit" 
        disabled={!canSubmit}
        className="min-w-[100px]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </>
        ) : (
          "Analyze"
        )}
      </Button>
    </form>
  );
}
