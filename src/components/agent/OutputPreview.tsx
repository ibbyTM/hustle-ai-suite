import { useRef, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Zap, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTypewriter } from "@/hooks/useTypewriter";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface OutputPreviewProps {
  content: string;
  usedKBFacts?: string[];
  generationNotes?: string;
  generationId?: string;
  onContentUpdate?: (newContent: string) => void;
}

export function OutputPreview({ content, usedKBFacts, generationNotes, generationId, onContentUpdate }: OutputPreviewProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const { displayedText, isComplete, skipAnimation } = useTypewriter(content, { speed: 20, enabled: !isEditing });
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
    const contentToDownload = isEditing ? editedContent : content;
    const blob = new Blob([contentToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hustlelab-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!generationId) {
      toast({
        title: "Cannot save",
        description: "No generation ID available",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("generations")
        .update({ output: editedContent })
        .eq("id", generationId);

      if (error) throw error;

      onContentUpdate?.(editedContent);
      setIsEditing(false);
      toast({
        title: "Saved",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Generated Output</h3>
        <div className="flex gap-2">
          {!isComplete && !isEditing && (
            <Button variant="secondary" size="sm" onClick={skipAnimation}>
              <Zap className="h-4 w-4" />
              Skip
            </Button>
          )}
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              {generationId && isComplete && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  Edit
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
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex-1 overflow-y-auto">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm resize-none"
            placeholder="Edit your content here..."
          />
        </div>
      ) : (
        <Tabs defaultValue="formatted" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formatted">Formatted</TabsTrigger>
            <TabsTrigger value="plain">Plain Text</TabsTrigger>
          </TabsList>

          <TabsContent value="formatted" className="flex-1 overflow-y-auto" ref={formattedRef}>
            <div className="bg-muted/30 rounded-lg p-6 prose prose-invert max-w-none">
              <ReactMarkdown className="whitespace-pre-wrap">
                {displayedText}
              </ReactMarkdown>
              {!isComplete && <span className="animate-pulse ml-0.5 text-primary">|</span>}
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
      )}

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
