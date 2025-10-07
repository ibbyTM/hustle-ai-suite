import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KnowledgeBaseCard } from "@/components/KnowledgeBaseCard";
import { supabase } from "@/integrations/supabase/client";
import { KnowledgeBase } from "@/types/knowledgeBase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function KnowledgeBases() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [attachmentCounts, setAttachmentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    try {
      const { data: kbData, error: kbError } = await supabase
        .from("knowledge_bases")
        .select("*")
        .order("updated_at", { ascending: false });

      if (kbError) throw kbError;
      
      const typedKBs = kbData?.map(kb => ({
        ...kb,
        brand_voice: kb.brand_voice as any,
        products: kb.products as any,
        audience: kb.audience as any,
        offers: kb.offers as any,
        faqs: kb.faqs as any,
      })) || [];

      const { data: attachmentData, error: attachmentError } = await supabase
        .from("tool_attachments")
        .select("knowledge_base_id");

      if (attachmentError) throw attachmentError;

      const counts: Record<string, number> = {};
      attachmentData?.forEach((attachment) => {
        counts[attachment.knowledge_base_id] = (counts[attachment.knowledge_base_id] || 0) + 1;
      });

      setKnowledgeBases(typedKBs);
      setAttachmentCounts(counts);
    } catch (error: any) {
      toast({
        title: "Error loading knowledge bases",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredKBs = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Knowledge Bases</h1>
        <p className="text-muted-foreground text-lg">
          Train your hustle once. Reuse it across every tool.
        </p>
        <p className="text-muted-foreground mt-1">
          Centralize brand voice, product facts, offers, and FAQs—then plug it into any HustleHub generator.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge bases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate("/knowledge-bases/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Knowledge Base
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ))}
        </div>
      ) : filteredKBs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "No knowledge bases found" : "No knowledge bases yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first knowledge base to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/knowledge-bases/new")} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Knowledge Base
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKBs.map((kb) => (
            <KnowledgeBaseCard
              key={kb.id}
              kb={kb}
              attachmentCount={attachmentCounts[kb.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
