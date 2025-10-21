import { Button } from "@/components/ui/button";
import { Rocket, History, Compass } from "lucide-react";

interface QuickStartSectionProps {
  onStartNew: () => void;
  onContinuePrevious: () => void;
  onExploreTools: () => void;
  hasPreviousWork: boolean;
}

export function QuickStartSection({
  onStartNew,
  onContinuePrevious,
  onExploreTools,
  hasPreviousWork,
}: QuickStartSectionProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          onClick={onStartNew}
          variant="secondary"
          className="h-20 flex flex-col gap-2 text-base font-semibold"
        >
          <Rocket className="h-5 w-5" />
          Start a New Project
        </Button>
        <Button
          onClick={onContinuePrevious}
          variant="secondary"
          className="h-20 flex flex-col gap-2 text-base font-semibold"
          disabled={!hasPreviousWork}
        >
          <History className="h-5 w-5" />
          Continue Previous
        </Button>
        <Button
          onClick={onExploreTools}
          variant="secondary"
          className="h-20 flex flex-col gap-2 text-base font-semibold"
        >
          <Compass className="h-5 w-5" />
          Explore Tools
        </Button>
      </div>
    </div>
  );
}
