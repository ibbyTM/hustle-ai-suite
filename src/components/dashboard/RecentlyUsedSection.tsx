import { AutomationCard } from "@/components/AutomationCard";
import { AutomationTool } from "@/types/automation";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentlyUsedSectionProps {
  recentTools: Array<{
    tool: AutomationTool;
    timestamp: string;
  }>;
  onToolClick: (tool: AutomationTool) => void;
  isToolAccessible: (tool: AutomationTool) => boolean;
  isFavorite: (toolId: string) => boolean;
  onFavoriteToggle: (e: React.MouseEvent, toolId: string) => void;
}

export function RecentlyUsedSection({
  recentTools,
  onToolClick,
  isToolAccessible,
  isFavorite,
  onFavoriteToggle,
}: RecentlyUsedSectionProps) {
  if (recentTools.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Recently Used</h2>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {recentTools.map(({ tool, timestamp }) => (
            <div key={tool.id} className="w-64 sm:w-auto relative">
              <AutomationCard
                tool={tool}
                onClick={() => onToolClick(tool)}
                isLocked={!isToolAccessible(tool)}
                isFavorite={isFavorite(tool.id)}
                onFavoriteToggle={(e) => onFavoriteToggle(e, tool.id)}
              />
              <span className="absolute top-2 right-2 text-xs bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
                {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
