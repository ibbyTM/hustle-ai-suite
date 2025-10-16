import { useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTypewriter } from "@/hooks/useTypewriter";

interface OutputPreviewProps {
  content: string;
  usedKBFacts?: string[];
  generationNotes?: string;
}

export function OutputPreview({ content, usedKBFacts, generationNotes }: OutputPreviewProps) {
  const { toast } = useToast();
  const { displayedText, isComplete, skipAnimation } = useTypewriter(content, { speed: 20 });
  const formattedRef = useRef<HTMLDivElement>(null);
  const plainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formattedRef.current) {
      formattedRef.current.scrollTop = formattedRef.current.scrollHeight;
    }
    if (plainRef.current) {
      plainRef.current.scrollTop = plainRef.current.scrollHeight;
    }
  }, [displayedText]);

  const handleCopy = () => {
    if (!isComplete) return;
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (!isComplete) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hustlelab-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Generated Output</h3>
        <div className="flex gap-2">
          {!isComplete && (
            <Button variant="secondary" size="sm" onClick={skipAnimation}>
              <Zap className="h-4 w-4" />
              Skip
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            disabled={!isComplete}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            disabled={!isComplete}
          >
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

        <TabsContent value="formatted" className="flex-1 overflow-y-auto" ref={formattedRef}>
          <div className="bg-muted/30 rounded-lg p-6 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap">
              {displayedText}
              {!isComplete && <span className="animate-pulse ml-0.5 text-primary">|</span>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plain" className="flex-1 overflow-y-auto" ref={plainRef}>
          <div className="bg-muted/30 rounded-lg p-6">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {displayedText}
              {!isComplete && <span className="animate-pulse ml-0.5 text-primary">|</span>}
            </pre>
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
