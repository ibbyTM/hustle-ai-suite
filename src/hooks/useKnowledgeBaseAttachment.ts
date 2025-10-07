import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KnowledgeBase } from "@/types/knowledgeBase";

export function useKnowledgeBaseAttachment(toolId: string, isOpen: boolean) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [attachedKB, setAttachedKB] = useState<KnowledgeBase | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadKnowledgeBases();
      loadAttachment();
    }
  }, [isOpen]);

  const loadKnowledgeBases = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("knowledge_bases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setKnowledgeBases(
          data.map((kb) => ({
            ...kb,
            brand_voice: kb.brand_voice as any,
            products: kb.products as any,
            audience: kb.audience as any,
            offers: kb.offers as any,
            faqs: kb.faqs as any,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading knowledge bases:", error);
    }
  };

  const loadAttachment = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("tool_attachments")
        .select("knowledge_base_id")
        .eq("user_id", user.id)
        .eq("tool_id", toolId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const { data: kb } = await supabase
          .from("knowledge_bases")
          .select("*")
          .eq("id", data.knowledge_base_id)
          .single();

        if (kb) {
          setAttachedKB({
            ...kb,
            brand_voice: kb.brand_voice as any,
            products: kb.products as any,
            audience: kb.audience as any,
            offers: kb.offers as any,
            faqs: kb.faqs as any,
          });
        }
      }
    } catch (error) {
      console.error("Error loading attachment:", error);
    }
  };

  const attachKB = async (kbId: string | null) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (kbId === null) {
        await supabase.from("tool_attachments").delete().eq("user_id", user.id).eq("tool_id", toolId);
        setAttachedKB(null);
        toast({ title: "Knowledge Base detached" });
        return;
      }

      await supabase.from("tool_attachments").upsert(
        {
          user_id: user.id,
          tool_id: toolId,
          knowledge_base_id: kbId,
        },
        { onConflict: "user_id,tool_id" }
      );

      const kb = knowledgeBases.find((k) => k.id === kbId);
      setAttachedKB(kb || null);
      toast({ title: "Knowledge Base attached" });
    } catch (error: any) {
      toast({
        title: "Failed to attach",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const buildKBContext = (): string => {
    if (!attachedKB) return "";

    let context = "\n\n=== KNOWLEDGE BASE CONTEXT ===\n";

    if (attachedKB.brand_voice?.tone || attachedKB.brand_voice?.style) {
      context += "\nBrand Voice:\n";
      if (attachedKB.brand_voice.tone) context += `Tone: ${attachedKB.brand_voice.tone}\n`;
      if (attachedKB.brand_voice.style) context += `Style: ${attachedKB.brand_voice.style}\n`;
    }

    if (attachedKB.products && attachedKB.products.length > 0) {
      context += "\nProducts:\n";
      attachedKB.products.forEach((product) => {
        context += `- ${product.name}\n`;
        if (product.features) context += `  Features: ${product.features.join(", ")}\n`;
        if (product.benefits) context += `  Benefits: ${product.benefits.join(", ")}\n`;
      });
    }

    if (attachedKB.audience?.icp) {
      context += `\nTarget Audience: ${attachedKB.audience.icp}\n`;
      if (attachedKB.audience.pains)
        context += `Pain Points: ${attachedKB.audience.pains.join(", ")}\n`;
      if (attachedKB.audience.desires)
        context += `Desires: ${attachedKB.audience.desires.join(", ")}\n`;
    }

    return context;
  };

  return {
    knowledgeBases,
    attachedKB,
    attachKB,
    buildKBContext,
  };
}
