import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";

interface PropertyProfiteerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyProfiteerPanel({ isOpen, onClose }: PropertyProfiteerPanelProps) {
  const [listingURL, setListingURL] = useState("");
  const [objective, setObjective] = useState("Deal analysis");
  const [propertyType, setPropertyType] = useState("");

  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "property-profiteer",
    toolTitle: "Property Profiteer",
    toolEmoji: "🏠",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "property-profiteer",
    isOpen
  );

  const handleGenerate = async () => {
    const kbContext = await buildKBContext();
    const prompt = `Analyze property: ${propertyType}
${listingURL ? `Listing URL: ${listingURL}` : ""}
Objective: ${objective}

${kbContext}

Provide a comprehensive property analysis including:
${objective === "Deal analysis" ? `
- Property Overview
- Market Analysis
- Investment Potential
- ROI Calculations
- Risks & Opportunities
- Recommendation
` : objective === "Marketing copy" ? `
- Property Highlights
- Compelling Headlines
- Feature Benefits
- Lifestyle Angles
- Call-to-Action
` : `
- Executive Summary
- Investment Metrics
- Market Position
- Financial Projections
- Investment Recommendation
`}

Format with clear sections and professional analysis.`;

    const result = await generate(prompt, {
      listingURL,
      objective,
      propertyType,
    });
    if (result?.generationId) setGenerationId(result.generationId);
  };

  const inputPanel = (
    <div className="space-y-4">
      <SmartInput
        id="listingURL"
        label="Listing URL"
        value={listingURL}
        onChange={setListingURL}
        placeholder="Paste Rightmove / Zoopla / Zillow URL"
        type="url"
      />

      <SmartSelect
        id="objective"
        label="Objective"
        value={objective}
        onChange={setObjective}
        options={["Deal analysis", "Marketing copy", "Investor summary"]}
        required
      />

      <SmartInput
        id="propertyType"
        label="Property Type"
        value={propertyType}
        onChange={setPropertyType}
        placeholder="e.g., 2-bed flat"
        required
      />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !propertyType}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Property"
        )}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} generationId={generationId} onContentUpdate={(newContent) => setOutput(newContent)} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Your property analysis will appear here
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Property Profiteer"
      emoji="🏠"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
