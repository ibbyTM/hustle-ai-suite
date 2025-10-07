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

interface ContentToCashPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContentToCashPanel({ isOpen, onClose }: ContentToCashPanelProps) {
  const [inputs, setInputs] = useState({
    primaryFormat: "Video",
    monetizationPath: "Product",
    audience: "",
    frequency: "Weekly",
  });

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "content-to-cash",
    toolTitle: "Content-to-Cash Ideas",
    toolEmoji: "💰",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "content-to-cash",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here are 5 content ideas for ${inputs.primaryFormat}, monetization: ${inputs.monetizationPath}, audience: ${inputs.audience}, frequency: ${inputs.frequency}.\n\nFor each content idea, use this exact structure:\n\n**Idea Title**\n**Concept:**\n**Hook Example:**\n**Format Suggestion:**\n**Monetisation Angle:**\n\nDo not use slang or emojis. Keep it creative but professional.${buildKBContext()}`;

    await generate(prompt, inputs);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartSelect
        id="primaryFormat"
        label="Primary Content Format"
        value={inputs.primaryFormat}
        onChange={(value) => setInputs({ ...inputs, primaryFormat: value })}
        options={["Video", "Thread", "Newsletter", "Blog"]}
        tooltip="What format will you create content in?"
        required
      />

      <SmartInput
        id="audience"
        label="Audience"
        value={inputs.audience}
        onChange={(value) => setInputs({ ...inputs, audience: value })}
        placeholder="e.g., aspiring entrepreneurs, fitness enthusiasts"
        tooltip="Who are you creating content for?"
        maxLength={100}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="monetizationPath"
          label="Monetization Path"
          value={inputs.monetizationPath}
          onChange={(value) => setInputs({ ...inputs, monetizationPath: value })}
          options={["Product", "Membership", "Course", "Affiliate"]}
          tooltip="How will you make money?"
        />

        <SmartSelect
          id="frequency"
          label="Frequency"
          value={inputs.frequency}
          onChange={(value) => setInputs({ ...inputs, frequency: value })}
          options={["Daily", "Weekly", "Monthly"]}
          tooltip="How often will you post?"
        />
      </div>

      <Separator />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !inputs.audience}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Generating Ideas..." : "Generate 5 Content Ideas"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your monetizable content ideas will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Content-to-Cash Ideas"
      emoji="💰"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
