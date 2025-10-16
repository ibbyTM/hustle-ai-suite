import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseAgentGenerationProps {
  toolId: string;
  toolTitle: string;
  toolEmoji: string;
}

export function useAgentGeneration({ toolId, toolTitle, toolEmoji }: UseAgentGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string>("");
  const { toast } = useToast();

  const generate = async (prompt: string, inputs: Record<string, any>) => {
    setIsGenerating(true);
    setOutput("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("generate-hustle", {
        body: { prompt, toolTitle: toolTitle },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      const generatedOutput = data.generatedText;
      setOutput(generatedOutput);

      // Save to database
      const { data: savedGeneration, error: saveError } = await supabase
        .from("generations")
        .insert({
          user_id: user.id,
          tool_id: toolId,
          tool_title: toolTitle,
          tool_emoji: toolEmoji,
          inputs,
          output: generatedOutput,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        title: "Generated Successfully",
        description: "Your content is ready!",
      });

      return { generatedOutput, generationId: savedGeneration?.id };
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, output, setOutput };
}
