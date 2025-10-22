import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface LessonNavigationBarProps {
  hasPrevModule: boolean;
  hasNextModule: boolean;
  onPrevModule: () => void;
  onNextModule: () => void;
  onViewResources?: () => void;
}

export const LessonNavigationBar = ({
  hasPrevModule,
  hasNextModule,
  onPrevModule,
  onNextModule,
  onViewResources
}: LessonNavigationBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Button
          variant="outline"
          disabled={!hasPrevModule}
          onClick={onPrevModule}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {onViewResources && (
          <Button variant="ghost" onClick={onViewResources} className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </Button>
        )}

        <Button
          disabled={!hasNextModule}
          onClick={onNextModule}
          className="gap-2 bg-gradient-primary"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
