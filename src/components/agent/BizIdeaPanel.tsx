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

interface BizIdeaPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BizIdeaPanel({ isOpen, onClose }: BizIdeaPanelProps) {
  const [inputs, setInputs] = useState({
    interests: "",
    budgetRange: "",
    timeToLaunch: "14d",
    preferredMonetization: "Products",
    scaleGoal: "",
  });

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "biz-idea",
    toolTitle: "Biz-Idea Reactor",
    toolEmoji: "💡",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "biz-idea",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Generate 3 unique business ideas based on ${inputs.interests}, budget: ${inputs.budgetRange || "flexible"}, launch time: ${inputs.timeToLaunch}, monetization: ${inputs.preferredMonetization}, scale goal: ${inputs.scaleGoal || "sustainable income"}. For each idea, include: Concept, How to Start, Monetisation Path.${buildKBContext()}`;

    await generate(prompt, inputs);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="interests"
        label="Interests / Skills"
        value={inputs.interests}
        onChange={(value) => setInputs({ ...inputs, interests: value })}
        placeholder="e.g., copywriting, woodworking, social media"
        tooltip="What are you good at or interested in?"
        maxLength={150}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartInput
          id="budgetRange"
          label="Budget Range"
          value={inputs.budgetRange}
          onChange={(value) => setInputs({ ...inputs, budgetRange: value })}
          placeholder="e.g., £0-£500"
          tooltip="How much can you invest to start?"
        />

        <SmartSelect
          id="timeToLaunch"
          label="Time to Launch"
          value={inputs.timeToLaunch}
          onChange={(value) => setInputs({ ...inputs, timeToLaunch: value })}
          options={[
            { value: "7d", label: "7 days", description: "Quick launch" },
            { value: "14d", label: "14 days", description: "Standard" },
            { value: "30d", label: "30 days", description: "Planned launch" },
          ]}
          tooltip="How quickly do you want to launch?"
        />
      </div>

      <SmartSelect
        id="preferredMonetization"
        label="Preferred Monetization"
        value={inputs.preferredMonetization}
        onChange={(value) => setInputs({ ...inputs, preferredMonetization: value })}
        options={["Products", "Services", "Subscription", "Ads"]}
        tooltip="How do you want to make money?"
      />

      <SmartInput
        id="scaleGoal"
        label="Scale Goal"
        value={inputs.scaleGoal}
        onChange={(value) => setInputs({ ...inputs, scaleGoal: value })}
        placeholder="e.g., £10k/month"
        tooltip="What revenue target are you aiming for?"
        maxLength={50}
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
        disabled={isGenerating || !inputs.interests}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Finding Ideas..." : "Generate 3 Business Ideas"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your business ideas will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Biz-Idea Reactor"
      emoji="💡"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
