import { CourseModule } from "@/types/course";
import { VideoPlayer } from "./VideoPlayer";
import { AgentTriggerButton } from "./AgentTriggerButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LessonViewerProps {
  module: CourseModule;
  isComplete: boolean;
  onToggleComplete: () => void;
  onLaunchAgent: (agentId: string, context: Record<string, any>) => void;
}

export const LessonViewer = ({ 
  module, 
  isComplete, 
  onToggleComplete,
  onLaunchAgent 
}: LessonViewerProps) => {
  // Function to render content with bold formatting
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderContentWithFormatting = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-3">
          {renderContent(line)}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      {module.videoUrl && (
        <VideoPlayer videoUrl={module.videoUrl} provider={module.videoProvider} />
      )}

      {/* Module Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{module.title}</h2>
        {module.duration && (
          <p className="text-sm text-muted-foreground">{module.duration}</p>
        )}
      </div>

      {/* Lesson Content */}
      <div className="prose prose-invert max-w-none mb-8 text-foreground">
        {renderContentWithFormatting(module.content)}
      </div>

      {/* Agent Triggers */}
      {module.agentTriggers && module.agentTriggers.length > 0 && (
        <div className="mb-8 p-6 bg-card border border-border rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Action Tools for This Lesson
          </h3>
          <div className="space-y-3">
            {module.agentTriggers.map((trigger, index) => (
              <AgentTriggerButton
                key={index}
                trigger={trigger}
                onLaunch={onLaunchAgent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completion Checkbox */}
      <div className="flex items-center space-x-2 p-4 bg-card border border-border rounded-lg">
        <Checkbox
          id="complete"
          checked={isComplete}
          onCheckedChange={onToggleComplete}
        />
        <Label
          htmlFor="complete"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Mark this lesson as complete
        </Label>
      </div>
    </div>
  );
};
