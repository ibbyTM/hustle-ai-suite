import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("tool_id")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data?.map((f) => f.tool_id) || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (toolId: string) => {
    if (!user) return;

    // Optimistic update
    setFavorites((prev) => [...prev, toolId]);

    try {
      const { error } = await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, tool_id: toolId });

      if (error) throw error;
      
      toast({
        title: "Added to favorites",
        description: "Tool pinned for quick access",
      });
    } catch (error) {
      // Revert on error
      setFavorites((prev) => prev.filter((id) => id !== toolId));
      toast({
        title: "Error",
        description: "Failed to add favorite",
        variant: "destructive",
      });
    }
  };

  const removeFavorite = async (toolId: string) => {
    if (!user) return;

    // Optimistic update
    setFavorites((prev) => prev.filter((id) => id !== toolId));

    try {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("tool_id", toolId);

      if (error) throw error;
      
      toast({
        title: "Removed from favorites",
        description: "Tool unpinned",
      });
    } catch (error) {
      // Revert on error
      setFavorites((prev) => [...prev, toolId]);
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
