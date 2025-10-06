import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Copy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { automations } from "@/data/automations";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryType } from "@/types/automation";

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
      .map((category) => ({
        category,
        generations: grouped[category],
      }));
  };

  const handleCopy = (output: string) => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("generations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setGenerations(generations.filter((gen) => gen.id !== id));
      toast.success("Hustle deleted");
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Hustles</h1>
        <p className="text-muted-foreground text-lg">
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
        <div className="space-y-8">
          {groupedGenerations().map(({ category, generations: categoryGens }) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CategoryBadge category={category} />
                <span className="text-muted-foreground text-sm">
                  {categoryGens.length} {categoryGens.length === 1 ? "hustle" : "hustles"}
                </span>
              </div>
              
              <div className="space-y-4">
                {categoryGens.map((gen) => (
                  <div
                    key={gen.id}
                    className="bg-gradient-card border border-border rounded-2xl p-6 hover:shadow-glow transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{gen.tool_emoji}</div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{gen.tool_title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(gen.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(gen.output)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(gen.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {Object.keys(gen.inputs).length > 0 && (
                      <div className="mb-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Inputs Used:</div>
                        <div className="space-y-1">
                          {Object.entries(gen.inputs).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium capitalize">{key}:</span>{" "}
                              <span className="text-muted-foreground">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {gen.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
