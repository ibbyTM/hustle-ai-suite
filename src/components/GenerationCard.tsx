import { Calendar, Eye } from "lucide-react";

interface GenerationCardProps {
  emoji: string;
  title: string;
  createdAt: string;
  outputPreview: string;
  inputs?: Record<string, any>;
  onClick: () => void;
}

const getInputSummary = (inputs: Record<string, any> | undefined): string => {
  if (!inputs || Object.keys(inputs).length === 0) return "";
  
  const entries = Object.entries(inputs);
  const firstKey = entries[0]?.[0];
  const firstValue = entries[0]?.[1];
  
  if (!firstKey || !firstValue) return "";
  
  const valueStr = String(firstValue).slice(0, 40);
  return `${firstKey}: ${valueStr}${String(firstValue).length > 40 ? "..." : ""}`;
};

export const GenerationCard = ({ emoji, title, createdAt, outputPreview, inputs, onClick }: GenerationCardProps) => {
  const inputSummary = getInputSummary(inputs);
  const preview = outputPreview.slice(0, 150);
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedTime = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-card border border-border rounded-2xl p-4 sm:p-6 text-left transition-all duration-300 hover:shadow-glow hover:scale-105 hover:-translate-y-1 cursor-pointer min-h-[200px] sm:min-h-[220px] flex flex-col"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <span className="text-3xl sm:text-4xl">{emoji}</span>
        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      
      <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>{formattedDate} at {formattedTime}</span>
      </div>

      {inputSummary && (
        <p className="text-xs text-muted-foreground/70 mb-2 line-clamp-1 italic">
          {inputSummary}
        </p>
      )}
      
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 flex-grow">
        {preview}{outputPreview.length > 150 ? "..." : ""}
      </p>
    </button>
  );
};
