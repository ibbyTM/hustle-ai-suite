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
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let prompt = tool.promptTemplate;
    Object.entries(inputs).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value);
    });
    
    // Mock AI output
    const mockOutput = generateMockOutput(tool, inputs);
    setOutput(mockOutput);
    setIsGenerating(false);
    toast.success("Generated! ✨");
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
                      value={inputs[field.id]}
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

function generateMockOutput(tool: AutomationTool, inputs: Record<string, string>): string {
  const examples: Record<string, string> = {
    "trend-finder": `🔥 **5 TikTok Trends Blowing Up Right Now**

1️⃣ **"Get Ready With Me" Luxury Edition**
Niche: Lifestyle / Fashion
Hook: "POV: You're getting ready for a date that could change your life"
Caption: "The fit had to hit different ✨ #GRWM #LuxuryLifestyle"

2️⃣ **AI Side Hustle Showcases**
Niche: Business / Tech
Hook: "I made £2,000 this month using AI. Here's how:"
Caption: "This changed the game for me 🚀 #AIHustle #PassiveIncome"

3️⃣ **Motivation + Luxury B-Roll**
Niche: Motivation
Hook: "You're one decision away from a completely different life"
Caption: "Time to level up. 💪 #Motivation #Success"

4️⃣ **"Things I Wish I Knew at 20"**
Niche: Personal Growth
Hook: "If I could go back and tell my 20-year-old self one thing..."
Caption: "Save this. Trust me. 📌 #LifeLessons #Growth"

5️⃣ **Mini Vlogs with Aesthetic Vibes**
Niche: Lifestyle
Hook: "A quiet morning in my life"
Caption: "Romanticizing my life one coffee at a time ☕ #Aesthetic #Vlog"`,

    "biz-idea": `💡 **3 Business Ideas for ${inputs.vibe || 'Online'} Hustlers**

**1. AI-Powered Content Agency**
📌 Concept: Offer faceless TikTok management using AI tools
💰 How to Start: Learn AI tools (ChatGPT, Midjourney), create sample accounts
🚀 Monetisation: £500-2000/month per client

**2. Digital Product Store**
📌 Concept: Sell Notion templates, Canva presets, or guides
💰 How to Start: Create 3-5 products, sell on Gumroad/Etsy
🚀 Monetisation: £10-50 per product, passive income

**3. Affiliate Content Creation**
📌 Concept: Review products on TikTok with affiliate links
💰 How to Start: Join Amazon Associates, create honest reviews
🚀 Monetisation: 5-10% commission per sale

👉 Want more ideas? Upgrade to unlock all tools.`,
  };

  return examples[tool.id] || `✨ **Generated Output for ${tool.title}**\n\nYour personalized content would appear here based on your inputs.\n\n👉 This is a demo output. Connect to real AI for actual generation!`;
}
