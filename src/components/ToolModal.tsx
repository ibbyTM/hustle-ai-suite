import { useState } from "react";
import { X, Copy, Download, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AutomationTool } from "@/types/automation";
import { CategoryBadge } from "./CategoryBadge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ToolModalProps {
  tool: AutomationTool | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (output: string) => void;
}

export const ToolModal = ({ tool, isOpen, onClose, onSave }: ToolModalProps) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!tool) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Build the prompt from the template
      let prompt = tool.promptTemplate;
      
      // Handle fallback patterns like {customVibe|vibe}
      prompt = prompt.replace(/\{([^}|]+)\|([^}]+)\}/g, (match, primary, fallback) => {
        return inputs[primary]?.trim() || inputs[fallback] || match;
      });
      
      // Handle regular patterns like {niche}
      Object.entries(inputs).forEach(([key, value]) => {
        prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      });
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-hustle', {
        body: { 
          prompt,
          toolTitle: tool.title 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data?.generatedText) {
        throw new Error('No content received from AI');
      }

      setOutput(data.generatedText);
      toast.success("Generated! ✨");
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      
      if (errorMessage.includes('Rate limit')) {
        toast.error("Rate limit reached. Please wait a moment and try again.");
      } else if (errorMessage.includes('credits')) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleSave = () => {
    if (onSave) {
      onSave(output);
      toast.success("Saved to My Hustles!");
    }
  };

  const handleClose = () => {
    setInputs({});
    setOutput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{tool.emoji}</span>
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">{tool.title}</DialogTitle>
                <CategoryBadge category={tool.category} />
              </div>
            </div>
          </div>
          <p className="sr-only">Generate AI content using {tool.title}</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Inputs</h3>
            
            {tool.inputs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No inputs needed. Just hit Generate!</p>
            ) : (
              tool.inputs.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  )}
                  {field.type === "select" && (
                    <Select
                      value={inputs[field.id] || ""}
                      onValueChange={(value) => setInputs({ ...inputs, [field.id]: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                      className="bg-secondary border-border min-h-[100px]"
                    />
                  )}
                </div>
              ))
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              variant="gradient"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Output</h3>
              {output && (
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSave} variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {output ? (
              <div className="bg-secondary border border-border rounded-lg p-4 min-h-[400px] whitespace-pre-wrap">
                {output}
              </div>
            ) : (
              <div className="bg-secondary/50 border border-dashed border-border rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Your generated content will appear here ✨
                </p>
              </div>
            )}

            {output && (
              <p className="text-xs text-muted-foreground text-center">
                👉 Want more tools like this? Upgrade to Pro.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
