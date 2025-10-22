import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { LogoVariation } from "@/hooks/useLogoGeneration";
import { Skeleton } from "@/components/ui/skeleton";

interface LogoOutputPreviewProps {
  variations: LogoVariation[];
  onRegenerate?: () => void;
}

export function LogoOutputPreview({ variations, onRegenerate }: LogoOutputPreviewProps) {
  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `logo-variation-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Logo Variations</h3>
        {onRegenerate && (
          <Button
            onClick={onRegenerate}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {variations.map((variation, index) => (
          <div key={variation.id} className="space-y-3">
            <div className="aspect-square rounded-lg border border-border overflow-hidden bg-accent/5">
              {variation.isGenerating ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <img
                  src={variation.imageUrl}
                  alt={`Logo variation ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            {!variation.isGenerating && variation.imageUrl && (
              <Button
                onClick={() => handleDownload(variation.imageUrl, index)}
                variant="secondary"
                size="sm"
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-accent/10 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-semibold mb-2">💡 Pro Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Download all variations and test them at different sizes</li>
          <li>Consider how the logo looks in both light and dark backgrounds</li>
          <li>Use vector editing software to refine details if needed</li>
        </ul>
      </div>
    </div>
  );
}
