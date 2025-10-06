import { useState } from "react";
import { Trash2, Copy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedHustle } from "@/types/automation";
import { toast } from "sonner";

export default function MyHustles() {
  const [hustles] = useState<SavedHustle[]>([]);

  const handleCopy = (output: string) => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Hustles</h1>
        <p className="text-muted-foreground text-lg">
          All your saved outputs in one place. Copy, share, or export.
        </p>
      </div>

      {hustles.length === 0 ? (
        <div className="bg-gradient-card border border-border rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-2">No hustles saved yet</h2>
            <p className="text-muted-foreground mb-6">
              Generate some content with our tools and save your favorites here!
            </p>
            <Button variant="gradient">
              Browse Tools
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {hustles.map((hustle) => (
            <div
              key={hustle.id}
              className="bg-gradient-card border border-border rounded-2xl p-6 hover:shadow-glow transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{hustle.toolTitle}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(hustle.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(hustle.output)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {hustle.output}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
