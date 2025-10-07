import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AgentPanelLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  inputPanel: ReactNode;
  outputPanel: ReactNode;
}

export function AgentPanelLayout({
  isOpen,
  onClose,
  title,
  emoji,
  inputPanel,
  outputPanel,
}: AgentPanelLayoutProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {emoji} {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
          {/* Input Panel - Left */}
          <div className="flex-1 overflow-y-auto pr-4">{inputPanel}</div>

          {/* Output Panel - Right */}
          <div className="flex-1 overflow-y-auto border-l border-border pl-6">{outputPanel}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
