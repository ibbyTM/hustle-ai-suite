import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KnowledgeBase } from "@/types/knowledgeBase";
import { ChevronDown, Info, Download, Copy, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface NewsletterInputPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewsletterInputs {
  issue_topic: string;
  audience_segment: string;
  goal: "Sell" | "Educate" | "Nurture" | "Announce";
  tone: string;
  subject_mode: "auto" | "custom";
  custom_subject: string;
  subject_count: number;
  preheader: string;
  cta_button_text: string;
  cta_url: string;
  utm_campaign: string;
  kb_id: string | null;
  personalization: boolean;
  length_target: "short" | "standard" | "long";
  ab_test_enabled: boolean;
  send_time_auto: boolean;
  include_html: boolean;
}

interface NewsletterOutput {
  subject_options: string[];
  preheader: string;
  plain_text: string;
  html_snippet: string;
  cta_button_text_options: string[];
  cta_full_url: string;
  ab_test_pairs: Array<{ a: string; b: string; reason: string }>;
  send_time_suggestion: string;
  metric_to_track: string;
  follow_up_plan: Array<{ delay_days: number; subject: string; purpose: string }>;
  used_kb_facts: string[];
  generation_notes: string;
}

const goalOptions = [
  { value: "Sell", label: "Sell", description: "drive purchases / signups" },
  { value: "Educate", label: "Educate", description: "teach & retain customers" },
  { value: "Nurture", label: "Nurture", description: "engage & build trust" },
  { value: "Announce", label: "Announce", description: "product/news update" },
];

const toneOptions = ["Authoritative", "Direct", "Warm", "Conversational", "Playful"];

const tonePreview: Record<string, string> = {
  Authoritative: "You're leaving money on the table. Here's how to fix it.",
  Direct: "Your Facebook page is costing you customers. Here's what to do.",
  Warm: "Hey there! Let's talk about turning your Facebook page into a customer magnet.",
  Conversational: "So... your Facebook page might be hurting your business. Let's chat about it.",
  Playful: "Plot twist: Your Facebook page could be secretly sabotaging you! 😅"
};

const ctaSuggestions: Record<string, string[]> = {
  Sell: ["Book a Free Audit", "Claim Your Spot", "Buy Now", "Get Started", "Join Today"],
  Educate: ["Read the Guide", "Learn More", "Download Now", "Get the Checklist"],
  Nurture: ["Keep Reading", "Tell Me More", "Join the Community", "Stay Connected"],
  Announce: ["Check It Out", "See What's New", "Learn More", "Get Access"],
};

export function NewsletterInputPanel({ isOpen, onClose }: NewsletterInputPanelProps) {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<NewsletterInputs>({
    issue_topic: "",
    audience_segment: "",
    goal: "Sell",
    tone: "Authoritative",
    subject_mode: "auto",
    custom_subject: "",
    subject_count: 3,
    preheader: "",
    cta_button_text: "",
    cta_url: "",
    utm_campaign: "",
    kb_id: null,
    personalization: true,
    length_target: "standard",
    ab_test_enabled: true,
    send_time_auto: true,
    include_html: true,
  });

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<NewsletterOutput | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadKnowledgeBases();
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-generate UTM campaign slug from issue topic
    if (inputs.issue_topic) {
      const slug = inputs.issue_topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50);
      setInputs(prev => ({ ...prev, utm_campaign: slug }));
    }
  }, [inputs.issue_topic]);

  const loadKnowledgeBases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("knowledge_bases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKnowledgeBases(data || []);
    } catch (error) {
      console.error("Error loading knowledge bases:", error);
    }
  };

  const handleGenerate = async () => {
    if (!inputs.issue_topic.trim() || inputs.issue_topic.length > 120) {
      toast({
        title: "Validation Error",
        description: "Issue Topic is required and must be less than 120 characters.",
        variant: "destructive",
      });
      return;
    }

    if (inputs.goal === "Sell" && !inputs.cta_url && !inputs.cta_button_text) {
      toast({
        title: "Warning",
        description: "No CTA URL provided — newsletter will use reply CTA. Add a URL for button CTAs.",
      });
    }

    setIsGenerating(true);
    setShowPreview(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("generate-newsletter", {
        body: inputs,
      });

      if (error) throw error;

      setOutput(data as NewsletterOutput);
      setShowPreview(true);

      toast({
        title: "Newsletter Generated",
        description: "Your newsletter draft is ready!",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setInputs({
      issue_topic: "",
      audience_segment: "",
      goal: "Sell",
      tone: "Authoritative",
      subject_mode: "auto",
      custom_subject: "",
      subject_count: 3,
      preheader: "",
      cta_button_text: "",
      cta_url: "",
      utm_campaign: "",
      kb_id: null,
      personalization: true,
      length_target: "standard",
      ab_test_enabled: true,
      send_time_auto: true,
      include_html: true,
    });
    setOutput(null);
    setShowPreview(false);
    onClose();
  };

  const isFormValid = inputs.issue_topic.trim().length > 0 && inputs.issue_topic.length <= 120;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>📧 Inbox Influence — Newsletter Builder</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Input Panel */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            {/* Context */}
            <div className="space-y-4">
              <TooltipProvider>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="issue_topic">Issue Topic *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Describe the specific focus for this email in one sentence.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="issue_topic"
                    value={inputs.issue_topic}
                    onChange={(e) => setInputs({ ...inputs, issue_topic: e.target.value })}
                    placeholder="What is this issue about? e.g., Why your Facebook page is costing you customers"
                    maxLength={120}
                    aria-label="Issue Topic"
                  />
                  <p className="text-xs text-muted-foreground">{inputs.issue_topic.length}/120</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="audience_segment">Audience Segment</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Optional — who should this email speak to? Use KB suggestions if available.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="audience_segment"
                    value={inputs.audience_segment}
                    onChange={(e) => setInputs({ ...inputs, audience_segment: e.target.value })}
                    placeholder="e.g., local small business owners, fitness studio owners"
                    aria-label="Audience Segment"
                  />
                </div>
              </TooltipProvider>
            </div>

            <Separator />

            {/* Goal & Tone */}
            <div className="grid grid-cols-2 gap-4">
              <TooltipProvider>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="goal">Goal *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pick the primary aim. This determines structure and CTA style.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={inputs.goal} onValueChange={(value: any) => setInputs({ ...inputs, goal: value })}>
                    <SelectTrigger id="goal" aria-label="Goal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div>
                            <div className="font-medium">{opt.label}</div>
                            <div className="text-xs text-muted-foreground">{opt.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tone">Tone *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How should this sound? Select to preview a sample opening sentence.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={inputs.tone} onValueChange={(value) => setInputs({ ...inputs, tone: value })}>
                    <SelectTrigger id="tone" aria-label="Tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {inputs.tone && (
                    <p className="text-xs text-muted-foreground italic">{tonePreview[inputs.tone]}</p>
                  )}
                </div>
              </TooltipProvider>
            </div>

            <Separator />

            {/* Subject & Preheader */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label>Subject Line Mode</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Auto-generate (recommended)</span>
                  <Switch
                    checked={inputs.subject_mode === "custom"}
                    onCheckedChange={(checked) => setInputs({ ...inputs, subject_mode: checked ? "custom" : "auto" })}
                    aria-label="Subject Line Mode"
                  />
                  <span className="text-sm">Custom</span>
                </div>
              </div>

              {inputs.subject_mode === "custom" && (
                <Input
                  value={inputs.custom_subject}
                  onChange={(e) => setInputs({ ...inputs, custom_subject: e.target.value })}
                  placeholder="Enter custom subject seed"
                  aria-label="Custom Subject"
                />
              )}

              <div className="space-y-2">
                <Label>Number of Subject Options</Label>
                <RadioGroup
                  value={inputs.subject_count.toString()}
                  onValueChange={(value) => setInputs({ ...inputs, subject_count: parseInt(value) })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="count-2" />
                    <Label htmlFor="count-2">2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="count-3" />
                    <Label htmlFor="count-3">3 (default)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="count-5" />
                    <Label htmlFor="count-5">5</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preheader">Preheader (optional)</Label>
                <Input
                  id="preheader"
                  value={inputs.preheader}
                  onChange={(e) => setInputs({ ...inputs, preheader: e.target.value })}
                  placeholder="Auto-generate preheader"
                  aria-label="Preheader"
                />
              </div>
            </div>

            <Separator />

            {/* CTA & Tracking */}
            <div className="space-y-4">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Label>Primary CTA</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>If left blank, the newsletter will include an inline reply CTA.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <div className="space-y-2">
                <Label htmlFor="cta_button_text">CTA Button Text</Label>
                <Input
                  id="cta_button_text"
                  value={inputs.cta_button_text}
                  onChange={(e) => setInputs({ ...inputs, cta_button_text: e.target.value })}
                  placeholder={ctaSuggestions[inputs.goal]?.[0] || "Enter button text"}
                  aria-label="CTA Button Text"
                />
                <p className="text-xs text-muted-foreground">
                  Suggestions: {ctaSuggestions[inputs.goal]?.join(", ")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_url">CTA URL</Label>
                <Input
                  id="cta_url"
                  type="url"
                  value={inputs.cta_url}
                  onChange={(e) => setInputs({ ...inputs, cta_url: e.target.value })}
                  placeholder="https://"
                  aria-label="CTA URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm_campaign">UTM Campaign Slug</Label>
                <Input
                  id="utm_campaign"
                  value={inputs.utm_campaign}
                  onChange={(e) => setInputs({ ...inputs, utm_campaign: e.target.value })}
                  placeholder="auto-generated-slug"
                  aria-label="UTM Campaign Slug"
                />
                <p className="text-xs text-muted-foreground">
                  Will append: ?utm_source=newsletter&utm_medium=email&utm_campaign={inputs.utm_campaign}
                </p>
              </div>
            </div>

            <Separator />

            {/* KB & Personalization */}
            <div className="space-y-4">
              <TooltipProvider>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="kb_id">Attach Knowledge Base</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach a KB to pull brand facts, testimonials, product names, and tone.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={inputs.kb_id || "none"}
                    onValueChange={(value) => setInputs({ ...inputs, kb_id: value === "none" ? null : value })}
                  >
                    <SelectTrigger id="kb_id" aria-label="Knowledge Base">
                      <SelectValue placeholder="Use without KB" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Use without KB</SelectItem>
                      {knowledgeBases.map((kb) => (
                        <SelectItem key={kb.id} value={kb.id}>
                          {kb.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TooltipProvider>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personalization"
                  checked={inputs.personalization}
                  onCheckedChange={(checked) => setInputs({ ...inputs, personalization: checked as boolean })}
                />
                <Label htmlFor="personalization" className="cursor-pointer">
                  Include Personalization Tokens (first_name, company)
                </Label>
              </div>
            </div>

            <Separator />

            {/* Advanced */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Advanced Options
                  <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label>Send Time Suggestion</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Auto</span>
                    <Switch
                      checked={!inputs.send_time_auto}
                      onCheckedChange={(checked) => setInputs({ ...inputs, send_time_auto: !checked })}
                    />
                    <span className="text-sm">Manual</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ab_test"
                    checked={inputs.ab_test_enabled}
                    onCheckedChange={(checked) => setInputs({ ...inputs, ab_test_enabled: checked as boolean })}
                  />
                  <Label htmlFor="ab_test">Enable A/B Test Plan</Label>
                </div>

                <div className="space-y-2">
                  <Label>Plain-text Length Target</Label>
                  <RadioGroup
                    value={inputs.length_target}
                    onValueChange={(value: any) => setInputs({ ...inputs, length_target: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="short" id="length-short" />
                      <Label htmlFor="length-short">Short (200)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="length-standard" />
                      <Label htmlFor="length-standard">Standard (350)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="length-long" />
                      <Label htmlFor="length-long">Long (500)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include_html"
                    checked={inputs.include_html}
                    onCheckedChange={(checked) => setInputs({ ...inputs, include_html: checked as boolean })}
                  />
                  <Label htmlFor="include_html">Include HTML Snippet</Label>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Actions */}
            <div className="space-y-2 pt-4">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
                className="w-full"
                variant="gradient"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Draft"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Recommended: attach a KB and use Auto-generate for best results.
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && output && (
            <div className="w-2/5 border-l pl-6 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Preview</h3>

                {output.used_kb_facts && output.used_kb_facts.length > 0 && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">Used KB Facts:</p>
                    <ul className="text-xs space-y-1">
                      {output.used_kb_facts.map((fact, idx) => (
                        <li key={idx}>• {fact}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {output.generation_notes && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Generation Notes:</p>
                    <p className="text-xs">{output.generation_notes}</p>
                  </div>
                )}

                <Tabs defaultValue="plain">
                  <TabsList className="w-full">
                    <TabsTrigger value="plain" className="flex-1">Plain Text</TabsTrigger>
                    <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
                    <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="plain" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium mb-1">Subject Lines:</p>
                        {output.subject_options.map((subject, idx) => (
                          <p key={idx} className="text-sm bg-muted p-2 rounded mb-1">{subject}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1">Preheader:</p>
                        <p className="text-sm bg-muted p-2 rounded">{output.preheader}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1">Email Body:</p>
                        <pre className="text-xs bg-muted p-3 rounded whitespace-pre-wrap">{output.plain_text}</pre>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCopy(output.plain_text, "Plain text")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(output.plain_text, "newsletter.txt")}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="space-y-4 mt-4">
                    <pre className="text-xs bg-muted p-3 rounded whitespace-pre-wrap overflow-x-auto">
                      {output.html_snippet}
                    </pre>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCopy(output.html_snippet, "HTML")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(output.html_snippet, "newsletter.html")}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="json" className="space-y-4 mt-4">
                    <pre className="text-xs bg-muted p-3 rounded whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(output, null, 2)}
                    </pre>
                    <Button size="sm" onClick={() => handleCopy(JSON.stringify(output, null, 2), "JSON")}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
