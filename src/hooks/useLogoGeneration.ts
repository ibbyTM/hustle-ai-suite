import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseLogoGenerationProps {
  toolId: string;
  toolTitle: string;
  toolEmoji: string;
}

export interface LogoVariation {
  id: string;
  imageUrl: string;
  isGenerating: boolean;
}

export function useLogoGeneration({ toolId, toolTitle, toolEmoji }: UseLogoGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<LogoVariation[]>([]);
  const { toast } = useToast();

  const generate = async (inputs: Record<string, any>) => {
    setIsGenerating(true);
    setVariations([
      { id: '1', imageUrl: '', isGenerating: true },
      { id: '2', imageUrl: '', isGenerating: true },
      { id: '3', imageUrl: '', isGenerating: true },
    ]);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: { session } } = await supabase.auth.getSession();

      const variationPromises = [1, 2, 3].map(async (index) => {
        const { data, error } = await supabase.functions.invoke("generate-logo", {
          body: { ...inputs, variationIndex: index },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (error) throw error;
        return { id: String(index), imageUrl: data.imageUrl, isGenerating: false };
      });

      const results = await Promise.all(variationPromises);
      setVariations(results);

      const outputData = JSON.stringify(results.map(r => r.imageUrl));
      
      await supabase
        .from("generations")
        .insert({
          user_id: user.id,
          tool_id: toolId,
          tool_title: toolTitle,
          tool_emoji: toolEmoji,
          inputs,
          output: outputData,
        });

      toast({
        title: "Logos Generated Successfully",
        description: "Your 3 logo variations are ready!",
      });

    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate logos. Please try again.",
        variant: "destructive",
      });
      setVariations([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, variations, setVariations };
}
