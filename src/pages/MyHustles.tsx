import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { automations } from "@/data/automations";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryType } from "@/types/automation";
import { GenerationCard } from "@/components/GenerationCard";
import { GenerationDetailModal } from "@/components/GenerationDetailModal";

interface Generation {
  id: string;
  tool_id: string;
  tool_title: string;
  tool_emoji: string;
  inputs: any;
  output: string;
  created_at: string;
}

export default function MyHustles() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchGenerations();
  }, [user, navigate]);

  const fetchGenerations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setGenerations(data || []);
    } catch (error: any) {
      console.error("Error fetching generations:", error);
      toast.error("Failed to load your hustles");
    } finally {
      setLoading(false);
    }
  };

  const getToolCategory = (toolId: string): CategoryType | null => {
    const tool = automations.find((t) => t.id === toolId);
    return tool?.category || null;
  };

  const groupedGenerations = () => {
    const categoryOrder: CategoryType[] = ["Content", "Ads", "Hustle", "Brand", "Store", "Productivity"];
    const grouped: Record<CategoryType, Generation[]> = {
      Content: [],
      Ads: [],
      Hustle: [],
      Brand: [],
      Store: [],
      Productivity: [],
    };

    generations.forEach((gen) => {
      const category = getToolCategory(gen.tool_id);
      if (category) {
        grouped[category].push(gen);
      }
    });

    return categoryOrder
      .filter((category) => grouped[category].length > 0)
      .map((category) => {
        // Group generations by tool within this category
        const toolGroups: Record<string, Generation[]> = {};
        
        grouped[category].forEach((gen) => {
          if (!toolGroups[gen.tool_id]) {
            toolGroups[gen.tool_id] = [];
          }
          toolGroups[gen.tool_id].push(gen);
        });

        // Convert to array format with tool metadata
        const tools = Object.entries(toolGroups).map(([toolId, gens]) => ({
          toolId,
          toolTitle: gens[0].tool_title,
          toolEmoji: gens[0].tool_emoji,
          generations: gens,
        }));

        return {
          category,
          tools,
          totalCount: grouped[category].length,
        };
      });
  };

  const handleCardClick = (generation: Generation) => {
    setSelectedGeneration(generation);
    setIsDetailModalOpen(true);
  };

  const handleCopy = () => {
    if (selectedGeneration) {
      navigator.clipboard.writeText(selectedGeneration.output);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDelete = async () => {
    if (!selectedGeneration) return;

    try {
      const { error } = await supabase
        .from("generations")
        .delete()
        .eq("id", selectedGeneration.id);

      if (error) throw error;

      setGenerations(generations.filter((gen) => gen.id !== selectedGeneration.id));
      toast.success("Hustle deleted");
      setIsDetailModalOpen(false);
      setSelectedGeneration(null);
    } catch (error: any) {
      console.error("Error deleting generation:", error);
      toast.error("Failed to delete");
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading your hustles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">My Hustles</h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
          All your saved outputs in one place. Copy, share, or export.
        </p>
      </div>

      {generations.length === 0 ? (
        <div className="bg-gradient-card border border-border rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-2">No hustles saved yet</h2>
            <p className="text-muted-foreground mb-6">
              Generate some content with our tools and your history will appear here!
            </p>
            <Button variant="gradient" onClick={() => navigate("/")}>
              Browse Tools
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-12">
            {groupedGenerations().map(({ category, tools, totalCount }) => (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3">
                  <CategoryBadge category={category} />
                  <span className="text-muted-foreground text-sm">
                    {totalCount} {totalCount === 1 ? "hustle" : "hustles"}
                  </span>
                </div>
                
                <div className="space-y-8">
                  {tools.map(({ toolId, toolTitle, toolEmoji, generations: toolGens }) => (
                    <div key={toolId} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{toolEmoji}</span>
                        <h3 className="text-lg font-semibold">{toolTitle}</h3>
                        <span className="text-muted-foreground text-sm">
                          ({toolGens.length})
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {toolGens.map((gen) => (
                          <GenerationCard
                            key={gen.id}
                            emoji={gen.tool_emoji}
                            title={gen.tool_title}
                            createdAt={gen.created_at}
                            outputPreview={gen.output}
                            onClick={() => handleCardClick(gen)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedGeneration && (
            <GenerationDetailModal
              isOpen={isDetailModalOpen}
              onClose={() => setIsDetailModalOpen(false)}
              emoji={selectedGeneration.tool_emoji}
              title={selectedGeneration.tool_title}
              createdAt={selectedGeneration.created_at}
              inputs={selectedGeneration.inputs}
              output={selectedGeneration.output}
              onCopy={handleCopy}
              onDelete={handleDelete}
              toolId={selectedGeneration.tool_id}
              generationId={selectedGeneration.id}
              onSave={fetchGenerations}
            />
          )}
        </>
      )}
    </div>
  );
}
