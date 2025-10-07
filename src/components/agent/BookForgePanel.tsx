import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { SmartTextarea } from "./SmartTextarea";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";

interface BookForgePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookForgePanel({ isOpen, onClose }: BookForgePanelProps) {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [voice, setVoice] = useState("Authoritative");
  const [desiredLength, setDesiredLength] = useState(10000);
  const [chapterCount, setChapterCount] = useState(10);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [coverTitle, setCoverTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [includeCaseStudies, setIncludeCaseStudies] = useState(false);

  const { generate, isGenerating, output } = useAgentGeneration({
    toolId: "bookforge",
    toolTitle: "BookForge (Authority Builder)",
    toolEmoji: "📖",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "bookforge",
    isOpen
  );

  const handleGenerate = async () => {
    const kbContext = await buildKBContext();
    const prompt = `Generate a comprehensive ebook outline and content about ${topic}, targeting ${audience}, in a ${voice} tone.

Target length: ${desiredLength} words
Chapter count: ${chapterCount}
Include CTA: ${includeCTA ? "Yes" : "No"}
${coverTitle ? `Cover Title: ${coverTitle}` : ""}
${author ? `Author: ${author}` : ""}
Include case studies: ${includeCaseStudies ? "Yes" : "No"}

${kbContext}

Provide a detailed ebook structure with:
- Title & Subtitle
- Chapter breakdown with key points
- Introduction framework
- Conclusion framework
- Recommended CTAs (if applicable)

Format with clear headings and structure.`;

    await generate(prompt, {
      topic,
      audience,
      voice,
      desiredLength,
      chapterCount,
      includeCTA,
      coverTitle,
      author,
      includeCaseStudies,
    });
  };

  const inputPanel = (
    <div className="space-y-4">
      <SmartTextarea
        id="topic"
        label="Ebook Topic"
        value={topic}
        onChange={setTopic}
        placeholder="e.g., Social Media Marketing & Automation for Small Businesses"
        required
      />

      <SmartInput
        id="audience"
        label="Target Audience"
        value={audience}
        onChange={setAudience}
        placeholder="e.g., small business owners, freelancers"
        required
      />

      <SmartSelect
        id="voice"
        label="Tone / Voice"
        value={voice}
        onChange={setVoice}
        options={["Authoritative", "Conversational", "Educational", "Inspirational"]}
        required
      />

      <SmartInput
        id="desiredLength"
        label="Desired Length (words)"
        type="number"
        value={desiredLength.toString()}
        onChange={(val) => setDesiredLength(Number(val))}
        placeholder="10000"
        required
      />

      <SmartInput
        id="chapterCount"
        label="Chapter Count"
        type="number"
        value={chapterCount.toString()}
        onChange={(val) => setChapterCount(Number(val))}
        placeholder="10"
      />

      <SmartInput
        id="coverTitle"
        label="Cover Title (override)"
        value={coverTitle}
        onChange={setCoverTitle}
        placeholder="Optional custom title"
      />

      <SmartInput
        id="author"
        label="Author Name"
        value={author}
        onChange={setAuthor}
        placeholder="Optional author name"
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Include CTA</label>
        <input
          type="checkbox"
          checked={includeCTA}
          onChange={(e) => setIncludeCTA(e.target.checked)}
          className="h-4 w-4"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Include Case Studies</label>
        <input
          type="checkbox"
          checked={includeCaseStudies}
          onChange={(e) => setIncludeCaseStudies(e.target.checked)}
          className="h-4 w-4"
        />
      </div>

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="recommended"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !topic || !audience}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Ebook Outline"
        )}
      </Button>
    </div>
  );

  const outputPanel = output ? (
    <OutputPreview content={output} />
  ) : (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Your ebook outline will appear here
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="BookForge (Authority Builder)"
      emoji="📖"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
