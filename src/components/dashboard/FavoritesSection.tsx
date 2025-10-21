import { AutomationCard } from "@/components/AutomationCard";
import { AutomationTool } from "@/types/automation";
import { Star } from "lucide-react";

interface FavoritesSectionProps {
  favoriteTools: AutomationTool[];
  onToolClick: (tool: AutomationTool) => void;
  isToolAccessible: (tool: AutomationTool) => boolean;
  isFavorite: (toolId: string) => boolean;
  onFavoriteToggle: (e: React.MouseEvent, toolId: string) => void;
}

export function FavoritesSection({
  favoriteTools,
  onToolClick,
  isToolAccessible,
  isFavorite,
  onFavoriteToggle,
}: FavoritesSectionProps) {
  if (favoriteTools.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Favorites</h2>
        <span className="text-sm text-muted-foreground">
          ({favoriteTools.length})
        </span>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {favoriteTools.slice(0, 5).map((tool) => (
            <div key={tool.id} className="w-64 sm:w-auto">
              <AutomationCard
                tool={tool}
                onClick={() => onToolClick(tool)}
                isLocked={!isToolAccessible(tool)}
                isFavorite={isFavorite(tool.id)}
                onFavoriteToggle={(e) => onFavoriteToggle(e, tool.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
