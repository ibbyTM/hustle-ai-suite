import { useState, useEffect } from "react";
import { AutomationCard } from "@/components/AutomationCard";
import { ToolModal } from "@/components/ToolModal";
import { automations } from "@/data/automations";
import { AutomationTool } from "@/types/automation";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const FREE_TIER_TOOLS = ["bizidea", "hookfactory", "trendfinder", "newsletter"];

export default function Dashboard() {
  const [selectedTool, setSelectedTool] = useState<AutomationTool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tier } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const isToolAccessible = (tool: AutomationTool) => {
    if (tier === "partner" || tier === "pro") return true;
    if (tier === "free") return FREE_TIER_TOOLS.includes(tool.id);
    return false;
  };

  const handleToolClick = (tool: AutomationTool) => {
    if (!isToolAccessible(tool)) {
      navigate("/pricing");
      return;
    }
    setSelectedTool(tool);
    setIsModalOpen(true);
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
            isLocked={!isToolAccessible(tool)}
          />
        ))}
      </div>

      <ToolModal
        tool={selectedTool}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
