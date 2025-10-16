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

interface DailyPlannerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyPlannerPanel({ isOpen, onClose }: DailyPlannerPanelProps) {
  const [inputs, setInputs] = useState({
    priority1: "",
    priority2: "",
    priority3: "",
    blockers: "",
    availableTime: "",
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "daily-planner",
    toolTitle: "Daily Hustle Planner",
    toolEmoji: "📋",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "daily-planner",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Generate 3 daily tasks to level up my hustle based on these priorities:\n1. ${inputs.priority1}\n2. ${inputs.priority2 || "General growth"}\n3. ${inputs.priority3 || "General growth"}${inputs.blockers ? `\n\nBlockers/Challenges: ${inputs.blockers}` : ""}${inputs.availableTime ? `\nAvailable time: ${inputs.availableTime}` : ""}\n\nFor each task, provide:\n- Task name\n- Estimated time\n- Why it matters\n- How to execute\n\nKeep it actionable and specific. No fluff.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="priority1"
        label="Priority 1"
        value={inputs.priority1}
        onChange={(value) => setInputs({ ...inputs, priority1: value })}
        placeholder="Your top priority today"
        tooltip="What's the most important thing to work on?"
        maxLength={100}
        required
      />

      <SmartInput
        id="priority2"
        label="Priority 2"
        value={inputs.priority2}
        onChange={(value) => setInputs({ ...inputs, priority2: value })}
        placeholder="Your second priority"
        tooltip="What else needs attention? (optional)"
        maxLength={100}
      />

      <SmartInput
        id="priority3"
        label="Priority 3"
        value={inputs.priority3}
        onChange={(value) => setInputs({ ...inputs, priority3: value })}
        placeholder="Your third priority"
        tooltip="Additional focus area (optional)"
        maxLength={100}
      />

      <Separator />

      <SmartTextarea
        id="blockers"
        label="Blockers / Challenges"
        value={inputs.blockers}
        onChange={(value) => setInputs({ ...inputs, blockers: value })}
        placeholder="Any obstacles or constraints today?"
        tooltip="What's getting in your way? (optional)"
        maxLength={200}
        rows={3}
      />

      <SmartInput
        id="availableTime"
        label="Available Time"
        value={inputs.availableTime}
        onChange={(value) => setInputs({ ...inputs, availableTime: value })}
        placeholder="e.g., 2 hours, full day"
        tooltip="How much time do you have today?"
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
        disabled={isGenerating || !inputs.priority1}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Planning Your Day..." : "Generate Daily Plan"}
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
      <p>Your daily action plan will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Hustle Planner"
      emoji="📋"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
