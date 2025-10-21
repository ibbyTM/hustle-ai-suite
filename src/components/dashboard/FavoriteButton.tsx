import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  className,
}: FavoriteButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "absolute top-2 right-2 p-1.5 rounded-md backdrop-blur-sm transition-all z-10",
        "bg-background/60 hover:bg-background/80",
        "opacity-0 group-hover:opacity-100",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorite
            ? "fill-primary text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
      />
    </button>
  );
}
