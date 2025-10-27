import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartTextarea } from "./SmartTextarea";
import { SmartSelect } from "./SmartSelect";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";

interface BusinessValidatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  asPage?: boolean;
}

export function BusinessValidatorPanel({ isOpen, onClose, asPage }: BusinessValidatorPanelProps) {
  const [businessIdea, setBusinessIdea] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [currentStage, setCurrentStage] = useState("Just an idea");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeframe, setTimeframe] = useState("3 months");
  const [concernsOrChallenges, setConcernsOrChallenges] = useState("");

  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "business-validator",
    toolTitle: "Business Validator",
    toolEmoji: "✅",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "business-validator",
    isOpen
  );

  const handleGenerate = async () => {
    const kbContext = await buildKBContext();
    const prompt = `Validate this business idea: ${businessIdea}

Target Market: ${targetMarket}
Current Stage: ${currentStage}
${budgetRange ? `Budget: ${budgetRange}` : ""}
${timeframe ? `Timeframe: ${timeframe}` : ""}
${concernsOrChallenges ? `Concerns: ${concernsOrChallenges}` : ""}

${kbContext}

Provide a comprehensive validation analysis with the following sections:

**Validation Score (1-10)**
Rate the overall viability of this idea and explain the score.

**Market Opportunity Analysis**
Assess the target market, competition, and timing.

**Strengths & Opportunities**
Highlight what's working well and potential opportunities.

**Weaknesses & Risks**
Identify gaps, challenges, and potential pitfalls.

**Improvement Suggestions**
Provide 3-5 specific, actionable ways to strengthen this idea.

**Next Steps (30-90 Days)**
Create a prioritized action plan with:
- Week 1-2 actions
- Month 1 milestones
- Months 2-3 goals

**Key Metrics to Track**
Suggest 3-5 metrics to measure progress and validate assumptions.

Keep the tone constructive, honest, and actionable. Format with clear sections and bullet points.`;

    const result = await generate(prompt, {
      businessIdea,
      targetMarket,
      currentStage,
      budgetRange,
      timeframe,
      concernsOrChallenges,
    });
    if (result?.generationId) setGenerationId(result.generationId);
  };

  const inputPanel = (
    <div className="space-y-4">
      <SmartTextarea
        id="businessIdea"
        label="Business Idea"
        value={businessIdea}
        onChange={setBusinessIdea}
        placeholder="Describe your business idea in detail"
        required
        rows={4}
      />

      <SmartInput
        id="targetMarket"
        label="Target Market"
        value={targetMarket}
        onChange={setTargetMarket}
        placeholder="e.g., UK fitness enthusiasts, US small businesses"
        required
      />

      <SmartSelect
        id="currentStage"
        label="Current Stage"
        value={currentStage}
        onChange={setCurrentStage}
        options={["Just an idea", "Early research", "MVP ready", "Already launched"]}
        required
      />

      <SmartInput
        id="budgetRange"
        label="Budget Available"
        value={budgetRange}
        onChange={setBudgetRange}
        placeholder="e.g., £0-£1000"
      />

      <SmartSelect
        id="timeframe"
        label="Launch Timeframe"
        value={timeframe}
        onChange={setTimeframe}
        options={["1 month", "3 months", "6 months", "12+ months"]}
      />

      <SmartTextarea
        id="concernsOrChallenges"
        label="Main Concerns/Challenges"
        value={concernsOrChallenges}
        onChange={setConcernsOrChallenges}
        placeholder="What are you worried about or stuck on?"
        rows={3}
      />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !businessIdea || !targetMarket}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          "Validate Business Idea"
        )}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} generationId={generationId} onContentUpdate={(newContent) => setOutput(newContent)} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Your business validation analysis will appear here
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Business Validator"
      emoji="✅"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
      asPage={asPage}
    />
  );
}
