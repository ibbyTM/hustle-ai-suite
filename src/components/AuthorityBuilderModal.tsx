import { useState } from "react";
import { X, Sparkles, Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

interface Section {
  type: string;
  title: string;
  content: string;
}

interface AuthorityBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorityBuilderModal = ({ isOpen, onClose }: AuthorityBuilderModalProps) => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [voice, setVoice] = useState("Authoritative");
  const [includeCTA, setIncludeCTA] = useState("Yes");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  const totalSections = 12; // Title+Intro + 10 chapters + Conclusion

  const getSectionInstructions = (sectionType: string, sectionNumber: number) => {
    switch (sectionType) {
      case "title":
        return "Generate a compelling, authoritative title and supporting subtitle that clarifies the value proposition. Format:\n\n**Title**\n[Your title here]\n\n**Subtitle**\n[Your subtitle here]";
      
      case "introduction":
        return "Write a 600-800 word introduction that establishes credibility, addresses the reader's pain points, and previews what they'll learn. Be engaging and set the tone for the entire ebook.";
      
      case "chapter":
        return `Write Chapter ${sectionNumber} (1,000-1,200 words). Structure:\n\n**Chapter ${sectionNumber}: [Chapter Title]**\n\n**Opening:** Set context and hook the reader\n\n**Main Content:** Deliver actionable insights, frameworks, or lessons\n\n**Key Takeaways:**\n- Point 1\n- Point 2\n- Point 3\n\n**Transition:** Bridge to the next chapter`;
      
      case "conclusion":
        return `Write a 400-500 word conclusion that summarizes key lessons, reinforces transformation${includeCTA === "Yes" ? ", and includes a compelling call-to-action" : ""}.`;
      
      default:
        return "";
    }
  };

  const generateSection = async (sectionType: string, sectionNumber: number = 0) => {
    const sectionInstructions = getSectionInstructions(sectionType, sectionNumber);
    
    const prompt = `Generate ${sectionType} for an ebook about ${topic}, targeting ${audience}, in a ${voice} tone.

${sectionInstructions}

KNOWLEDGE BASE CONTEXT (if applicable): Use brand-specific information to enhance relevance and authenticity.`;

    try {
      const { data, error } = await supabase.functions.invoke('generate-hustle', {
        body: { 
          prompt,
          toolTitle: "BookForge"
        }
      });

      if (error) throw error;
      if (!data?.generatedText) throw new Error('No content received');

      return data.generatedText;
    } catch (error) {
      console.error('Section generation error:', error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate content");
      return;
    }

    if (!topic || !audience) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    setSections([]);
    setCurrentSection(0);
    setProgress(0);

    const generatedSections: Section[] = [];

    try {
      // Section 1: Title + Subtitle
      toast.info("Generating title and subtitle...");
      const titleContent = await generateSection("title");
      generatedSections.push({
        type: "title",
        title: "Title & Subtitle",
        content: titleContent
      });
      setSections([...generatedSections]);
      setCurrentSection(1);
      setProgress((1 / totalSections) * 100);

      // Section 2: Introduction
      toast.info("Writing introduction...");
      const introContent = await generateSection("introduction");
      generatedSections.push({
        type: "introduction",
        title: "Introduction",
        content: introContent
      });
      setSections([...generatedSections]);
      setCurrentSection(2);
      setProgress((2 / totalSections) * 100);

      // Sections 3-12: 10 Chapters
      for (let i = 1; i <= 10; i++) {
        toast.info(`Writing Chapter ${i} of 10...`);
        const chapterContent = await generateSection("chapter", i);
        generatedSections.push({
          type: "chapter",
          title: `Chapter ${i}`,
          content: chapterContent
        });
        setSections([...generatedSections]);
        setCurrentSection(i + 2);
        setProgress(((i + 2) / totalSections) * 100);
      }

      // Section 13: Conclusion
      toast.info("Writing conclusion...");
      const conclusionContent = await generateSection("conclusion");
      generatedSections.push({
        type: "conclusion",
        title: "Conclusion",
        content: conclusionContent
      });
      setSections([...generatedSections]);
      setCurrentSection(13);
      setProgress(100);

      // Save to database
      const fullEbook = generatedSections.map(s => s.content).join("\n\n---\n\n");
      await supabase.from("generations").insert({
        user_id: user.id,
        tool_id: "bookforge",
        tool_title: "BookForge",
        tool_emoji: "📖",
        inputs: { topic, audience, voice, includeCTA },
        output: fullEbook,
      });

      toast.success("Ebook complete! 🎉");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanContent = (text: string): string => {
    // Remove technical blocks: "Hustle Breakdown", "The Formula", "Your Output", "Next Play"
    let cleaned = text
      .replace(/Hustle Breakdown\s*\n[\s\S]*?(?=The Formula|$)/gi, '')
      .replace(/The Formula\s*\n[\s\S]*?(?=Your Output|$)/gi, '')
      .replace(/Your Output\s*\n/gi, '')
      .replace(/Next Play\s*\n[\s\S]*?(?=Built in the HustleHub Lab|$)/gi, '')
      .replace(/Built in the Hustle Lab — where AI meets ambition\./gi, '');
    
    // Remove markdown formatting
    cleaned = cleaned
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/^\s*[-*]\s/gm, '• '); // Convert markdown lists to bullet points
    
    // Clean up excessive whitespace while preserving paragraph breaks
    cleaned = cleaned
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .trim();
    
    return cleaned;
  };

  const exportAsDocx = async () => {
    if (sections.length === 0) {
      toast.error("No content to export");
      return;
    }

    try {
      // Extract title and subtitle from first section
      const titleSection = sections[0];
      const titleMatch = titleSection.content.match(/\*\*Title\*\*\s*\n*(.+?)(?:\n|$)/i);
      const subtitleMatch = titleSection.content.match(/\*\*Subtitle\*\*\s*\n*(.+?)(?:\n|$)/i);
      const ebookTitle = titleMatch ? titleMatch[1].trim() : topic;
      const ebookSubtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title page
            new Paragraph({
              children: [new TextRun({ text: ebookTitle, bold: true, size: 48 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            ...(ebookSubtitle ? [new Paragraph({
              children: [new TextRun({ text: ebookSubtitle, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 }
            })] : []),
            
            // Process each section with cleaned content
            ...sections.slice(1).flatMap(section => {
              const cleanedContent = cleanContent(section.content);
              const lines = cleanedContent.split('\n');
              
              return [
                // Section heading
                new Paragraph({
                  children: [new TextRun({ text: section.title, bold: true, size: 32 })],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 }
                }),
                // Content paragraphs
                ...lines.map(line => 
                  new Paragraph({
                    children: [new TextRun(line)],
                    spacing: { after: line.trim() === '' ? 0 : 100 }
                  })
                )
              ];
            }),
            
            // Footer signature
            new Paragraph({
              children: [new TextRun({ text: "", size: 24 })],
              spacing: { before: 400 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Built in the Hustle Lab — where AI meets ambition.", italics: true })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200 }
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${topic.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-ebook.docx`);
      toast.success("Exported as .docx!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Export failed");
    }
  };

  const exportAsPdf = () => {
    if (sections.length === 0) {
      toast.error("No content to export");
      return;
    }

    try {
      // Extract title and subtitle
      const titleSection = sections[0];
      const titleMatch = titleSection.content.match(/\*\*Title\*\*\s*\n*(.+?)(?:\n|$)/i);
      const subtitleMatch = titleSection.content.match(/\*\*Subtitle\*\*\s*\n*(.+?)(?:\n|$)/i);
      const ebookTitle = titleMatch ? titleMatch[1].trim() : topic;
      const ebookSubtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (2 * margin);
      let yPosition = 40;

      // Title page
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      const titleLines = pdf.splitTextToSize(ebookTitle, maxWidth);
      titleLines.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;
      });

      if (ebookSubtitle) {
        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "normal");
        const subtitleLines = pdf.splitTextToSize(ebookSubtitle, maxWidth);
        subtitleLines.forEach((line: string) => {
          pdf.text(line, pageWidth / 2, yPosition, { align: "center" });
          yPosition += 8;
        });
      }

      // Process sections
      sections.slice(1).forEach((section, index) => {
        // Add new page for each section
        pdf.addPage();
        yPosition = margin;

        // Section heading
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(section.title, margin, yPosition);
        yPosition += 12;

        // Section content
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        const cleanedContent = cleanContent(section.content);
        const paragraphs = cleanedContent.split('\n\n');

        paragraphs.forEach((paragraph) => {
          if (paragraph.trim() === '') return;

          const lines = pdf.splitTextToSize(paragraph, maxWidth);
          lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 5; // Extra space between paragraphs
        });
      });

      // Footer on last page
      pdf.addPage();
      yPosition = pageHeight / 2;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "italic");
      pdf.text("Built in the Hustle Lab — where AI meets ambition.", pageWidth / 2, yPosition, { align: "center" });

      // Save PDF
      pdf.save(`${topic.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-ebook.pdf`);
      toast.success("Exported as .pdf!");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Export failed");
    }
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const handleClose = () => {
    if (!isGenerating) {
      setTopic("");
      setAudience("");
      setVoice("Authoritative");
      setIncludeCTA("Yes");
      setSections([]);
      setCurrentSection(0);
      setProgress(0);
      setExpandedSections(new Set());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <span className="text-5xl">📖</span>
            <div>
              <DialogTitle className="text-2xl font-bold">BookForge</DialogTitle>
              <p className="text-sm text-muted-foreground">Forge your expertise into a full, 10,000-word ebook — strategy, structure, and execution handled by Hustle Lab AI.</p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Setup</h3>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Ebook Topic *</Label>
              <Textarea
                id="topic"
                placeholder="e.g., Social Media Marketing & Automation for Small Businesses"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-secondary border-border min-h-[80px]"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience *</Label>
              <Input
                id="audience"
                placeholder="e.g., small business owners, freelancers"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-secondary border-border"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice">Tone / Voice</Label>
              <Select value={voice} onValueChange={setVoice} disabled={isGenerating}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Authoritative">Authoritative</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                  <SelectItem value="Inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta">Include Call-to-Action?</Label>
              <Select value={includeCTA} onValueChange={setIncludeCTA} disabled={isGenerating}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic || !audience}
              variant="gradient"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating Section {currentSection} of {totalSections}...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Full Ebook
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}

            {sections.length > 0 && !isGenerating && (
              <div className="flex gap-2">
                <Button onClick={exportAsDocx} variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Export .docx
                </Button>
                <Button onClick={exportAsPdf} variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export .pdf
                </Button>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Preview</h3>
            
            {sections.length === 0 ? (
              <div className="bg-secondary/50 border border-dashed border-border rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Your ebook sections will appear here as they generate ✨
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {sections.map((section, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full p-3 bg-secondary hover:bg-secondary/80 flex items-center justify-between text-left"
                    >
                      <span className="font-medium">{section.title}</span>
                      {expandedSections.has(index) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.has(index) && (
                      <div className="p-4 bg-background border-t border-border">
                        <div className="whitespace-pre-wrap text-sm">
                          {section.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
