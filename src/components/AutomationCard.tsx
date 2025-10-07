import { Lock } from "lucide-react";
import { AutomationTool } from "@/types/automation";
import { CategoryBadge } from "./CategoryBadge";

interface AutomationCardProps {
  tool: AutomationTool;
  onClick: () => void;
  isLocked: boolean;
}

export const AutomationCard = ({ tool, onClick, isLocked }: AutomationCardProps) => {
  const isBookForge = tool.id === "bookforge";
  
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`group relative bg-gradient-card border border-border rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-glow hover:scale-105 hover:-translate-y-1 h-[200px] flex flex-col ${
        isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      title={isBookForge ? "Creates a full 10K+ word ebook chapter-by-chapter, formatted and export-ready." : undefined}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-primary">Pro Feature</p>
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <CategoryBadge category={tool.category} />
        <span className="text-4xl">{tool.emoji}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {tool.id === "bookforge" ? (
          <>
            {tool.title}
            <span className="ml-2 text-lg opacity-70">✨</span>
          </>
        ) : (
          tool.title
        )}
      </h3>
      
      <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
        {tool.description}
      </p>
    </button>
  );
};
