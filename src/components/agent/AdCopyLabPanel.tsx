import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { OutputPreview } from "./OutputPreview";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";

interface AdCopyLabPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdCopyLabPanel({ isOpen, onClose }: AdCopyLabPanelProps) {
  const [inputs, setInputs] = useState({
    objective: "Conversions",
    product: "",
    primaryBenefit: "",
    audience: "",
    adFormat: "Image",
    characterLimit: "",
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "ad-copy-lab",
    toolTitle: "Ad Copy & Creative Lab",
    toolEmoji: "✨",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "ad-copy-lab",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here are 3 ad copy variations for ${inputs.product} (${inputs.primaryBenefit}), objective: ${inputs.objective}, targeting ${inputs.audience || "general audience"}, format: ${inputs.adFormat}${inputs.characterLimit ? `, character limit: ${inputs.characterLimit}` : ""}. Each includes a headline, caption, creative idea, and CTA suggestion.\n\nFor each variation, use this exact structure:\n\nAd Concept Title\nHeadline – Write a direct, catchy headline in 5-8 words.\nCaption – Write 2-3 lines following this flow: problem → solution → benefit.\nCreative Concept – Provide 1-2 sentences describing the visual approach or ad angle.\nCTA Example – Write a single actionable line.\n\nDo not use emojis. Use clear, strategic language—think ad strategist. Format with bold section headers and proper line spacing for readability.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const ctaSuggestions = {
    Awareness: ["Learn More", "Discover Now", "See How"],
    Traffic: ["Visit Site", "Check It Out", "Browse Now"],
    Conversions: ["Buy Now", "Get Started", "Claim Offer"],
    Leads: ["Sign Up Free", "Get Your Quote", "Download Now"],
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartSelect
        id="objective"
        label="Campaign Objective"
        value={inputs.objective}
        onChange={(value) => setInputs({ ...inputs, objective: value })}
        options={[
          { value: "Awareness", label: "Awareness", description: "Build brand recognition" },
          { value: "Traffic", label: "Traffic", description: "Drive website visits" },
          { value: "Conversions", label: "Conversions", description: "Generate sales" },
          { value: "Leads", label: "Leads", description: "Capture contact info" },
        ]}
        tooltip="Choose your primary campaign goal"
        required
      />

      <Separator />

      <SmartInput
        id="product"
        label="Product / Offer Name"
        value={inputs.product}
        onChange={(value) => setInputs({ ...inputs, product: value })}
        placeholder="Your product or service"
        tooltip="What are you advertising?"
        maxLength={100}
        required
      />

      <SmartInput
        id="primaryBenefit"
        label="Primary Benefit"
        value={inputs.primaryBenefit}
        onChange={(value) => setInputs({ ...inputs, primaryBenefit: value })}
        placeholder="e.g., Save 3 hours daily on admin tasks"
        tooltip="The one-line value proposition"
        maxLength={150}
        required
      />

      <SmartInput
        id="audience"
        label="Audience / ICP"
        value={inputs.audience}
        onChange={(value) => setInputs({ ...inputs, audience: value })}
        placeholder="e.g., busy small business owners"
        tooltip="Who is this ad targeting? Leave blank to use KB audience."
        maxLength={100}
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="adFormat"
          label="Ad Format"
          value={inputs.adFormat}
          onChange={(value) => setInputs({ ...inputs, adFormat: value })}
          options={["Image", "Video", "Carousel"]}
          tooltip="Select the ad creative format"
        />

        <SmartInput
          id="characterLimit"
          label="Character Limit"
          value={inputs.characterLimit}
          onChange={(value) => setInputs({ ...inputs, characterLimit: value })}
          type="number"
          placeholder="Optional"
          tooltip="Platform-specific character limits (e.g., 125 for FB primary text)"
        />
      </div>

      {inputs.objective && (
        <div className="bg-accent/10 rounded-lg p-3">
          <p className="text-xs font-semibold mb-1">CTA Suggestions for {inputs.objective}:</p>
          <p className="text-xs text-muted-foreground">
            {ctaSuggestions[inputs.objective as keyof typeof ctaSuggestions]?.join(", ")}
          </p>
        </div>
      )}

      <Separator />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="required"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !inputs.product || !inputs.primaryBenefit}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Generating Ad Copy..." : "Generate Ad Variations"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview 
      content={output} 
      generationId={generationId}
      onContentUpdate={(newContent) => setOutput(newContent)}
    />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your ad copy variations will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Ad Copy & Creative Lab"
      emoji="✨"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
