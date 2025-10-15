import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { OutputPreview } from "./OutputPreview";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";

interface SocialScraperPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialScraperPanel({ isOpen, onClose }: SocialScraperPanelProps) {
  const [hashtag, setHashtag] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [dataPoints, setDataPoints] = useState<string[]>(["Creator Names", "Follower Counts", "Video Hooks"]);
  const [resultsLimit, setResultsLimit] = useState(10);

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "social-scraper",
    toolTitle: "Hashtag Hunter",
    toolEmoji: "🔍",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "social-scraper",
    isOpen
  );

  const handleGenerate = async () => {
    const kbContext = buildKBContext();

    const prompt = `Analyze and extract data for the hashtag '${hashtag}' on ${platform}. Focus on: ${dataPoints.join(", ")}. Limit: ${resultsLimit} results.

${kbContext}

Use this exact structure:

**Hashtag Overview**
Summarize the hashtag's performance and content type.

**Top Creators**
For each creator:
- Username / Name
- Follower Count (estimated)
- Content Style
- Top Performing Video Hook
- Engagement Pattern

**Content Trends**
Identify 3-5 recurring themes, formats, or patterns.

**Hook Examples**
List 5-10 high-performing opening lines.

**Strategic Insights**
Provide actionable takeaways for someone wanting to use this hashtag.

Do not use emojis. Present data in a clean, research-style format.`;

    await generate(prompt, {
      hashtag,
      platform,
      dataPoints,
      resultsLimit,
    });
  };

  const inputPanel = (
    <div className="space-y-4">
      <SmartInput
        id="hashtag"
        label="Hashtag"
        value={hashtag}
        onChange={setHashtag}
        placeholder="e.g., #fitness, #ecommerce"
        required
      />

      <SmartSelect
        id="platform"
        label="Platform"
        value={platform}
        onChange={setPlatform}
        options={["TikTok", "Instagram", "Both"]}
        required
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Data to Extract</label>
        <div className="flex flex-wrap gap-2">
          {["Creator Names", "Follower Counts", "Video Hooks", "Engagement Metrics", "Content Trends"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setDataPoints((prev) =>
                  prev.includes(option)
                    ? prev.filter((p) => p !== option)
                    : [...prev, option]
                );
              }}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                dataPoints.includes(option)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <SmartInput
        id="resultsLimit"
        label="Max Results"
        value={resultsLimit.toString()}
        onChange={(val) => setResultsLimit(parseInt(val) || 10)}
        type="number"
        placeholder="10"
      />

      <KnowledgeBaseSelector
        attachedKB={attachedKB}
        knowledgeBases={knowledgeBases}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button onClick={handleGenerate} disabled={isGenerating || !hashtag} className="w-full">
        {isGenerating ? "Analyzing..." : "🔍 Hunt Hashtag Data"}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Enter a hashtag and hit "Hunt Hashtag Data" to extract creator insights
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Hashtag Hunter"
      emoji="🔍"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
