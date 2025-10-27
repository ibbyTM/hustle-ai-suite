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

interface HustleSprintPanelProps {
  isOpen: boolean;
  onClose: () => void;
  asPage?: boolean;
}

export function HustleSprintPanel({ isOpen, onClose, asPage }: HustleSprintPanelProps) {
  const [goalProject, setGoalProject] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [primaryFocus, setPrimaryFocus] = useState("Content");
  const [startDate, setStartDate] = useState("");
  const [kpi1, setKpi1] = useState("");
  const [kpi2, setKpi2] = useState("");
  const [kpi3, setKpi3] = useState("");

  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "hustle-sprint",
    toolTitle: "30-Day Hustle Sprint",
    toolEmoji: "🏃",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "hustle-sprint",
    isOpen
  );

  const handleGenerate = async () => {
    const kbContext = await buildKBContext();
    const prompt = `30-Day Hustle Sprint plan for ${goalProject}
Skill level: ${skillLevel}
Time commitment: ${hoursPerDay} hours/day
Primary focus: ${primaryFocus}
Start date: ${startDate}
${kpi1 ? `KPI 1: ${kpi1}` : ""}
${kpi2 ? `KPI 2: ${kpi2}` : ""}
${kpi3 ? `KPI 3: ${kpi3}` : ""}

${kbContext}

Provide a comprehensive 30-day action plan with:

**Week 1 Plan (Days 1-7)**
Daily tasks and objectives

**Week 2 Plan (Days 8-14)**
Building momentum tasks

**Week 3 Plan (Days 15-21)**
Scaling and optimization

**Week 4 Plan (Days 22-30)**
Launch and measurement

**Milestones & Check-ins**
Key milestones to track progress

**Resources Needed**
Tools, platforms, and resources required

Format as a structured action plan with clear daily/weekly tasks.`;

    const result = await generate(prompt, {
      goalProject,
      skillLevel,
      hoursPerDay,
      primaryFocus,
      startDate,
      kpi1,
      kpi2,
      kpi3,
    });
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const inputPanel = (
    <div className="space-y-4">
      <SmartInput
        id="goalProject"
        label="Goal / Project Name"
        value={goalProject}
        onChange={setGoalProject}
        placeholder="Your 30-day goal"
        tooltip="What project are you launching in 30 days?"
        required
      />

      <SmartSelect
        id="skillLevel"
        label="Skill Level"
        value={skillLevel}
        onChange={setSkillLevel}
        options={["Beginner", "Intermediate", "Pro"]}
        tooltip="Your current experience level in this area"
        required
      />

      <SmartInput
        id="hoursPerDay"
        label="Hours per Day"
        type="number"
        value={hoursPerDay.toString()}
        onChange={(val) => setHoursPerDay(Number(val))}
        placeholder="Hours you can commit"
        tooltip="How many hours can you dedicate daily?"
        required
      />

      <SmartSelect
        id="primaryFocus"
        label="Primary Focus"
        value={primaryFocus}
        onChange={setPrimaryFocus}
        options={["Content", "Sales", "Product", "Systems"]}
        tooltip="What area will you prioritize during the sprint?"
        required
      />

      <div className="space-y-2">
        <label htmlFor="startDate" className="text-sm font-medium">
          Start Date <span className="text-destructive">*</span>
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <SmartInput
        id="kpi1"
        label="KPI 1"
        value={kpi1}
        onChange={setKpi1}
        placeholder="First key metric"
        tooltip="First key metric to track (optional)"
      />

      <SmartInput
        id="kpi2"
        label="KPI 2"
        value={kpi2}
        onChange={setKpi2}
        placeholder="Second key metric"
        tooltip="Second key metric to track (optional)"
      />

      <SmartInput
        id="kpi3"
        label="KPI 3"
        value={kpi3}
        onChange={setKpi3}
        placeholder="Third key metric"
        tooltip="Third key metric to track (optional)"
      />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !goalProject || !startDate}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Plan...
          </>
        ) : (
          "Generate 30-Day Plan"
        )}
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
      Your 30-day hustle plan will appear here
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="30-Day Hustle Sprint"
      emoji="🏃"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
      asPage={asPage}
    />
  );
}
