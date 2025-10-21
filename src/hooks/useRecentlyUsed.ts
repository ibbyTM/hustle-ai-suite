import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RecentTool {
  tool_id: string;
  tool_title: string;
  tool_emoji: string;
  created_at: string;
}

export function useRecentlyUsed(limit = 5) {
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentTools();
    } else {
      setRecentTools([]);
      setIsLoading(false);
    }
  }, [user, limit]);

  const fetchRecentTools = async () => {
    try {
      const { data, error } = await supabase
        .from("generations")
        .select("tool_id, tool_title, tool_emoji, created_at")
        .order("created_at", { ascending: false })
        .limit(limit * 3); // Fetch more to account for duplicates

      if (error) throw error;

      // Get unique tools (most recent of each)
      const uniqueTools = new Map<string, RecentTool>();
      data?.forEach((tool) => {
        if (!uniqueTools.has(tool.tool_id)) {
          uniqueTools.set(tool.tool_id, tool);
        }
      });

      setRecentTools(Array.from(uniqueTools.values()).slice(0, limit));
    } catch (error) {
      console.error("Error fetching recent tools:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recentTools,
    isLoading,
  };
}
