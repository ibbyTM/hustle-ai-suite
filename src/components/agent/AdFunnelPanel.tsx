import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartTextarea } from "./SmartTextarea";
import { SmartSelect } from "./SmartSelect";
import { OutputPreview } from "./OutputPreview";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";

interface AdFunnelPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdFunnelPanel({ isOpen, onClose }: AdFunnelPanelProps) {
  const [inputs, setInputs] = useState({
    funnelType: "Lead magnet → Nurture → Sale",
    topHook: "",
    product: "",
    audience: "",
    proof: "",
    cta: "",
    trafficSource: "Facebook",
  });

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "ad-funnel",
    toolTitle: "Ad Funnel Copy Writer",
    toolEmoji: "🚀",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "ad-funnel",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here's a complete ${inputs.funnelType} framework for ${inputs.product}, targeting ${inputs.audience}, traffic source: ${inputs.trafficSource}${inputs.topHook ? `, with top hook: ${inputs.topHook}` : ""}${inputs.proof ? `, proof: ${inputs.proof}` : ""}, CTA: ${inputs.cta}.\n\nUse this exact structure:\n\nGoal Summary\nWrite 1-2 lines describing the funnel objective and target outcome.\n\nHook Ideas (Top of Funnel)\nProvide 3-5 strong opening lines designed for the ad.\n\nAd Copy (Middle of Funnel)\nWrite 1-2 paragraph options focused on: problem → solution → result.\n\nCreative Direction\nProvide 2-3 ideas for what the ad should visually show.\n\nLanding Page Copy (Bottom of Funnel)\n- Headline\n- Subheadline\n- Bullet Points: 3-5 key features/benefits\n- CTA Line\n\nDo not use emojis. Keep the writing clean, persuasive, and conversion-focused.${buildKBContext()}`;

    await generate(prompt, inputs);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartSelect
        id="funnelType"
        label="Funnel Type"
        value={inputs.funnelType}
        onChange={(value) => setInputs({ ...inputs, funnelType: value })}
        options={[
          { value: "Lead magnet → Nurture → Sale", label: "Lead Magnet Funnel" },
          { value: "Tripwire", label: "Tripwire" },
          { value: "Webinar funnel", label: "Webinar Funnel" },
        ]}
        tooltip="Select your funnel structure"
        required
      />

      <Separator />

      <SmartInput
        id="product"
        label="Core Offer"
        value={inputs.product}
        onChange={(value) => setInputs({ ...inputs, product: value })}
        placeholder="Your main product or service"
        tooltip="What are you selling?"
        maxLength={100}
        required
      />

      <SmartInput
        id="audience"
        label="Target Audience"
        value={inputs.audience}
        onChange={(value) => setInputs({ ...inputs, audience: value })}
        placeholder="Who you're targeting"
        tooltip="Describe your ideal customer"
        maxLength={100}
        required
      />

      <SmartInput
        id="topHook"
        label="Top-of-Funnel Hook"
        value={inputs.topHook}
        onChange={(value) => setInputs({ ...inputs, topHook: value })}
        placeholder="Optional hook to test"
        tooltip="Starting hook for the ad (optional)"
        maxLength={150}
      />

      <SmartTextarea
        id="proof"
        label="Primary Proof / Testimonial"
        value={inputs.proof}
        onChange={(value) => setInputs({ ...inputs, proof: value })}
        placeholder="Optional testimonial or social proof"
        tooltip="Add credibility with proof (optional)"
        maxLength={300}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <SmartInput
          id="cta"
          label="Desired CTA"
          value={inputs.cta}
          onChange={(value) => setInputs({ ...inputs, cta: value })}
          placeholder="e.g., Book a Free Call"
          tooltip="Your call-to-action"
          maxLength={50}
          required
        />

        <SmartSelect
          id="trafficSource"
          label="Traffic Source"
          value={inputs.trafficSource}
          onChange={(value) => setInputs({ ...inputs, trafficSource: value })}
          options={["Facebook", "Google", "Organic"]}
          tooltip="Where will traffic come from?"
        />
      </div>

      <Separator />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="required"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !inputs.product || !inputs.audience || !inputs.cta}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Building Funnel..." : "Generate Complete Funnel"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your complete funnel copy will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Ad Funnel Copy Writer"
      emoji="🚀"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
