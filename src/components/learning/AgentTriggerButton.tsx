import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";
import { AgentTrigger } from "@/types/course";
import { toast } from "sonner";

interface AgentTriggerButtonProps {
  trigger: AgentTrigger;
  onLaunch: (agentId: string, context: Record<string, any>) => void;
  isLocked?: boolean;
}

export const AgentTriggerButton = ({ trigger, onLaunch, isLocked }: AgentTriggerButtonProps) => {
  const handleClick = () => {
    if (isLocked) {
      toast.error("Upgrade to access this agent");
      return;
    }
    onLaunch(trigger.agentId, trigger.context || {});
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full justify-start gap-3 h-auto py-4 px-5 bg-gradient-primary hover:opacity-90 transition-opacity"
      disabled={isLocked}
    >
      {isLocked ? (
        <Lock className="h-5 w-5 flex-shrink-0" />
      ) : (
        <Sparkles className="h-5 w-5 flex-shrink-0" />
      )}
      <div className="flex flex-col items-start text-left flex-1">
        <span className="font-semibold text-white">{trigger.buttonText}</span>
        {trigger.description && (
          <span className="text-xs text-white/80 mt-1">{trigger.description}</span>
        )}
      </div>
    </Button>
  );
};
