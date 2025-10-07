import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KnowledgeBase } from "@/types/knowledgeBase";
import { KBRequirement } from "@/types/automation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KnowledgeBaseSelectorProps {
  knowledgeBases: KnowledgeBase[];
  attachedKB: KnowledgeBase | null;
  onAttach: (kbId: string | null) => void;
  toolRequirement: KBRequirement;
}

export function KnowledgeBaseSelector({
  knowledgeBases,
  attachedKB,
  onAttach,
  toolRequirement,
}: KnowledgeBaseSelectorProps) {
  const navigate = useNavigate();

  if (toolRequirement === "none") return null;

  const isRequired = toolRequirement === "required";
  const isRecommended = toolRequirement === "recommended";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="kb-select">
          Knowledge Base {isRequired && <span className="text-destructive">*</span>}
          {isRecommended && <span className="text-amber-500"> (recommended)</span>}
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/knowledge-bases")}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3" />
          Create New
        </Button>
      </div>
      <Select
        value={attachedKB?.id || "none"}
        onValueChange={(value) => onAttach(value === "none" ? null : value)}
      >
        <SelectTrigger id="kb-select">
          <SelectValue placeholder="Select knowledge base" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {knowledgeBases.map((kb) => (
            <SelectItem key={kb.id} value={kb.id}>
              {kb.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {attachedKB && (
        <p className="text-xs text-primary">
          ✓ Using: {attachedKB.name}
        </p>
      )}
    </div>
  );
}
