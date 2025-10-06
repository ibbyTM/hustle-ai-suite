import { Calendar, Eye } from "lucide-react";

interface GenerationCardProps {
  emoji: string;
  title: string;
  createdAt: string;
  outputPreview: string;
  onClick: () => void;
}

export const GenerationCard = ({ emoji, title, createdAt, outputPreview, onClick }: GenerationCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-card border border-border rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-glow hover:scale-105 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{emoji}</span>
        <Eye className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Calendar className="h-4 w-4" />
        {new Date(createdAt).toLocaleDateString()}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3">
        {outputPreview}
      </p>
    </button>
  );
};
