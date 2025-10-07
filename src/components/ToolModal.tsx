import { useState, useEffect } from "react";
import { X, Copy, Sparkles, Link2, ExternalLink, Download, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AutomationTool } from "@/types/automation";
import { CategoryBadge } from "./CategoryBadge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { KnowledgeBase } from "@/types/knowledgeBase";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AuthorityBuilderModal } from "./AuthorityBuilderModal";
import { NewsletterInputPanel } from "./NewsletterInputPanel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ToolModalProps {
  tool: AutomationTool | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ToolModal = ({ tool, isOpen, onClose }: ToolModalProps) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKB, setSelectedKB] = useState<string | null>(null);
  const [attachedKB, setAttachedKB] = useState<KnowledgeBase | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use specialized modals for special tools
  if (tool?.id === "bookforge") {
    return <AuthorityBuilderModal isOpen={isOpen} onClose={onClose} />;
  }

  if (tool?.id === "inbox-influence") {
    return <NewsletterInputPanel isOpen={isOpen} onClose={onClose} />;
  }

  useEffect(() => {
    if (isOpen && user) {
      loadKnowledgeBases();
      loadAttachment();
    }
  }, [isOpen, user, tool]);

  const loadKnowledgeBases = async () => {
    const { data, error } = await supabase
      .from("knowledge_bases")
      .select("*")
      .order("updated_at", { ascending: false });
    
    if (!error && data) {
      setKnowledgeBases(data.map(kb => ({
        ...kb,
        brand_voice: kb.brand_voice as any,
        products: kb.products as any,
        audience: kb.audience as any,
        offers: kb.offers as any,
        faqs: kb.faqs as any,
      })));
    }
  };

  const loadAttachment = async () => {
    if (!tool) return;
    
    const { data, error } = await supabase
      .from("tool_attachments")
      .select("knowledge_base_id")
      .eq("tool_id", tool.id)
      .maybeSingle();
    
    if (data) {
      setSelectedKB(data.knowledge_base_id);
      const kb = knowledgeBases.find(k => k.id === data.knowledge_base_id);
      if (kb) setAttachedKB(kb);
    }
  };

  const handleAttachKB = async (kbId: string | null) => {
    if (!tool || !user) return;
    
    try {
      if (kbId) {
        await supabase
          .from("tool_attachments")
          .upsert({
            user_id: user.id,
            tool_id: tool.id,
            knowledge_base_id: kbId
          });
        
        const kb = knowledgeBases.find(k => k.id === kbId);
        setAttachedKB(kb || null);
        toast.success("Knowledge base attached");
      } else {
        await supabase
          .from("tool_attachments")
          .delete()
          .eq("tool_id", tool.id);
        
        setAttachedKB(null);
        toast.success("Knowledge base detached");
      }
      setSelectedKB(kbId);
    } catch (error: any) {
      toast.error("Failed to update attachment");
    }
  };

  const buildKBContext = () => {
    if (!attachedKB) return "";
    
    let context = "\n\nKNOWLEDGE BASE CONTEXT:\n";
    
    if (attachedKB.brand_voice?.tone) {
      context += `\nBrand Tone: ${attachedKB.brand_voice.tone}`;
    }
    if (attachedKB.brand_voice?.style) {
      context += `\nBrand Style: ${attachedKB.brand_voice.style}`;
    }
    if (attachedKB.brand_voice?.dos && attachedKB.brand_voice.dos.length > 0) {
      context += `\nDo's: ${attachedKB.brand_voice.dos.join(", ")}`;
    }
    if (attachedKB.brand_voice?.donts && attachedKB.brand_voice.donts.length > 0) {
      context += `\nDon'ts: ${attachedKB.brand_voice.donts.join(", ")}`;
    }
    
    if (attachedKB.products && attachedKB.products.length > 0) {
      const product = attachedKB.products[0];
      if (product.name) context += `\nProduct: ${product.name}`;
      if (product.features && product.features.length > 0) {
        context += `\nFeatures: ${product.features.join(", ")}`;
      }
      if (product.benefits && product.benefits.length > 0) {
        context += `\nBenefits: ${product.benefits.join(", ")}`;
      }
    }
    
    if (attachedKB.audience?.icp) {
      context += `\nTarget Audience: ${attachedKB.audience.icp}`;
    }
    if (attachedKB.audience?.pains && attachedKB.audience.pains.length > 0) {
      context += `\nAudience Pain Points: ${attachedKB.audience.pains.join(", ")}`;
    }
    
    return context;
  };

  if (!tool) return null;

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate content");
      return;
    }

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
      
      // Add knowledge base context if attached
      if (attachedKB) {
        prompt += buildKBContext();
      }
      
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

      const generatedOutput = data.generatedText;
      setOutput(generatedOutput);

      // Auto-save to database
      const { error: saveError } = await supabase
        .from("generations")
        .insert({
          user_id: user.id,
          tool_id: tool.id,
          tool_title: tool.title,
          tool_emoji: tool.emoji,
          inputs: inputs,
          output: generatedOutput,
        });

      if (saveError) {
        console.error("Save error:", saveError);
        toast.success("Generated! ✨ (Failed to save to history)");
      } else {
        toast.success("Generated and saved! ✨");
      }
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

  const handleDownload = (format: 'txt') => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool?.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format.toUpperCase()}!`);
  };

  const needsKB = tool && tool.kbRequirement !== "none";
  const isDownloadableTool = tool?.id === 'bookforge' || tool?.id === 'hustle-sprint';


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

        {needsKB && (
          <div className="mb-4 p-4 border border-border rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">
                Knowledge Base
                {tool.kbRequirement === "required" && (
                  <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                )}
                {tool.kbRequirement === "recommended" && (
                  <Badge variant="secondary" className="ml-2 text-xs">Recommended</Badge>
                )}
              </Label>
            </div>
            <div className="flex flex-col gap-2">
              <Select
                value={selectedKB || "none"}
                onValueChange={(value) => {
                  if (value === "create-new") {
                    navigate("/knowledge-bases/new");
                  } else {
                    handleAttachKB(value === "none" ? null : value);
                  }
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select knowledge base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Use without KB</SelectItem>
                  {knowledgeBases.map((kb) => (
                    <SelectItem key={kb.id} value={kb.id}>
                      {kb.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="create-new" className="text-primary font-medium">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create new KB
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {attachedKB && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Link2 className="h-3 w-3" />
                    Using: {attachedKB.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/knowledge-bases/${attachedKB.id}`)}
                    className="h-7 gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Inputs</h3>
            
            {tool.inputs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No inputs needed. Just hit Generate!</p>
            ) : (
              tool.inputs.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  
                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  )}
                  
                  {field.type === "number" && (
                    <Input
                      id={field.id}
                      type="number"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                      className="bg-secondary border-border"
                      min={field.min}
                      max={field.max}
                    />
                  )}
                  
                  {field.type === "url" && (
                    <Input
                      id={field.id}
                      type="url"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [field.id]: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  )}
                  
                  {field.type === "select" && (
                    <Select
                      value={inputs[field.id] || field.defaultValue || ""}
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
                  
                  {field.type === "multiselect" && (
                    <div className="space-y-2">
                      {field.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field.id}-${option}`}
                            checked={inputs[field.id]?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const current = inputs[field.id] || [];
                              const updated = checked
                                ? [...current, option]
                                : current.filter((v: string) => v !== option);
                              setInputs({ ...inputs, [field.id]: updated });
                            }}
                          />
                          <label
                            htmlFor={`${field.id}-${option}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {field.type === "toggle" && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={field.id}
                        checked={inputs[field.id] !== undefined ? inputs[field.id] : field.defaultValue}
                        onCheckedChange={(checked) => setInputs({ ...inputs, [field.id]: checked })}
                      />
                      <Label htmlFor={field.id} className="text-sm text-muted-foreground">
                        {inputs[field.id] !== undefined ? inputs[field.id] : field.defaultValue ? "On" : "Off"}
                      </Label>
                    </div>
                  )}
                  
                  {field.type === "date" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-secondary",
                            !inputs[field.id] && "text-muted-foreground"
                          )}
                        >
                          {inputs[field.id] ? (
                            format(new Date(inputs[field.id]), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={inputs[field.id] ? new Date(inputs[field.id]) : undefined}
                          onSelect={(date) => setInputs({ ...inputs, [field.id]: date?.toISOString() })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                  
                  {field.type === "file" && (
                    <Input
                      id={field.id}
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setInputs({ ...inputs, [field.id]: file });
                        }
                      }}
                      className="bg-secondary border-border"
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
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  {isDownloadableTool && (
                    <Button onClick={() => handleDownload('txt')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {output && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-green-500">✓</span>
                <span>Saved to My Hustles</span>
              </div>
            )}
            
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
