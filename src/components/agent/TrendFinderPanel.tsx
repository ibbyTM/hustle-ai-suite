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

interface TrendFinderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrendFinderPanel({ isOpen, onClose }: TrendFinderPanelProps) {
  const [inputs, setInputs] = useState({
    niche: "",
    region: "Global",
    platform: "TikTok",
    timeRange: "7d",
    maxResults: 10,
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "trend-finder",
    toolTitle: "Trend Finder 2.0",
    toolEmoji: "🔥",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "trend-finder",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `List ${inputs.maxResults} trending content ideas for ${inputs.platform} in the ${inputs.niche} niche, region: ${inputs.region}, time range: ${inputs.timeRange}. For each trend, include: Trend Name, Why It Works, Example Hook, and Caption Strategy. Format with clear headings and bullet points. Do not use any emojis in the output.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) setGenerationId(result.generationId);
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="niche"
        label="Niche / Category"
        value={inputs.niche}
        onChange={(value) => setInputs({ ...inputs, niche: value })}
        placeholder="e.g., fitness supplements, local plumbers"
        tooltip="Specify the industry or topic you want to research"
        maxLength={100}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartInput
          id="region"
          label="Region"
          value={inputs.region}
          onChange={(value) => setInputs({ ...inputs, region: value })}
          placeholder="e.g., UK / US / Global"
          tooltip="Geographic focus for trends"
        />

        <SmartSelect
          id="platform"
          label="Platform"
          value={inputs.platform}
          onChange={(value) => setInputs({ ...inputs, platform: value })}
          options={["TikTok", "Instagram", "YouTube Shorts"]}
          tooltip="Which platform to research"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="timeRange"
          label="Time Range"
          value={inputs.timeRange}
          onChange={(value) => setInputs({ ...inputs, timeRange: value })}
          options={[
            { value: "24h", label: "24 hours" },
            { value: "7d", label: "7 days" },
            { value: "30d", label: "30 days" },
          ]}
          tooltip="How far back to look for trends"
          required
        />

        <SmartInput
          id="maxResults"
          label="Max Results"
          value={inputs.maxResults.toString()}
          onChange={(value) => setInputs({ ...inputs, maxResults: parseInt(value) || 10 })}
          type="number"
          placeholder="10"
          tooltip="Number of trends to generate (1-20)"
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
        disabled={isGenerating || !inputs.niche}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Finding Trends..." : "Find Trends"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} generationId={generationId} onContentUpdate={(newContent) => setOutput(newContent)} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p>Your trends will appear here after generation</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Trend Finder 2.0"
      emoji="🔥"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
