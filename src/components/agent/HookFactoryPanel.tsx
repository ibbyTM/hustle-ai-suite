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

interface HookFactoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HookFactoryPanel({ isOpen, onClose }: HookFactoryPanelProps) {
  const [inputs, setInputs] = useState({
    context: "",
    emotion: "Curiosity",
    maxLength: 10,
    targetPlatform: "TikTok",
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "hook-factory",
    toolTitle: "Hook Factory",
    toolEmoji: "🪝",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "hook-factory",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here are 10 short viral hook ideas for ${inputs.context}, emotion: ${inputs.emotion}, max length: ${inputs.maxLength} words, platform: ${inputs.targetPlatform}, designed to capture attention in under 3 seconds.\n\nFormat as a clean numbered list. Each hook should be ${inputs.maxLength} words maximum.\n\nOptionally, you may divide the hooks into sub-sections such as:\n- Problem Hooks (addressing pain points)\n- Benefit Hooks (highlighting outcomes)\n- Curiosity Hooks (creating intrigue)\n\nDo not use emojis. Do not use casual phrases. Keep the tone concise, persuasive, and ad-style—like a conversion copywriter's deliverable.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const emotionPreviews = {
    Curiosity: "Wait, you're doing it wrong...",
    Urgency: "Last chance to fix this mistake",
    "Fear-of-missing-out": "Everyone's using this except you",
    Humor: "Plot twist: You've been lied to",
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="context"
        label="Context / Topic"
        value={inputs.context}
        onChange={(value) => setInputs({ ...inputs, context: value })}
        placeholder="e.g., Why your LinkedIn profile is invisible to recruiters"
        tooltip="What is the hook about? Be specific."
        maxLength={150}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="emotion"
          label="Emotion / Angle"
          value={inputs.emotion}
          onChange={(value) => setInputs({ ...inputs, emotion: value })}
          options={["Curiosity", "Urgency", "Fear-of-missing-out", "Humor"]}
          tooltip="The emotional trigger for the hook"
          preview={emotionPreviews}
          required
        />

        <SmartSelect
          id="targetPlatform"
          label="Target Platform"
          value={inputs.targetPlatform}
          onChange={(value) => setInputs({ ...inputs, targetPlatform: value })}
          options={["TikTok", "Instagram", "YouTube", "Twitter"]}
          tooltip="Where will this be used?"
        />
      </div>

      <SmartInput
        id="maxLength"
        label="Max Length (words)"
        value={inputs.maxLength.toString()}
        onChange={(value) => setInputs({ ...inputs, maxLength: parseInt(value) || 10 })}
        type="number"
        placeholder="10"
        tooltip="Maximum words per hook (5-20)"
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
        disabled={isGenerating || !inputs.context}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Generating Hooks..." : "Generate 10 Hooks"}
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
      <p>Your scroll-stopping hooks will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Hook Factory"
      emoji="🪝"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
