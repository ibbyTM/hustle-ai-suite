import { useState } from "react";
import { AutomationCard } from "@/components/AutomationCard";
import { AutomationTool, CategoryType } from "@/types/automation";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  category: CategoryType;
  tools: AutomationTool[];
  onToolClick: (tool: AutomationTool) => void;
  isToolAccessible: (tool: AutomationTool) => boolean;
  isOpen: boolean;
  onToggle: () => void;
  isFavorite: (toolId: string) => boolean;
  onFavoriteToggle: (e: React.MouseEvent, toolId: string) => void;
}

const categoryEmojis: Record<CategoryType, string> = {
  Content: "📄",
  Ads: "📈",
  Hustle: "💼",
  Brand: "🌐",
  Store: "🏪",
  Productivity: "🧭",
};

export function CategorySection({
  category,
  tools,
  onToolClick,
  isToolAccessible,
  isOpen,
  onToggle,
  isFavorite,
  onFavoriteToggle,
}: CategorySectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="mb-4">
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryEmojis[category]}</span>
            <h2 className="text-xl font-semibold">{category}</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {tools.length}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <AutomationCard
              key={tool.id}
              tool={tool}
              onClick={() => onToolClick(tool)}
              isLocked={!isToolAccessible(tool)}
              isFavorite={isFavorite(tool.id)}
              onFavoriteToggle={(e) => onFavoriteToggle(e, tool.id)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
