import { useState } from "react";
import { Loader2, Download, Sparkles } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { SmartTextarea } from "./SmartTextarea";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { OutputPreview } from "./OutputPreview";
import { Button } from "@/components/ui/button";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthorityBuilderModal } from "../AuthorityBuilderModal";

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
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showAuthorityBuilder, setShowAuthorityBuilder] = useState(false);

  const [generationId, setGenerationId] = useState<string>();

  const { generate, isGenerating, output, setOutput } = useAgentGeneration({
    toolId: "bookforge",
    toolTitle: "BookForge Outline",
    toolEmoji: "📖",
  });

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "bookforge",
    isOpen
  );

  const { toast } = useToast();

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

    const result = await generate(prompt, {
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
    if (result?.generationId) {
      setGenerationId(result.generationId);
    }
  };

  const handleGenerateCoverImage = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter an ebook topic first",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imagePrompt = `Create a professional ebook cover design for "${coverTitle || topic}". 
${voice} tone, targeting ${audience || "general audience"}. 
Modern, clean design with high-quality imagery. 
Include the title text prominently. 
Professional typography and color scheme suitable for ${topic}.
Ultra high resolution, 16:9 aspect ratio.`;

      const { data, error } = await supabase.functions.invoke('generate-cover-image', {
        body: { prompt: imagePrompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setCoverImage(data.imageUrl);
        toast({
          title: "Cover generated!",
          description: "Your ebook cover image is ready"
        });
      }
    } catch (error) {
      console.error('Error generating cover:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate cover image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadCover = () => {
    if (!coverImage) return;
    
    const link = document.createElement('a');
    link.href = coverImage;
    link.download = `${(coverTitle || topic).replace(/\s+/g, '-').toLowerCase()}-cover.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <Button
        onClick={handleGenerateCoverImage}
        disabled={isGeneratingImage || !topic}
        className="w-full"
        size="lg"
        variant="outline"
      >
        {isGeneratingImage ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Cover...
          </>
        ) : (
          "Generate Cover Image"
        )}
      </Button>
    </div>
  );

  const outputPanel = (
    <div className="space-y-6">
      {coverImage && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Generated Cover</h3>
            <Button
              onClick={handleDownloadCover}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <img 
            src={coverImage} 
            alt="Generated ebook cover" 
            className="w-full rounded-lg shadow-lg border"
          />
        </div>
      )}
      
      {output ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Ebook Outline</h3>
          <OutputPreview 
            content={output}
            generationId={generationId}
            onContentUpdate={(newContent) => setOutput(newContent)}
          />
          
          <div className="pt-4 border-t border-border">
            <Button
              onClick={() => setShowAuthorityBuilder(true)}
              className="w-full"
              size="lg"
              variant="gradient"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Full Ebook from This Outline
            </Button>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Transform this outline into a complete 10,000-word ebook
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Your ebook outline will appear here
        </div>
      )}
    </div>
  );

  return (
    <>
      <AgentPanelLayout
        isOpen={isOpen}
        onClose={onClose}
        title="BookForge Outline"
        emoji="📖"
        inputPanel={inputPanel}
        outputPanel={outputPanel}
      />
      
      <AuthorityBuilderModal
        isOpen={showAuthorityBuilder}
        onClose={() => setShowAuthorityBuilder(false)}
        initialTopic={topic}
        initialAudience={audience}
        initialVoice={voice}
      />
    </>
  );
}
