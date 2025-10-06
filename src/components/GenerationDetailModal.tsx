import { Copy, Trash2, Calendar, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}: GenerationDetailModalProps) => {
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
              <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm whitespace-pre-wrap">
                {output}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 justify-end pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
