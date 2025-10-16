import { useState, useEffect } from "react";
import { Loader2, Download } from "lucide-react";
import { AgentPanelLayout } from "./AgentPanelLayout";
import { SmartInput } from "./SmartInput";
import { SmartSelect } from "./SmartSelect";
import { KnowledgeBaseSelector } from "./KnowledgeBaseSelector";
import { Button } from "@/components/ui/button";
import { useKnowledgeBaseAttachment } from "@/hooks/useKnowledgeBaseAttachment";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookForgePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SavedGeneration {
  id: string;
  tool_id: string;
  tool_title: string;
  tool_emoji: string;
  output: string;
  inputs: any;
  created_at: string;
}

export function BookForgePanel({ isOpen, onClose }: BookForgePanelProps) {
  const [ebookSource, setEbookSource] = useState<"new" | "saved">("new");
  const [savedGenerations, setSavedGenerations] = useState<SavedGeneration[]>([]);
  const [selectedEbookId, setSelectedEbookId] = useState<string>("");
  
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [voice, setVoice] = useState("Professional");
  const [coverTitle, setCoverTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const { knowledgeBases, attachedKB, attachKB, buildKBContext } = useKnowledgeBaseAttachment(
    "bookforge",
    isOpen
  );

  const { toast } = useToast();

  // Fetch saved ebooks when source is "saved"
  useEffect(() => {
    if (isOpen && ebookSource === "saved") {
      fetchSavedEbooks();
    }
  }, [isOpen, ebookSource]);

  const fetchSavedEbooks = async () => {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .in("tool_id", ["bookforge", "authority-builder"])
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching saved ebooks:", error);
      return;
    }
    
    setSavedGenerations(data || []);
  };

  // Auto-populate fields when an ebook is selected
  const handleEbookSelection = (ebookId: string) => {
    setSelectedEbookId(ebookId);
    const selected = savedGenerations.find(g => g.id === ebookId);
    
    if (selected?.inputs) {
      setTopic(selected.inputs.topic || "");
      setAudience(selected.inputs.audience || "");
      setVoice(selected.inputs.voice || "Professional");
      setCoverTitle(selected.inputs.coverTitle || selected.inputs.topic || "");
      setAuthor(selected.inputs.author || "");
    }
  };

  const handleGenerateCoverImage = async () => {
    if (!topic && !coverTitle) {
      toast({
        title: "Title or topic required",
        description: "Please enter a cover title or topic first",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const kbContext = await buildKBContext();
      const imagePrompt = `Create a professional ebook cover design for "${coverTitle || topic}". 
${voice} style, targeting ${audience || "general audience"}. 
Modern, clean design with high-quality imagery. 
Include the title text prominently${author ? ` with author name "${author}"` : ""}. 
Professional typography and color scheme suitable for ${topic}.
${kbContext ? `Brand context: ${kbContext}` : ""}
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
      <div className="space-y-2">
        <label className="text-sm font-medium">Ebook Source</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ebookSource"
              value="new"
              checked={ebookSource === "new"}
              onChange={() => setEbookSource("new")}
              className="h-4 w-4"
            />
            <span className="text-sm">Create New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ebookSource"
              value="saved"
              checked={ebookSource === "saved"}
              onChange={() => setEbookSource("saved")}
              className="h-4 w-4"
            />
            <span className="text-sm">From My Hustles</span>
          </label>
        </div>
      </div>

      {ebookSource === "saved" && (
        <SmartSelect
          id="savedEbook"
          label="Select Saved Ebook"
          value={selectedEbookId}
          onChange={handleEbookSelection}
          options={savedGenerations.map(gen => ({
            value: gen.id,
            label: `${gen.tool_emoji} ${gen.tool_title} - ${new Date(gen.created_at).toLocaleDateString()}`
          }))}
          required
        />
      )}

      <SmartInput
        id="coverTitle"
        label="Cover Title"
        value={coverTitle}
        onChange={setCoverTitle}
        placeholder="Your Ebook Title"
        tooltip="The main title to appear on your cover"
        required
      />

      <SmartInput
        id="author"
        label="Author Name"
        value={author}
        onChange={setAuthor}
        placeholder="Your Name"
        tooltip="Author name to display on the cover"
      />

      <SmartInput
        id="topic"
        label="Topic / Theme"
        value={topic}
        onChange={setTopic}
        placeholder="e.g., Social Media Marketing"
        tooltip="The main subject or theme of your ebook"
        required
      />

      <SmartInput
        id="audience"
        label="Target Audience"
        value={audience}
        onChange={setAudience}
        placeholder="e.g., entrepreneurs, small business owners"
        tooltip="Who is this ebook for?"
      />

      <SmartSelect
        id="voice"
        label="Style"
        value={voice}
        onChange={setVoice}
        options={["Professional", "Modern", "Minimalist", "Bold", "Elegant"]}
        tooltip="The visual style for your cover design"
        required
      />

      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBases}
        attachedKB={attachedKB}
        onAttach={attachKB}
        toolRequirement="optional"
      />

      <Button
        onClick={handleGenerateCoverImage}
        disabled={isGeneratingImage || (!topic && !coverTitle)}
        className="w-full"
        size="lg"
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
      {coverImage ? (
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
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Your cover image will appear here
        </div>
      )}
    </div>
  );

  return (
    <AgentPanelLayout
      isOpen={isOpen}
      onClose={onClose}
      title="BookForge Cover Maker"
      emoji="📖"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    />
  );
}
