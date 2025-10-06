import { useState } from "react";
import { AutomationCard } from "@/components/AutomationCard";
import { ToolModal } from "@/components/ToolModal";
import { automations } from "@/data/automations";
import { AutomationTool, SavedHustle } from "@/types/automation";

export default function Dashboard() {
  const [selectedTool, setSelectedTool] = useState<AutomationTool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTier] = useState<"Free" | "Pro" | "Partner">("Free");
  const [savedHustles, setSavedHustles] = useState<SavedHustle[]>([]);

  const handleToolClick = (tool: AutomationTool) => {
    const isLocked = tool.isPro && userTier === "Free";
    if (!isLocked) {
      setSelectedTool(tool);
      setIsModalOpen(true);
    }
  };

  const handleSaveOutput = (output: string) => {
    if (selectedTool) {
      const newHustle: SavedHustle = {
        id: Date.now().toString(),
        toolId: selectedTool.id,
        toolTitle: selectedTool.title,
        output,
        createdAt: new Date(),
      };
      setSavedHustles([newHustle, ...savedHustles]);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Automate your hustle. Don't overthink it.
        </h1>
        <p className="text-muted-foreground text-lg">
          Pick a tool, hit generate, and watch the magic happen ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {automations.map((tool) => (
          <AutomationCard
            key={tool.id}
            tool={tool}
            onClick={() => handleToolClick(tool)}
            isLocked={tool.isPro && userTier === "Free"}
          />
        ))}
      </div>

      <ToolModal
        tool={selectedTool}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOutput}
      />
    </div>
  );
}
