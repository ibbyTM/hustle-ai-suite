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

interface PageBuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PageBuilderPanel({ isOpen, onClose }: PageBuilderPanelProps) {
  const [inputs, setInputs] = useState({
    platform: "Instagram",
    profileType: "Business",
    primaryCTA: "",
    mainOffer: "",
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "page-builder",
    toolTitle: "Page & Profile Builder",
    toolEmoji: "📱",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "page-builder",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here's a full profile setup for a ${inputs.profileType} on ${inputs.platform}, CTA: ${inputs.primaryCTA}, offer: ${inputs.mainOffer}.\n\nUse this exact structure:\n\n**Username Ideas**\nProvide 3-5 relevant and memorable username suggestions.\n\n**Bio Examples**\nWrite 2-3 bio options formatted and optimized for ${inputs.platform}.\n\n**Tone & Personality Notes**\nProvide 1-2 lines describing how the brand should sound.\n\n**Content Pillars**\nList 3 main content categories this brand should focus on.\n\n**Posting Strategy**\nOutline the best posting frequency, content formats, and engagement approach for ${inputs.platform}.\n\nDo not use emojis. Keep the tone simple, confident, and structured.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) setGenerationId(result.generationId);
  };

  const inputPanel = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="platform"
          label="Platform"
          value={inputs.platform}
          onChange={(value) => setInputs({ ...inputs, platform: value })}
          options={["Instagram", "TikTok", "LinkedIn", "Website landing"]}
          tooltip="Where are you building this profile?"
          required
        />

        <SmartSelect
          id="profileType"
          label="Profile Type"
          value={inputs.profileType}
          onChange={(value) => setInputs({ ...inputs, profileType: value })}
          options={["Personal", "Brand", "Business"]}
          tooltip="What type of profile is this?"
          required
        />
      </div>

      <Separator />

      <SmartInput
        id="primaryCTA"
        label="Primary CTA"
        value={inputs.primaryCTA}
        onChange={(value) => setInputs({ ...inputs, primaryCTA: value })}
        placeholder="e.g., Book a Call, Shop Now"
        tooltip="What action do you want visitors to take?"
        maxLength={50}
        required
      />

      <SmartInput
        id="mainOffer"
        label="Main Offer / Tagline"
        value={inputs.mainOffer}
        onChange={(value) => setInputs({ ...inputs, mainOffer: value })}
        placeholder="e.g., Social media marketing for busy founders"
        tooltip="Your value proposition in one line"
        maxLength={150}
        required
      />

      <Separator />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="required"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !inputs.primaryCTA || !inputs.mainOffer}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Building Profile..." : "Generate Profile Setup"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} generationId={generationId} onContentUpdate={(newContent) => setOutput(newContent)} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your profile setup will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Page & Profile Builder"
      emoji="📱"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
