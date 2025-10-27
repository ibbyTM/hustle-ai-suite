import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AgentPanelLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  inputPanel: ReactNode;
  outputPanel: ReactNode;
  asPage?: boolean;
}

export function AgentPanelLayout({
  isOpen,
  onClose,
  title,
  emoji,
  inputPanel,
  outputPanel,
  asPage = false,
}: AgentPanelLayoutProps) {
  if (asPage) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 h-full">
        {/* Input Panel */}
        <div className="flex-1 overflow-y-auto pl-1 pr-0 lg:pr-4">{inputPanel}</div>

        {/* Output Panel */}
        <div className="flex-1 overflow-y-auto border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">{outputPanel}</div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-[95vw] lg:max-w-7xl h-[95vh] sm:h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            <span className="text-2xl sm:text-3xl">{emoji}</span> {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Input Panel */}
          <div className="flex-1 overflow-y-auto pl-1 pr-0 lg:pr-4">{inputPanel}</div>

          {/* Output Panel */}
          <div className="flex-1 overflow-y-auto border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">{outputPanel}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
