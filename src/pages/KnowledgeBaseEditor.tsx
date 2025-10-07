import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KnowledgeBase, BrandVoice, Product, Audience, Offer, FAQ } from "@/types/knowledgeBase";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function KnowledgeBaseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "new";

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    tone: "",
    style: "",
    dos: [],
    donts: []
  });
  
  const [products, setProducts] = useState<Product[]>([{
    name: "",
    features: [],
    benefits: [],
    proof: "",
    pricing: "",
    guarantees: ""
  }]);
  
  const [audience, setAudience] = useState<Audience>({
    icp: "",
    pains: [],
    desires: [],
    objections: []
  });
  
  const [offers, setOffers] = useState<Offer[]>([{
    title: "",
    description: "",
    bonuses: [],
    urgency: "",
    riskReversal: ""
  }]);
  
  const [faqs, setFaqs] = useState<FAQ[]>([{
    question: "",
    answer: ""
  }]);

  useEffect(() => {
    if (!isNew && id) {
      loadKnowledgeBase();
    }
  }, [id, isNew]);

  const loadKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from("knowledge_bases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setName(data.name);
      setDescription(data.description || "");
      setTags(data.tags?.join(", ") || "");
      setBrandVoice((data.brand_voice as any) || {});
      setProducts((data.products as any) || [{name: "", features: [], benefits: [], proof: "", pricing: "", guarantees: ""}]);
      setAudience((data.audience as any) || {});
      setOffers((data.offers as any) || [{title: "", description: "", bonuses: [], urgency: "", riskReversal: ""}]);
      setFaqs((data.faqs as any) || [{question: "", answer: ""}]);
    } catch (error: any) {
      toast({
        title: "Error loading knowledge base",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your knowledge base",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const kbData: any = {
        name: name.trim(),
        description: description.trim() || null,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        brand_voice: brandVoice as any,
        products: products as any,
        audience: audience as any,
        offers: offers as any,
        faqs: faqs as any
      };

      if (isNew) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("knowledge_bases")
          .insert([{ ...kbData, user_id: user?.id }])
          .select()
          .single();

        if (error) throw error;

        toast({ title: "Knowledge base created" });
        navigate(`/knowledge-bases/${data.id}`);
      } else {
        const { error } = await supabase
          .from("knowledge_bases")
          .update(kbData)
          .eq("id", id);

        if (error) throw error;

        toast({ title: "Knowledge base updated" });
      }
    } catch (error: any) {
      toast({
        title: "Error saving knowledge base",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("knowledge_bases")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Knowledge base deleted" });
      navigate("/knowledge-bases");
    } catch (error: any) {
      toast({
        title: "Error deleting knowledge base",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/knowledge-bases")} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Knowledge Bases
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {isNew ? "New Knowledge Base" : "Edit Knowledge Base"}
          </h1>
          
          <div className="flex gap-2">
            {!isNew && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Knowledge Base?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this knowledge base and detach it from all tools. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Name, description, and tags for your knowledge base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Premium Course Launch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this knowledge base..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="e.g., course, online business, B2C (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
              <CardDescription>Define your brand's tone, style, and guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Input
                  id="tone"
                  placeholder="e.g., Professional yet friendly, energetic, authoritative"
                  value={brandVoice.tone || ""}
                  onChange={(e) => setBrandVoice({...brandVoice, tone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Textarea
                  id="style"
                  placeholder="Describe your writing style, sentence structure preferences, etc."
                  value={brandVoice.style || ""}
                  onChange={(e) => setBrandVoice({...brandVoice, style: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dos">Do's (one per line)</Label>
                <Textarea
                  id="dos"
                  placeholder="- Use active voice&#10;- Keep sentences short&#10;- Include social proof"
                  value={brandVoice.dos?.join("\n") || ""}
                  onChange={(e) => setBrandVoice({...brandVoice, dos: e.target.value.split("\n").filter(Boolean)})}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donts">Don'ts (one per line)</Label>
                <Textarea
                  id="donts"
                  placeholder="- Avoid jargon&#10;- Don't use passive voice&#10;- Never oversell"
                  value={brandVoice.donts?.join("\n") || ""}
                  onChange={(e) => setBrandVoice({...brandVoice, donts: e.target.value.split("\n").filter(Boolean)})}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience</CardTitle>
              <CardDescription>Define your ideal customer profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icp">Ideal Customer Profile</Label>
                <Textarea
                  id="icp"
                  placeholder="Describe your ideal customer..."
                  value={audience.icp || ""}
                  onChange={(e) => setAudience({...audience, icp: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pains">Pain Points (one per line)</Label>
                <Textarea
                  id="pains"
                  placeholder="- Struggling with time management&#10;- Overwhelmed by complexity"
                  value={audience.pains?.join("\n") || ""}
                  onChange={(e) => setAudience({...audience, pains: e.target.value.split("\n").filter(Boolean)})}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="desires">Desires (one per line)</Label>
                <Textarea
                  id="desires"
                  placeholder="- More free time&#10;- Financial freedom"
                  value={audience.desires?.join("\n") || ""}
                  onChange={(e) => setAudience({...audience, desires: e.target.value.split("\n").filter(Boolean)})}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Features, benefits, and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Your Product Name"
                  value={products[0]?.name || ""}
                  onChange={(e) => {
                    const newProducts = [...products];
                    newProducts[0] = {...newProducts[0], name: e.target.value};
                    setProducts(newProducts);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  placeholder="- Feature 1&#10;- Feature 2"
                  value={products[0]?.features?.join("\n") || ""}
                  onChange={(e) => {
                    const newProducts = [...products];
                    newProducts[0] = {...newProducts[0], features: e.target.value.split("\n").filter(Boolean)};
                    setProducts(newProducts);
                  }}
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  placeholder="- Benefit 1&#10;- Benefit 2"
                  value={products[0]?.benefits?.join("\n") || ""}
                  onChange={(e) => {
                    const newProducts = [...products];
                    newProducts[0] = {...newProducts[0], benefits: e.target.value.split("\n").filter(Boolean)};
                    setProducts(newProducts);
                  }}
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing</Label>
                <Textarea
                  id="pricing"
                  placeholder="$997 one-time payment or 3 payments of $397"
                  value={products[0]?.pricing || ""}
                  onChange={(e) => {
                    const newProducts = [...products];
                    newProducts[0] = {...newProducts[0], pricing: e.target.value};
                    setProducts(newProducts);
                  }}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guarantees">Guarantees</Label>
                <Textarea
                  id="guarantees"
                  placeholder="30-day money-back guarantee, no questions asked"
                  value={products[0]?.guarantees || ""}
                  onChange={(e) => {
                    const newProducts = [...products];
                    newProducts[0] = {...newProducts[0], guarantees: e.target.value};
                    setProducts(newProducts);
                  }}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers about your product/service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`faq-q-${index}`}>Question {index + 1}</Label>
                    <Input
                      id={`faq-q-${index}`}
                      placeholder="What is...?"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`faq-a-${index}`}>Answer {index + 1}</Label>
                    <Textarea
                      id={`faq-a-${index}`}
                      placeholder="The answer is..."
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].answer = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      rows={3}
                    />
                  </div>
                  
                  {faqs.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                    >
                      Remove FAQ
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
              >
                Add FAQ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
