import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartTextarea } from "./SmartTextarea";
import { OutputPreview } from "./OutputPreview";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";

interface OfferBuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfferBuilderPanel({ isOpen, onClose }: OfferBuilderPanelProps) {
  const [inputs, setInputs] = useState({
    coreProduct: "",
    price: "",
    bonuses: "",
    guarantee: "",
    urgency: "",
    primaryAudience: "",
  });

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "offer-builder",
    toolTitle: "Offer Builder",
    toolEmoji: "🎁",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "offer-builder",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here's an irresistible offer breakdown for ${inputs.coreProduct}, price: ${inputs.price}${inputs.bonuses ? `, bonuses: ${inputs.bonuses}` : ""}${inputs.guarantee ? `, guarantee: ${inputs.guarantee}` : ""}${inputs.urgency ? `, urgency: ${inputs.urgency}` : ""}, audience: ${inputs.primaryAudience || "general"}.\n\nUse this exact structure:\n\n**Offer Name**\nProvide a short, catchy, brandable name for the offer.\n\n**Positioning Angle**\nWrite 1 sentence defining what makes this offer unique or transformative.\n\n**What's Included (Main Offer)**\nList 3-5 bullet points focused on benefits, not features. Emphasize outcomes and value.\n\n**Bonus Add-Ons**\nSuggest extras that amplify perceived value.\n\n**Urgency Line / Scarcity Prompt**\nWrite one short sentence encouraging immediate action.\n\nDo not use emojis. Keep the tone confident, clean, and persuasive.${buildKBContext()}`;

    await generate(prompt, inputs);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="coreProduct"
        label="Core Product"
        value={inputs.coreProduct}
        onChange={(value) => setInputs({ ...inputs, coreProduct: value })}
        placeholder="What you're selling"
        tooltip="Your main product or service"
        maxLength={100}
        required
      />

      <SmartInput
        id="price"
        label="Price / Pricing Options"
        value={inputs.price}
        onChange={(value) => setInputs({ ...inputs, price: value })}
        placeholder="e.g., £99 or £99/month"
        tooltip="How much does it cost?"
        maxLength={50}
        required
      />

      <Separator />

      <SmartTextarea
        id="bonuses"
        label="Desired Bonuses"
        value={inputs.bonuses}
        onChange={(value) => setInputs({ ...inputs, bonuses: value })}
        placeholder="List bonuses (comma-separated or bullet points)"
        tooltip="What extras can you add to increase perceived value?"
        maxLength={300}
        rows={3}
      />

      <SmartInput
        id="guarantee"
        label="Guarantee"
        value={inputs.guarantee}
        onChange={(value) => setInputs({ ...inputs, guarantee: value })}
        placeholder="e.g., 30-day money back guarantee"
        tooltip="Risk reversal for buyers"
        maxLength={100}
      />

      <SmartInput
        id="urgency"
        label="Scarcity / Urgency Mechanic"
        value={inputs.urgency}
        onChange={(value) => setInputs({ ...inputs, urgency: value })}
        placeholder="e.g., Limited to 50 spots"
        tooltip="Create urgency to drive action (optional)"
        maxLength={100}
      />

      <SmartInput
        id="primaryAudience"
        label="Primary Audience"
        value={inputs.primaryAudience}
        onChange={(value) => setInputs({ ...inputs, primaryAudience: value })}
        placeholder="Target audience"
        tooltip="Who is this offer for?"
        maxLength={100}
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
        disabled={isGenerating || !inputs.coreProduct || !inputs.price}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Building Offer..." : "Generate Irresistible Offer"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your offer breakdown will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Offer Builder"
      emoji="🎁"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
