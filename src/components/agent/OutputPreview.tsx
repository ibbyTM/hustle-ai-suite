import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutputPreviewProps {
  content: string;
  usedKBFacts?: string[];
  generationNotes?: string;
}

export function OutputPreview({ content, usedKBFacts, generationNotes }: OutputPreviewProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hustlehub-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Generated Output</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="formatted" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formatted">Formatted</TabsTrigger>
          <TabsTrigger value="plain">Plain Text</TabsTrigger>
        </TabsList>

        <TabsContent value="formatted" className="flex-1 overflow-y-auto">
          <div className="bg-muted/30 rounded-lg p-6 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        </TabsContent>

        <TabsContent value="plain" className="flex-1 overflow-y-auto">
          <div className="bg-muted/30 rounded-lg p-6">
            <pre className="text-sm whitespace-pre-wrap font-mono">{content}</pre>
          </div>
        </TabsContent>
      </Tabs>

      {(usedKBFacts || generationNotes) && (
        <div className="mt-4 space-y-2">
          {usedKBFacts && usedKBFacts.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">Used KB Facts:</p>
              <ul className="text-xs space-y-1">
                {usedKBFacts.map((fact, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {generationNotes && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">Generation Notes:</p>
              <p className="text-xs text-muted-foreground">{generationNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
