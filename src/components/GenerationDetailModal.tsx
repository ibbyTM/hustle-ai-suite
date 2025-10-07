import { Copy, Trash2, Calendar, X, FileText, Download, Edit, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GenerationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emoji: string;
  title: string;
  createdAt: string;
  inputs: any;
  output: string;
  onCopy: () => void;
  onDelete: () => void;
  toolId?: string;
  generationId?: string;
  onSave?: () => void;
}

export const GenerationDetailModal = ({
  isOpen,
  onClose,
  emoji,
  title,
  createdAt,
  inputs,
  output,
  onCopy,
  onDelete,
  toolId,
  generationId,
  onSave,
}: GenerationDetailModalProps) => {
  const isBookForge = toolId === "bookforge";
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(output);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!generationId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("generations")
        .update({ output: editedContent })
        .eq("id", generationId);

      if (error) throw error;

      toast.success("Changes saved!");
      setIsEditing(false);
      onSave?.();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(output);
    setIsEditing(false);
  };

  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
      }

      // Bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      const formatted = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      );

      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }

      // Bullet points
      if (line.trim().startsWith('- ')) {
        return <li key={index} className="ml-4">{line.replace(/^- /, '')}</li>;
      }

      // Regular paragraphs
      return <p key={index} className="mb-2">{formatted}</p>;
    });
  };

  const cleanContent = (text: string): string => {
    let cleaned = text
      .replace(/Hustle Breakdown\s*\n[\s\S]*?(?=The Formula|$)/gi, '')
      .replace(/The Formula\s*\n[\s\S]*?(?=Your Output|$)/gi, '')
      .replace(/Your Output\s*\n/gi, '')
      .replace(/Next Play\s*\n[\s\S]*?(?=Built in the HustleHub Lab|$)/gi, '')
      .replace(/Built in the HustleHub Lab — where AI meets ambition\./gi, '');
    
    cleaned = cleaned
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/^\s*[-*]\s/gm, '• ');
    
    cleaned = cleaned
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return cleaned;
  };

  const parseSections = (output: string) => {
    const sections = output.split(/\n\n---\n\n/);
    return sections.map((content, index) => {
      if (index === 0) return { type: "title", title: "Title & Subtitle", content };
      if (index === 1) return { type: "introduction", title: "Introduction", content };
      if (index === sections.length - 1) return { type: "conclusion", title: "Conclusion", content };
      return { type: "chapter", title: `Chapter ${index - 1}`, content };
    });
  };

  const exportAsPdf = () => {
    if (!isBookForge) return;

    try {
      const currentOutput = isEditing ? editedContent : output;
      const sections = parseSections(currentOutput);
      const titleSection = sections[0];
      const titleMatch = titleSection.content.match(/\*\*Title\*\*\s*\n*(.+?)(?:\n|$)/i);
      const subtitleMatch = titleSection.content.match(/\*\*Subtitle\*\*\s*\n*(.+?)(?:\n|$)/i);
      const ebookTitle = titleMatch ? titleMatch[1].trim() : inputs.topic || "Ebook";
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

      pdf.addPage();
      yPosition = pageHeight / 2;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "italic");
      pdf.text("Built in the HustleHub Lab — where AI meets ambition.", pageWidth / 2, yPosition, { align: "center" });

      pdf.save(`${ebookTitle.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-ebook.pdf`);
      toast.success("Exported as .pdf!");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Export failed");
    }
  };

  const exportAsDocx = async () => {
    if (!isBookForge) return;

    try {
      const currentOutput = isEditing ? editedContent : output;
      const sections = parseSections(currentOutput);
      const titleSection = sections[0];
      const titleMatch = titleSection.content.match(/\*\*Title\*\*\s*\n*(.+?)(?:\n|$)/i);
      const subtitleMatch = titleSection.content.match(/\*\*Subtitle\*\*\s*\n*(.+?)(?:\n|$)/i);
      const ebookTitle = titleMatch ? titleMatch[1].trim() : inputs.topic || "Ebook";
      const ebookSubtitle = subtitleMatch ? subtitleMatch[1].trim() : '';

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
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
              children: [new TextRun({ text: "Built in the HustleHub Lab — where AI meets ambition.", italics: true })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200 }
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${ebookTitle.slice(0, 30).replace(/[^a-z0-9]/gi, '-')}-ebook.docx`);
      toast.success("Exported as .docx!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Export failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <DialogTitle className="text-2xl mb-1">{title}</DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {!isEditing && generationId && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-200px)]">
          <div className="space-y-4 pr-4">
            {Object.keys(inputs).length > 0 && (
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="text-sm font-semibold text-muted-foreground mb-3">Inputs Used:</div>
                <div className="space-y-2">
                  {Object.entries(inputs).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium capitalize">{key}:</span>{" "}
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-3">Output:</div>
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Edit your content..."
                />
              ) : (
                <div className="bg-secondary/50 border border-border rounded-lg p-6 text-sm prose prose-sm max-w-none dark:prose-invert">
                  {formatContent(output)}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 justify-end pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              {isBookForge && (
                <>
                  <Button variant="outline" size="sm" onClick={exportAsDocx}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export .docx
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportAsPdf}>
                    <Download className="h-4 w-4 mr-2" />
                    Export .pdf
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={onCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
