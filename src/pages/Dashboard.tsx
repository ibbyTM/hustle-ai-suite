import { useState, useEffect } from "react";
import { AutomationCard } from "@/components/AutomationCard";
import { ToolModal } from "@/components/ToolModal";
import { automations } from "@/data/automations";
import { AutomationTool, CategoryType } from "@/types/automation";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FREE_TIER_TOOLS = ["biz-idea", "hook-factory", "trend-finder", "inbox-influence"];

const categories: Array<"All" | CategoryType> = ["All", "Content", "Ads", "Hustle", "Brand", "Store", "Productivity"];

export default function Dashboard() {
  const [selectedTool, setSelectedTool] = useState<AutomationTool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"All" | CategoryType>("All");
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

  const filteredTools = automations.filter(tool => 
    activeCategory === "All" || tool.category === activeCategory
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Automate your hustle. Don't overthink it.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Pick a tool, hit generate, and watch the magic happen ✨
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Label htmlFor="category-filter" className="text-sm font-medium whitespace-nowrap">
          Category:
        </Label>
        <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as "All" | CategoryType)}>
          <SelectTrigger id="category-filter" className="w-full sm:w-[200px] h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="min-h-[44px]">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredTools.map((tool) => (
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
