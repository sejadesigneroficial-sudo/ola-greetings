import { X, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useIsMobile } from "@/hooks/use-mobile";

export const AppDownloadBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { appSettings, loading } = useAppSettings();
  const isMobile = useIsMobile();

  // Only show on mobile and if APK is available
  if (!isVisible || loading || !appSettings?.apk_url || !isMobile) return null;

  const handleDownload = () => {
    if (appSettings?.apk_url) {
      window.location.href = appSettings.apk_url;
    }
  };

  return (
    <div className="bg-gradient-to-r from-accent to-accent/90 text-accent-foreground py-2.5 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
            <Download className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate">App arremate24h</p>
            <p className="text-xs opacity-90 truncate">Lance de qualquer lugar</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            className="bg-white text-accent hover:bg-white/90 text-xs font-bold h-8 px-3 shadow-sm"
            onClick={handleDownload}
          >
            Instalar
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
