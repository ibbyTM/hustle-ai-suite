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

interface DropshipPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DropshipPanel({ isOpen, onClose }: DropshipPanelProps) {
  const [inputs, setInputs] = useState({
    category: "",
    targetPriceRange: "",
    marginGoal: 30,
    preferredSuppliers: "AliExpress",
    platform: "Shopify",
  });

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "dropship-goldmine",
    toolTitle: "Dropship Goldmine",
    toolEmoji: "📦",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "dropship-goldmine",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here are 5 trending products in the ${inputs.category} category, price range: ${inputs.targetPriceRange || "flexible"}, margin goal: ${inputs.marginGoal}%, suppliers: ${inputs.preferredSuppliers}, platform: ${inputs.platform}.\n\nFor each product, use this exact structure:\n\nProduct Name\nWhy it's trending: Provide 2-3 sentences explaining the trend or consumer behaviour driving demand.\nAd Hook Idea: Write 1 short viral-style line suitable for TikTok or Reels.\nContent Angle: Describe in 1-2 sentences what type of video or ad works best for this product.\nPositioning Tip: Write 1 line explaining what emotion or benefit to highlight when selling this product.\n\nKeep each product description under 120 words. Do not use emojis. Do not use casual slang. Keep the tone professional and strategic.${buildKBContext()}`;

    await generate(prompt, inputs);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="category"
        label="Category"
        value={inputs.category}
        onChange={(value) => setInputs({ ...inputs, category: value })}
        placeholder="e.g., home gadgets, fitness accessories"
        tooltip="What product category are you researching?"
        maxLength={100}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartInput
          id="targetPriceRange"
          label="Target Price Range"
          value={inputs.targetPriceRange}
          onChange={(value) => setInputs({ ...inputs, targetPriceRange: value })}
          placeholder="e.g., £5–£50"
          tooltip="What price range are you targeting?"
        />

        <SmartInput
          id="marginGoal"
          label="Margin Goal (%)"
          value={inputs.marginGoal.toString()}
          onChange={(value) => setInputs({ ...inputs, marginGoal: parseInt(value) || 30 })}
          type="number"
          placeholder="30"
          tooltip="Target profit margin (10-90%)"
        />
      </div>

      <SmartSelect
        id="preferredSuppliers"
        label="Preferred Suppliers"
        value={inputs.preferredSuppliers}
        onChange={(value) => setInputs({ ...inputs, preferredSuppliers: value })}
        options={["AliExpress", "CJ", "Alibaba"]}
        tooltip="Where will you source products?"
      />

      <SmartSelect
        id="platform"
        label="Platform"
        value={inputs.platform}
        onChange={(value) => setInputs({ ...inputs, platform: value })}
        options={["Shopify", "Etsy", "Amazon"]}
        tooltip="Where will you sell?"
      />

      <Separator />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !inputs.category}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Finding Products..." : "Generate 5 Products"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your trending products will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Dropship Goldmine"
      emoji="📦"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
