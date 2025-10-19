import { useState, useEffect } from "react";
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

interface DigitalProductGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialAudience?: string;
  initialVoice?: string;
}

export const DigitalProductGeneratorModal = ({ 
  isOpen, 
  onClose, 
  initialTopic = "", 
  initialAudience = "", 
  initialVoice = "Authoritative" 
}: DigitalProductGeneratorModalProps) => {
  const [productType, setProductType] = useState<"Full Ebook" | "Mini Guide" | "Online Course">("Full Ebook");
  const [topic, setTopic] = useState(initialTopic);
  const [audience, setAudience] = useState(initialAudience);
  const [voice, setVoice] = useState(initialVoice);
  const [includeCTA, setIncludeCTA] = useState("Yes");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  const getProductConfig = () => {
    switch (productType) {
      case "Full Ebook":
        return { totalSections: 12, mainSections: 10, sectionLabel: "Chapter" };
      case "Mini Guide":
        return { totalSections: 7, mainSections: 5, sectionLabel: "Section" };
      case "Online Course":
        return { totalSections: 10, mainSections: 8, sectionLabel: "Module" };
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTopic(initialTopic);
      setAudience(initialAudience);
      setVoice(initialVoice);
    }
  }, [isOpen, initialTopic, initialAudience, initialVoice]);

  const getSectionInstructions = (sectionType: string, sectionNumber: number) => {
    if (sectionType === "title") {
      return `Generate a compelling, authoritative title and supporting subtitle that clarifies the value proposition for a ${productType}. Format:\n\n**Title**\n[Your title here]\n\n**Subtitle**\n[Your subtitle here]`;
    }
    
    if (sectionType === "introduction") {
      if (productType === "Online Course") {
        return "Write a 600-800 word course overview that establishes learning objectives, addresses the learner's needs, and previews what they'll learn. Be engaging and set the tone for the entire course.";
      } else if (productType === "Mini Guide") {
        return "Write a 400-600 word introduction that quickly establishes the problem, previews the actionable strategies, and sets expectations for immediate value.";
      }
      return "Write a 600-800 word introduction that establishes credibility, addresses the reader's pain points, and previews what they'll learn. Be engaging and set the tone.";
    }
    
    if (sectionType === "main") {
      if (productType === "Online Course") {
        return `Write Module ${sectionNumber} (800-1,000 words) with structured learning content.

Start with **Module ${sectionNumber}: [Module Title]**

**Learning Objectives:**
- Objective 1
- Objective 2
- Objective 3

**Lesson Content:**
[Write engaging, instructional content with clear examples]

**Key Concepts:**
- Concept 1
- Concept 2
- Concept 3

**Practice Exercise:**
[Provide an actionable assignment or task]

**Knowledge Check:**
1. [Quiz question 1]
2. [Quiz question 2]
3. [Quiz question 3]`;
      } else if (productType === "Mini Guide") {
        return `Write Section ${sectionNumber} (600-800 words) focusing on one specific actionable strategy.

Start with **Section ${sectionNumber}: [Section Title]**

Write content with clear, actionable steps and practical examples.

End with **Quick Tips:**
- Tip 1
- Tip 2
- Tip 3`;
      }
      return `Write Chapter ${sectionNumber} (1,000-1,200 words) with natural narrative flow.

Start with **Chapter ${sectionNumber}: [Chapter Title]**

Then write the chapter content as flowing paragraphs with clear spacing between them. Write naturally and conversationally, delivering actionable insights and frameworks.

End with **Key Takeaways:**
- Point 1
- Point 2
- Point 3`;
    }
    
    if (sectionType === "conclusion") {
      if (productType === "Online Course") {
        return `Write a 400-500 word course summary that reviews key lessons, reinforces transformation${includeCTA === "Yes" ? ", and includes a compelling call-to-action for next steps" : ""}.`;
      } else if (productType === "Mini Guide") {
        return `Write a 200-300 word quick action plan that summarizes the main strategies${includeCTA === "Yes" ? " and includes a clear next step" : ""}.`;
      }
      return `Write a 400-500 word conclusion that summarizes key lessons, reinforces transformation${includeCTA === "Yes" ? ", and includes a compelling call-to-action" : ""}.`;
    }
    
    return "";
  };

  const generateSection = async (sectionType: string, sectionNumber: number = 0) => {
    const sectionInstructions = getSectionInstructions(sectionType, sectionNumber);
    
    const prompt = `Generate ${sectionType} for a ${productType} about ${topic}, targeting ${audience}, in a ${voice} tone.

${sectionInstructions}

KNOWLEDGE BASE CONTEXT (if applicable): Use brand-specific information to enhance relevance and authenticity.`;

    try {
      const { data, error } = await supabase.functions.invoke('generate-hustle', {
        body: { 
          prompt,
          toolTitle: "Digital Product Generator"
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

    const config = getProductConfig();
    const generatedSections: Section[] = [];

    try {
      // Section 1: Title + Subtitle
      toast.info(`Generating ${productType.toLowerCase()} title...`);
      const titleContent = await generateSection("title");
      generatedSections.push({
        type: "title",
        title: "Title & Subtitle",
        content: titleContent
      });
      setSections([...generatedSections]);
      setCurrentSection(1);
      setProgress((1 / config.totalSections) * 100);

      // Section 2: Introduction/Overview
      const introLabel = productType === "Online Course" ? "Course Overview" : "Introduction";
      toast.info(`Writing ${introLabel.toLowerCase()}...`);
      const introContent = await generateSection("introduction");
      generatedSections.push({
        type: "introduction",
        title: introLabel,
        content: introContent
      });
      setSections([...generatedSections]);
      setCurrentSection(2);
      setProgress((2 / config.totalSections) * 100);

      // Main sections
      for (let i = 1; i <= config.mainSections; i++) {
        toast.info(`Creating ${config.sectionLabel} ${i} of ${config.mainSections}...`);
        const mainContent = await generateSection("main", i);
        generatedSections.push({
          type: "main",
          title: `${config.sectionLabel} ${i}`,
          content: mainContent
        });
        setSections([...generatedSections]);
        setCurrentSection(i + 2);
        setProgress(((i + 2) / config.totalSections) * 100);
      }

      // Final section
      const conclusionLabel = productType === "Mini Guide" ? "Quick Action Plan" : productType === "Online Course" ? "Course Summary" : "Conclusion";
      toast.info(`Writing ${conclusionLabel.toLowerCase()}...`);
      const conclusionContent = await generateSection("conclusion");
      generatedSections.push({
        type: "conclusion",
        title: conclusionLabel,
        content: conclusionContent
      });
      setSections([...generatedSections]);
      setCurrentSection(config.totalSections);
      setProgress(100);

      // Save to database
      const fullContent = generatedSections.map(s => s.content).join("\n\n---\n\n");
      await supabase.from("generations").insert({
        user_id: user.id,
        tool_id: "digital-product-generator",
        tool_title: "Digital Product Generator",
        tool_emoji: "🎓",
        inputs: { productType, topic, audience, voice, includeCTA },
        output: fullContent,
      });

      toast.success(`${productType} complete! 🎉`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanContent = (text: string): string => {
    let cleaned = text
      .replace(/Hustle Breakdown\s*\n[\s\S]*?(?=The Formula|$)/gi, '')
      .replace(/The Formula\s*\n[\s\S]*?(?=Your Output|$)/gi, '')
      .replace(/Your Output\s*\n/gi, '')
      .replace(/Next Play\s*\n[\s\S]*?(?=Built in the HustleHub Lab|$)/gi, '')
      .replace(/Built in the Hustle Lab — where AI meets ambition\./gi, '');
    
    cleaned = cleaned
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/^\s*[-*]\s/gm, '• ');
    
    cleaned = cleaned
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return cleaned;
  };

  const exportAsDocx = async () => {
    if (sections.length === 0) {
      toast.error("No content to export");
      return;
    }

    try {
      const titleSection = sections[0];
      const titleMatch = titleSection.content.match(/\*\*Title\*\*\s*\n*(.+?)(?:\n|$)/i);
      const subtitleMatch = titleSection.content.match(/\*\*Subtitle\*\*\s*\n*(.+?)(?:\n|$)/i);
      const productTitle = titleMatch ? titleMatch[1].trim() : topic;
      const productSubtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: productTitle, bold: true, size: 48 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            ...(productSubtitle ? [new Paragraph({
              children: [new TextRun({ text: productSubtitle, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 }
            })] : []),
            
            ...sections.slice(1).flatMap(section => {
              const cleanedContent = cleanContent(section.content);
              const lines = cleanedContent.split('\n');
              
              return [
                new Paragraph({
                  children: [new TextRun({ text: section.title, bold: true, size: 32 })],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 }
                }),
                ...lines.map(line => 
                  new Paragraph({
                    children: [new TextRun(line)],
                    spacing: { after: line.trim() === '' ? 0 : 100 }
                  })
                )
              ];
            }),
            
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
      saveAs(blob, `${topic.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-${productType.toLowerCase().replace(/\s+/g, '-')}.docx`);
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
      const titleSection = sections[0];
      const titleMatch = titleSection.content.match(/\*\*Title\*\*\s*\n*(.+?)(?:\n|$)/i);
      const subtitleMatch = titleSection.content.match(/\*\*Subtitle\*\*\s*\n*(.+?)(?:\n|$)/i);
      const productTitle = titleMatch ? titleMatch[1].trim() : topic;
      const productSubtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (2 * margin);
      let yPosition = 40;

      // Title page
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      const titleLines = pdf.splitTextToSize(productTitle, maxWidth);
      titleLines.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;
      });

      if (productSubtitle) {
        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "normal");
        const subtitleLines = pdf.splitTextToSize(productSubtitle, maxWidth);
        subtitleLines.forEach((line: string) => {
          pdf.text(line, pageWidth / 2, yPosition, { align: "center" });
          yPosition += 8;
        });
      }

      // Process sections
      sections.slice(1).forEach((section) => {
        pdf.addPage();
        yPosition = margin;

        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(section.title, margin, yPosition);
        yPosition += 12;

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
          yPosition += 5;
        });
      });

      // Footer
      pdf.addPage();
      yPosition = pageHeight / 2;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "italic");
      pdf.text("Built in the Hustle Lab — where AI meets ambition.", pageWidth / 2, yPosition, { align: "center" });

      pdf.save(`${topic.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-${productType.toLowerCase().replace(/\s+/g, '-')}.pdf`);
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
      setProductType("Full Ebook");
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
            <span className="text-5xl">🎓</span>
            <div>
              <DialogTitle className="text-2xl font-bold">Digital Product Generator</DialogTitle>
              <p className="text-sm text-muted-foreground">Generate complete digital products — from quick mini guides to comprehensive courses</p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Setup</h3>
            
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select value={productType} onValueChange={(val) => setProductType(val as any)} disabled={isGenerating}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Ebook">Full Ebook (10,000 words)</SelectItem>
                  <SelectItem value="Mini Guide">Mini Guide (3,000-5,000 words)</SelectItem>
                  <SelectItem value="Online Course">Online Course (6,000-8,000 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
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
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate {productType}
                </>
              )}
            </Button>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Preview</h3>
              {sections.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={exportAsDocx} variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    DOCX
                  </Button>
                  <Button onClick={exportAsPdf} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              )}
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress)}% complete...
                </p>
              </div>
            )}

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {sections.length === 0 && !isGenerating && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Your {productType.toLowerCase()} will appear here</p>
                </div>
              )}

              {sections.map((section, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-secondary">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <h4 className="font-semibold text-sm">{section.title}</h4>
                    {expandedSections.has(index) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>

                  {expandedSections.has(index) && (
                    <div className="mt-3 text-sm whitespace-pre-wrap">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
