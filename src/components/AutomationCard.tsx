import { Lock } from "lucide-react";
import { AutomationTool } from "@/types/automation";
import { CategoryBadge } from "./CategoryBadge";
import { FavoriteButton } from "./dashboard/FavoriteButton";

interface AutomationCardProps {
  tool: AutomationTool;
  onClick: () => void;
  isLocked: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
}

export const AutomationCard = ({ 
  tool, 
  onClick, 
  isLocked, 
  isFavorite = false,
  onFavoriteToggle 
}: AutomationCardProps) => {
  const isBookForge = tool.id === "bookforge";
  
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`group relative bg-gradient-card border border-border rounded-2xl p-4 sm:p-6 text-left transition-all duration-300 hover:shadow-glow hover:scale-105 hover:-translate-y-1 min-h-[240px] sm:h-[280px] flex flex-col ${
        isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      title={isBookForge ? "Creates a full 10K+ word ebook chapter-by-chapter, formatted and export-ready." : undefined}
    >
      {onFavoriteToggle && (
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onFavoriteToggle}
        />
      )}
      
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center px-4">
            <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-primary mb-1">Upgrade to unlock</p>
            <p className="text-xs text-muted-foreground">Click to view pricing</p>
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <CategoryBadge category={tool.category} />
        <span className="text-3xl sm:text-4xl">{tool.emoji}</span>
      </div>
      
      <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {tool.id === "bookforge" ? (
          <>
            {tool.title}
            <span className="ml-2 text-base sm:text-lg opacity-70">✨</span>
          </>
        ) : (
          tool.title
        )}
      </h3>
      
      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3 sm:line-clamp-4 flex-1">
        {tool.description}
      </p>
    </button>
  );
};
