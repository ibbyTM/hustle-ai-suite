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

interface NameForgePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NameForgePanel({ isOpen, onClose }: NameForgePanelProps) {
  const [inputs, setInputs] = useState({
    industry: "",
    brandTone: "Professional",
    lengthPreference: "Short (1–2 syllables)",
    avoidWords: "",
    checkDomain: false,
  });
  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "name-forge",
    toolTitle: "Name Forge",
    toolEmoji: "⚡",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "name-forge",
    isOpen
  );

  const handleGenerate = async () => {
    const prompt = `Here are 5 brand name ideas for ${inputs.industry}, tone: ${inputs.brandTone}, length: ${inputs.lengthPreference}${inputs.avoidWords ? `, avoid: ${inputs.avoidWords}` : ""}. Each name includes a short explanation and tagline suggestion.\n\nUse this exact structure for each name:\n\n**Name #[number] – [Name]**\n\n**Meaning / Concept:** Write 1-2 sentences explaining the name origin.\n\n**Tagline Suggestion:** Provide one catchy phrase.\n\n**Why It Works:** Write a short reasoning.\n\nDo not use slang or emojis. Write in a confident, brand-consultant style.${buildKBContext()}`;

    const result = await generate(prompt, inputs);
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const inputPanel = (
    <div className="space-y-6">
      <SmartInput
        id="industry"
        label="Industry / Niche"
        value={inputs.industry}
        onChange={(value) => setInputs({ ...inputs, industry: value })}
        placeholder="e.g., fitness coaching, SaaS, creative agency"
        tooltip="What industry is this brand in?"
        maxLength={100}
        required
      />

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <SmartSelect
          id="brandTone"
          label="Brand Tone"
          value={inputs.brandTone}
          onChange={(value) => setInputs({ ...inputs, brandTone: value })}
          options={["Playful", "Premium", "Professional", "Edgy"]}
          tooltip="How should the brand name feel?"
        />

        <SmartSelect
          id="lengthPreference"
          label="Length Preference"
          value={inputs.lengthPreference}
          onChange={(value) => setInputs({ ...inputs, lengthPreference: value })}
          options={["Short (1–2 syllables)", "Medium", "Descriptive"]}
          tooltip="How long should the name be?"
        />
      </div>

      <SmartInput
        id="avoidWords"
        label="Avoid Words"
        value={inputs.avoidWords}
        onChange={(value) => setInputs({ ...inputs, avoidWords: value })}
        placeholder="Comma-separated words to avoid"
        tooltip="Any words or themes to exclude? (optional)"
        maxLength={100}
      />

      <div className="flex items-center justify-between">
        <Label htmlFor="checkDomain">Include domain availability check?</Label>
        <Switch
          id="checkDomain"
          checked={inputs.checkDomain}
          onCheckedChange={(checked) => setInputs({ ...inputs, checkDomain: checked })}
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
        disabled={isGenerating || !inputs.industry}
        className="w-full"
        size="lg"
      >
        {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        {isGenerating ? "Forging Names..." : "Generate 5 Brand Names"}
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
      <p>Your brand name ideas will appear here</p>
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Name Forge"
      emoji="⚡"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
