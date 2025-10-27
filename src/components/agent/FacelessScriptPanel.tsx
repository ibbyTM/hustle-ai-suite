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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FacelessScriptPanelProps {
  isOpen: boolean;
  onClose: () => void;
  asPage?: boolean;
}

export function FacelessScriptPanel({ isOpen, onClose, asPage }: FacelessScriptPanelProps) {
  const [inputs, setInputs] = useState({
    objective: "Sales",
    niche: "",
    targetLength: 30,
    tone: "Direct",
    hookStyle: "Benefit",
    includeCameraDirections: false,
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "faceless-script",
    toolTitle: "Faceless Script Forge",
    toolEmoji: "🎬",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "faceless-script",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here are 3 faceless TikTok script ideas for ${inputs.objective} in the ${inputs.niche} niche, ${inputs.targetLength} seconds long, with a ${inputs.tone} tone and ${inputs.hookStyle} hook style.\n\nFor each script, use this exact structure:\n\nScript Title\nConcept – A short 1-2 line explanation of the video concept.\nNarration – Write the full voiceover script as it would be spoken.\nVisuals – Provide a bullet list describing each scene or visual element.\nCTA – Include an example closing call-to-action or hook.\n\nDo not use emojis. Do not use casual slang like 'boujee,' 'fire,' 'lit,' etc. Keep the tone minimal, clean, and confident—like it was written by a professional creator strategist. Use clear headings and proper formatting.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartSelect
        id="objective"
        label="Script Objective"
        value={inputs.objective}
        onChange={(value) => setInputs({ ...inputs, objective: value })}
        options={[
          { value: "Sales", label: "Sales", description: "Drive direct purchases" },
          { value: "Brand", label: "Brand", description: "Build awareness" },
          { value: "Education", label: "Education", description: "Teach and inform" },
          { value: "Viral", label: "Viral", description: "Maximize reach" },
        ]}
        tooltip="What's the main goal of this script?"
        required
      />

      <SmartInput
        id="niche"
        label="Niche / Product"
        value={inputs.niche}
        onChange={(value) => setInputs({ ...inputs, niche: value })}
        placeholder="e.g., teeth whitening strips"
        tooltip="What product or niche is this about?"
        maxLength={100}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="targetLength"
          label="Target Length (sec)"
          value={inputs.targetLength.toString()}
          onChange={(value) => setInputs({ ...inputs, targetLength: parseInt(value) })}
          options={[
            { value: "15", label: "15 seconds" },
            { value: "30", label: "30 seconds" },
            { value: "60", label: "60 seconds" },
          ]}
          tooltip="How long should the video be?"
          required
        />

        <SmartSelect
          id="tone"
          label="Tone"
          value={inputs.tone}
          onChange={(value) => setInputs({ ...inputs, tone: value })}
          options={["Direct", "Humorous", "Educational"]}
          tooltip="The overall voice and style"
        />
      </div>

      <SmartSelect
        id="hookStyle"
        label="Hook Style"
        value={inputs.hookStyle}
        onChange={(value) => setInputs({ ...inputs, hookStyle: value })}
        options={["Shock", "Curiosity", "Benefit"]}
        tooltip="How should the opening grab attention?"
      />

      <div className="flex items-center justify-between">
        <Label htmlFor="cameraDirections">Include Camera Directions?</Label>
        <Switch
          id="cameraDirections"
          checked={inputs.includeCameraDirections}
          onCheckedChange={(checked) =>
            setInputs({ ...inputs, includeCameraDirections: checked })
          }
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
        disabled={isGenerating || !inputs.niche}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Writing Scripts..." : "Generate 3 Scripts"}
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
      <p>Your faceless video scripts will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Faceless Script Forge"
      emoji="🎬"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
      asPage={asPage}
    />
  );
}
