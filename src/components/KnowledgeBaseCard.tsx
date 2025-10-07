import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link2 } from "lucide-react";
import { KnowledgeBase } from "@/types/knowledgeBase";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeBaseCardProps {
  kb: KnowledgeBase;
  attachmentCount: number;
}

export const KnowledgeBaseCard = ({ kb, attachmentCount }: KnowledgeBaseCardProps) => {
  return (
    <Link to={`/knowledge-bases/${kb.id}`}>
      <Card className="group hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="group-hover:text-primary transition-colors">
                {kb.name}
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {kb.description || "No description"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kb.tags && kb.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {kb.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {kb.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{kb.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated {formatDistanceToNow(new Date(kb.updated_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Link2 className="h-4 w-4" />
                <span>{attachmentCount} tools</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
